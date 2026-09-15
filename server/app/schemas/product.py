from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict

# --- SIZE SCHEMAS ---
class ProductSizeBase(BaseModel):
    size: str
    stock: int = 0

class ProductSizeCreate(ProductSizeBase):
    pass

class ProductSizeResponse(ProductSizeBase):
    id: int
    product_id: int

    model_config = ConfigDict(from_attributes=True)


# --- IMAGE SCHEMAS ---
class ProductImageBase(BaseModel):
    image_url: str
    alt_text: Optional[str] = None
    is_main: bool = False
    sort_order: int = 0

class ProductImageCreate(ProductImageBase):
    pass

class ProductImageResponse(ProductImageBase):
    id: int
    product_id: int

    model_config = ConfigDict(from_attributes=True)


# --- PRODUCT SCHEMAS ---
class ProductBase(BaseModel):
    sku: str
    name: str
    description: Optional[str] = None
    price: float = 0.0
    buying_price: float = 0.0
    selling_price: float = 0.0
    compare_at_price: Optional[float] = None
    discount_percentage: float = 0.0
    stock_quantity: int = 0
    material: Optional[str] = None
    color: Optional[str] = None
    variant: Optional[str] = None
    category_id: Optional[int] = None
    is_active: bool = True
    is_dynamic_stock: bool = False

class ProductCreate(ProductBase):
    sizes: Optional[List[ProductSizeCreate]] = []
    images: Optional[List[ProductImageCreate]] = []

class ProductUpdate(BaseModel):
    sku: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    buying_price: Optional[float] = None
    selling_price: Optional[float] = None
    compare_at_price: Optional[float] = None
    discount_percentage: Optional[float] = None
    stock_quantity: Optional[int] = None
    material: Optional[str] = None
    color: Optional[str] = None
    variant: Optional[str] = None
    category_id: Optional[int] = None
    is_active: Optional[bool] = None
    is_dynamic_stock: Optional[bool] = None

class ProductDiscountUpdate(BaseModel):
    discount_percentage: float = Field(..., ge=0, le=100)

class ProductResponse(ProductBase):
    id: int
    total_stock: int = 0
    profit_margin: float = 0.0
    profit_margin_percentage: float = 0.0
    main_image: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    # Aliases to match Next.js frontend Card & Shop component keys
    @property
    def title(self) -> str:
        return self.name

    @property
    def image(self) -> Optional[str]:
        return self.main_image

    sizes: List[ProductSizeResponse] = []
    images: List[ProductImageResponse] = []

    model_config = ConfigDict(from_attributes=True)

class ProductDetailResponse(ProductResponse):
    pass
