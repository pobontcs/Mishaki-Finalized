from datetime import datetime
import random
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status, Response, BackgroundTasks
from sqlalchemy.orm import Session, selectinload
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select, or_, desc, func

from app.db.session import get_db
from app.models.order import Order, OrderItem
from app.models.inventory import InventoryLog
from app.models.product import ProductSize
from app.schemas.order import (
    OrderCreate, OrderStatusUpdate, OrderResponse, OrderDetailResponse, OrderCancelRequest
)
from app.api.deps import get_current_user, get_current_admin_user
from app.services.email import send_custom_order_email
from pydantic import BaseModel, EmailStr

class EmailRequest(BaseModel):
    subject: str
    body: str

router = APIRouter()

@router.get("", response_model=List[OrderDetailResponse])
def list_orders(
    response: Response,
    status_filter: Optional[str] = Query("All", alias="status", description="Status filter (All, Pending, Completed, Cancelled)"),
    search: Optional[str] = Query(None, description="Search by customer name or order number"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    query = select(Order).options(selectinload(Order.items)).order_by(desc(Order.created_at))

    if status_filter and status_filter != "All":
        query = query.where(Order.status.ilike(status_filter))

    if search:
        search_fmt = f"%{search}%"
        query = query.where(
            or_(
                Order.customer_name.ilike(search_fmt),
                Order.order_number.ilike(search_fmt),
                Order.email.ilike(search_fmt)
            )
        )
        
    count_query = select(func.count()).select_from(query.subquery())
    total = db.scalar(count_query) or 0
    response.headers["X-Total-Count"] = str(total)

    orders = db.scalars(query.offset(skip).limit(limit)).all()
    return orders


@router.get("/{order_id}", response_model=OrderDetailResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order


@router.post("", response_model=OrderDetailResponse, status_code=status.HTTP_201_CREATED)
def create_order(order_in: OrderCreate, db: Session = Depends(get_db)):
    # Extract card last 4 digits securely
    card_last4 = None
    if order_in.card_number and len(order_in.card_number) >= 4:
        card_last4 = order_in.card_number.replace(" ", "")[-4:]

    # Determine initial payment status based on payment method
    payment_status = "Pending"
    if order_in.payment_method == "Card":
        payment_status = "Paid"
    elif order_in.payment_method == "Bkash" and order_in.transaction_id:
        payment_status = "Paid"

    max_retries = 5
    for attempt in range(max_retries):
        random_num = random.randint(1000, 9999)
        order_number = f"#ORD-{random_num}"

        order = Order(
            order_number=order_number,
            user_id=order_in.user_id,
            customer_name=order_in.customer_name,
            email=order_in.email,
            phone=order_in.phone,
            street_address=order_in.street_address,
            house_number=order_in.house_number,
            address_description=order_in.address_description,
            city=order_in.city,
            postal_code=order_in.postal_code,
            payment_method=order_in.payment_method,
            payment_status=payment_status,
            bkash_number=order_in.bkash_number,
            transaction_id=order_in.transaction_id,
            card_last4=card_last4,
            subtotal=order_in.subtotal,
            shipping_fee=order_in.shipping_fee,
            discount_amount=order_in.discount_amount,
            total_amount=order_in.total_amount,
            status="Pending",
            notes=order_in.notes
        )
        db.add(order)
        try:
            db.flush()
            break
        except IntegrityError:
            db.rollback()
            if attempt == max_retries - 1:
                raise HTTPException(status_code=500, detail="Failed to generate a unique order number.")
            continue

    # Add Order Items & Inventory Logs
    now_str = datetime.now().strftime("%b %d, %Y")
    for item_data in order_in.items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item_data.product_id,
            product_name=item_data.product_name,
            variant=item_data.variant,
            unit_price=item_data.unit_price,
            quantity=item_data.quantity,
            total_price=item_data.total_price,
            image_url=item_data.image_url
        )
        db.add(order_item)

        # Log Inventory Output (Sale)
        inv_log = InventoryLog(
            date_display=now_str,
            type="Output",
            product_id=item_data.product_id,
            product_name=item_data.product_name,
            size=item_data.variant,
            qty=-item_data.quantity,
            ref_id=f"Sold ID: {order_number}",
            status="Pending",
            notes=f"Order checkout via {order_in.payment_method}"
        )
        db.add(inv_log)

        # Deduct stock from ProductSize if matching size exists
        if item_data.product_id and item_data.variant:
            size_record = db.scalar(
                select(ProductSize).where(
                    ProductSize.product_id == item_data.product_id,
                    ProductSize.size == item_data.variant
                ).with_for_update()
            )
            if size_record:
                if size_record.stock >= item_data.quantity:
                    size_record.stock -= item_data.quantity
                else:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST, 
                        detail=f"Insufficient stock for {item_data.product_name} ({item_data.variant})"
                    )

    db.commit()
    db.refresh(order)
    return order


@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int, 
    status_in: OrderStatusUpdate, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    old_status = order.status
    order.status = status_in.status
    if status_in.payment_status:
        order.payment_status = status_in.payment_status

    db.commit()
    db.refresh(order)
    return order

@router.patch("/{order_id}/cancel-items", response_model=OrderResponse)
def cancel_order_items(
    order_id: int, 
    cancel_req: OrderCancelRequest, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    if order.status == "Cancelled":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order is already cancelled")

    total_deducted = 0.0

    for cancel_item in cancel_req.items:
        if cancel_item.cancel_quantity <= 0:
            continue
            
        item = next((i for i in order.items if i.id == cancel_item.item_id), None)
        if not item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Order item {cancel_item.item_id} not found")
            
        if cancel_item.cancel_quantity > item.quantity:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Cannot cancel more than ordered quantity for item {item.id}")
            
        deduction = item.unit_price * cancel_item.cancel_quantity
        total_deducted += deduction
        
        item.quantity -= cancel_item.cancel_quantity
        item.total_price -= deduction

        if item.product_id and item.variant:
            size_record = db.scalar(
                select(ProductSize).where(
                    ProductSize.product_id == item.product_id,
                    ProductSize.size == item.variant
                )
            )
            if size_record:
                size_record.stock += cancel_item.cancel_quantity
                
                inv_log = InventoryLog(
                    date_display=datetime.now().strftime("%b %d, %Y"),
                    type="Input",
                    product_id=item.product_id,
                    product_name=item.product_name,
                    size=item.variant,
                    qty=cancel_item.cancel_quantity,
                    ref_id=f"Cancelled from Order: {order.order_number}",
                    status="Completed",
                    notes="Restocked due to partial order cancellation"
                )
                db.add(inv_log)

    order.subtotal -= total_deducted
    order.total_amount -= total_deducted
    
    # Actually delete the items from the database that reached 0
    items_to_remove = [i for i in order.items if i.quantity == 0]
    for i in items_to_remove:
        db.delete(i)
        
    if len(order.items) == len(items_to_remove):
        order.status = "Cancelled"
        order.shipping_fee = 0.0
        order.total_amount = 0.0

    db.commit()
    db.refresh(order)
    return order

@router.post("/{order_id}/send-email")
async def send_order_email(
    order_id: int, 
    email_req: EmailRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        
    await send_custom_order_email(
        email_to=order.email,
        subject=email_req.subject,
        body=email_req.body
    )
    return {"message": "Email sent successfully"}
