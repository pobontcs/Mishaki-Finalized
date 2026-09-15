from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class StoreSettingBase(BaseModel):
    # Store Profile
    store_name: str = "Mishaki"
    store_tagline: str = "Modern & Traditional Fashion"
    contact_email: str = "support@mishaki.com"
    contact_phone: str = "+880 1700-000000"
    address: str = "Mishaki Tower, Banani, Dhaka, Bangladesh"
    currency_symbol: str = "$"
    currency_code: str = "USD"

    # Shipping & Delivery
    shipping_fee_standard: float = Field(15.00, ge=0)
    shipping_fee_express: float = Field(25.00, ge=0)
    free_shipping_threshold: float = Field(150.00, ge=0)
    estimated_delivery_days: str = "3-5 Business Days"

    # Payment Gateways
    enable_cod: bool = True
    enable_card: bool = True
    enable_bkash: bool = True
    bkash_merchant_number: str = "01712-345678"
    enable_nagad: bool = False

    # Store Operations & Alerts
    announcement_text: Optional[str] = "✨ Seasonal Sale: Enjoy free delivery on orders over $150!"
    announcement_active: bool = True
    maintenance_mode: bool = False
    low_stock_threshold: int = Field(10, ge=1)

class StoreSettingUpdate(BaseModel):
    store_name: Optional[str] = None
    store_tagline: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    address: Optional[str] = None
    currency_symbol: Optional[str] = None
    currency_code: Optional[str] = None

    shipping_fee_standard: Optional[float] = None
    shipping_fee_express: Optional[float] = None
    free_shipping_threshold: Optional[float] = None
    estimated_delivery_days: Optional[str] = None

    enable_cod: Optional[bool] = None
    enable_card: Optional[bool] = None
    enable_bkash: Optional[bool] = None
    bkash_merchant_number: Optional[str] = None
    enable_nagad: Optional[bool] = None

    announcement_text: Optional[str] = None
    announcement_active: Optional[bool] = None
    maintenance_mode: Optional[bool] = None
    low_stock_threshold: Optional[int] = None

class StoreSettingResponse(StoreSettingBase):
    id: int
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class LandingSettingBase(BaseModel):
    hero_title: str
    hero_subtitle: str
    hero_image_url: Optional[str] = None
    new_arrivals_images: Optional[str] = None
    about_title: str
    about_description: str
    about_image_url: Optional[str] = None
    about_note: Optional[str] = None
    feature_blocks: str
    primary_color: str
    background_style: str

class LandingSettingUpdate(BaseModel):
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    hero_image_url: Optional[str] = None
    new_arrivals_images: Optional[str] = None
    about_title: Optional[str] = None
    about_description: Optional[str] = None
    about_image_url: Optional[str] = None
    about_note: Optional[str] = None
    feature_blocks: Optional[str] = None
    primary_color: Optional[str] = None
    background_style: Optional[str] = None

class LandingSettingResponse(LandingSettingBase):
    id: int
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
