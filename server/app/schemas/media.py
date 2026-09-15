from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class LandingMediaSlotBase(BaseModel):
    slot_number: int
    slot_type: str = "gallery"
    title: Optional[str] = None
    subtitle: Optional[str] = None
    image_url: Optional[str] = None
    link_url: Optional[str] = None
    is_active: bool = True

class LandingMediaSlotUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    image_url: Optional[str] = None
    link_url: Optional[str] = None
    is_active: Optional[bool] = None

class LandingMediaSlotResponse(LandingMediaSlotBase):
    id: int
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
