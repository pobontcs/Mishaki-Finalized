from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status, Response
from sqlalchemy.orm import Session, selectinload
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select, or_, func

from app.db.session import get_db
from app.models.product import Product, ProductSize, ProductImage
from app.models.category import Category
from app.schemas.product import (
    ProductCreate, ProductUpdate, ProductDiscountUpdate, 
    ProductResponse, ProductDetailResponse
)
from app.api.deps import get_current_admin_user

router = APIRouter()

@router.get("", response_model=List[ProductResponse])
def list_products(
    response: Response,
    category: Optional[str] = Query(None, description="Category name (e.g. Traditional, Western, Daily Life)"),
    search: Optional[str] = Query(None, description="Search term for title/name or description"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = select(Product).options(
        selectinload(Product.sizes),
        selectinload(Product.images),
        selectinload(Product.category)
    ).where(Product.is_active == True)

    if category and category != "All":
        # Join category to filter by category name or slug
        query = query.join(Product.category).where(
            or_(
                Category.name.ilike(category),
                Category.slug.ilike(category.lower())
            )
        )

    if search:
        search_fmt = f"%{search}%"
        query = query.where(
            or_(
                Product.name.ilike(search_fmt),
                Product.description.ilike(search_fmt),
                Product.sku.ilike(search_fmt),
                Product.variant.ilike(search_fmt)
            )
        )

    count_query = select(func.count()).select_from(query.subquery())
    total = db.scalar(count_query) or 0
    response.headers["X-Total-Count"] = str(total)

    products = db.scalars(query.offset(skip).limit(limit)).all()
    return products


@router.get("/{product_id}", response_model=ProductDetailResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product


@router.post("", response_model=ProductDetailResponse, status_code=status.HTTP_201_CREATED)
def create_product(product_in: ProductCreate, db: Session = Depends(get_db), current_user = Depends(get_current_admin_user)):
    product_data = product_in.model_dump(exclude={"sizes", "images"})
    
    # Harmonize price and selling_price
    if not product_data.get("selling_price") and product_data.get("price"):
        product_data["selling_price"] = product_data["price"]
    elif product_data.get("selling_price") and not product_data.get("price"):
        product_data["price"] = product_data["selling_price"]

    # Calculate stock quantity from sizes if sizes are present
    if product_in.sizes:
        calc_stock = sum(s.stock for s in product_in.sizes)
        if calc_stock > 0:
            product_data["stock_quantity"] = calc_stock

    product = Product(**product_data)
    db.add(product)
    try:
        db.flush()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Product with this SKU already exists")

    # Add Sizes with starting inventory
    if product_in.sizes:
        for size_data in product_in.sizes:
            size_obj = ProductSize(
                product_id=product.id,
                size=size_data.size,
                stock=size_data.stock
            )
            db.add(size_obj)

    # Add Images
    if product_in.images:
        for img_data in product_in.images:
            img_obj = ProductImage(
                product_id=product.id,
                image_url=img_data.image_url,
                alt_text=img_data.alt_text,
                is_main=img_data.is_main,
                sort_order=img_data.sort_order
            )
            db.add(img_obj)

    db.commit()
    db.refresh(product)
    return product


@router.patch("/{product_id}/discount", response_model=ProductResponse)
def apply_discount(
    product_id: int, 
    discount_in: ProductDiscountUpdate, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    product.discount_percentage = discount_in.discount_percentage
    # Compute compare_at_price if not present
    if not product.compare_at_price:
        product.compare_at_price = round(product.price * 1.2, 2)
        
    db.commit()
    db.refresh(product)
    return product


@router.put("/{product_id}", response_model=ProductDetailResponse)
def update_product(
    product_id: int,
    product_in: ProductUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    update_data = product_in.model_dump(exclude_unset=True)
    if "selling_price" in update_data and "price" not in update_data:
        update_data["price"] = update_data["selling_price"]
    elif "price" in update_data and "selling_price" not in update_data:
        update_data["selling_price"] = update_data["price"]

    for field, value in update_data.items():
        if hasattr(product, field):
            setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_admin_user)):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    
    # Soft delete
    product.is_active = False
    db.commit()
    return None

