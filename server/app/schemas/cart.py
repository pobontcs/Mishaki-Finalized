from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class CartItemBase(BaseModel):
    product_id: int
    size: Optional[str] = None
    quantity: int = 1

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: int

class CartItemResponse(CartItemBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
