from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class InventoryLogBase(BaseModel):
    date_display: str
    type: str  # "Input" | "Output"
    product_id: Optional[int] = None
    product_name: str
    size: Optional[str] = None
    qty: int
    ref_id: str
    status: str = "Completed"
    notes: Optional[str] = None

class InventoryLogCreate(InventoryLogBase):
    pass

class InventoryLogResponse(InventoryLogBase):
    id: int
    created_at: datetime

    # Display properties matching frontend admin/product.tsx history
    @property
    def date(self) -> str:
        return self.date_display

    @property
    def product(self) -> str:
        return self.product_name

    @property
    def refId(self) -> str:
        return self.ref_id

    model_config = ConfigDict(from_attributes=True)
