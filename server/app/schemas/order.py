from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict

# --- ORDER ITEM SCHEMAS ---
class OrderItemBase(BaseModel):
    product_id: Optional[int] = None
    product_name: str
    variant: Optional[str] = None
    unit_price: float
    quantity: int = 1
    total_price: float
    image_url: Optional[str] = None

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemResponse(OrderItemBase):
    id: int
    order_id: int

    model_config = ConfigDict(from_attributes=True)


# --- ORDER SCHEMAS ---
class OrderCreate(BaseModel):
    user_id: Optional[int] = None
    customer_name: str
    email: str
    phone: str
    street_address: str
    house_number: Optional[str] = None
    address_description: Optional[str] = None
    city: str
    postal_code: str
    
    payment_method: str  # "Card", "Bkash", "COD"
    bkash_number: Optional[str] = None
    transaction_id: Optional[str] = None
    card_number: Optional[str] = None  # Frontend sends card number; backend stores last 4 digits

    subtotal: float
    shipping_fee: float = 15.00
    discount_amount: float = 0.00
    total_amount: float
    notes: Optional[str] = None

    items: List[OrderItemCreate]

class OrderStatusUpdate(BaseModel):
    status: str  # "Pending", "Completed", "Cancelled", "Shipped"
    payment_status: Optional[str] = None

class ItemCancelRequest(BaseModel):
    item_id: int
    cancel_quantity: int

class OrderCancelRequest(BaseModel):
    items: List[ItemCancelRequest]

class OrderResponse(BaseModel):
    id: int
    order_number: str
    customer_name: str
    email: str
    phone: str
    street_address: str
    house_number: Optional[str] = None
    address_description: Optional[str] = None
    city: str
    postal_code: str
    payment_method: str
    payment_status: str
    bkash_number: Optional[str] = None
    transaction_id: Optional[str] = None
    card_last4: Optional[str] = None
    subtotal: float
    shipping_fee: float
    discount_amount: float
    total_amount: float
    status: str
    total_items: int = 0
    created_at: datetime
    updated_at: datetime

    # Display properties for matching Next.js admin/orders.tsx
    @property
    def customer(self) -> str:
        return self.customer_name

    @property
    def date(self) -> str:
        return self.created_at.strftime("%b %d, %Y")

    @property
    def total(self) -> str:
        return f"${self.total_amount:.2f}"

    model_config = ConfigDict(from_attributes=True)

class OrderDetailResponse(OrderResponse):
    items: List[OrderItemResponse] = []

    model_config = ConfigDict(from_attributes=True)
