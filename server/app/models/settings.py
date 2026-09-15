from datetime import datetime
from typing import Optional
from sqlalchemy import String, Text, Float, Integer, Boolean, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class StoreSetting(Base):
    __tablename__ = "store_settings"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    # --- STORE PROFILE ---
    store_name: Mapped[str] = mapped_column(String(255), default="Mishaki", nullable=False)
    store_tagline: Mapped[str] = mapped_column(String(255), default="Modern & Traditional Fashion", nullable=False)
    contact_email: Mapped[str] = mapped_column(String(255), default="support@mishaki.com", nullable=False)
    contact_phone: Mapped[str] = mapped_column(String(50), default="+880 1700-000000", nullable=False)
    address: Mapped[str] = mapped_column(Text, default="Mishaki Tower, Banani, Dhaka, Bangladesh", nullable=False)
    currency_symbol: Mapped[str] = mapped_column(String(10), default="$", nullable=False)
    currency_code: Mapped[str] = mapped_column(String(10), default="USD", nullable=False)

    # --- SHIPPING & DELIVERY ---
    shipping_fee_standard: Mapped[float] = mapped_column(Float, default=15.00, nullable=False)
    shipping_fee_express: Mapped[float] = mapped_column(Float, default=25.00, nullable=False)
    free_shipping_threshold: Mapped[float] = mapped_column(Float, default=150.00, nullable=False)
    estimated_delivery_days: Mapped[str] = mapped_column(String(50), default="3-5 Business Days", nullable=False)

    # --- PAYMENT GATEWAYS ---
    enable_cod: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    enable_card: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    enable_bkash: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    bkash_merchant_number: Mapped[str] = mapped_column(String(50), default="01712-345678", nullable=False)
    enable_nagad: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # --- STORE OPERATIONS & ALERTS ---
    announcement_text: Mapped[Optional[str]] = mapped_column(
        Text, default="✨ Seasonal Sale: Enjoy free delivery on orders over $150!", nullable=True
    )
    announcement_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    maintenance_mode: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    low_stock_threshold: Mapped[int] = mapped_column(Integer, default=10, nullable=False)

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

class LandingSetting(Base):
    __tablename__ = "landing_settings"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    # --- HERO SECTION ---
    hero_title: Mapped[str] = mapped_column(String(255), default="Welcome to Mishaki", nullable=False)
    hero_subtitle: Mapped[str] = mapped_column(String(255), default="Discover the future of fashion.", nullable=False)
    hero_image_url: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)

    # --- NEW ARRIVALS (ROW 2) ---
    new_arrivals_images: Mapped[str] = mapped_column(Text, default="[]", nullable=False)

    # --- ABOUT SECTION (ROW 4) ---
    about_title: Mapped[str] = mapped_column(String(255), default="Our Vision", nullable=False)
    about_description: Mapped[str] = mapped_column(Text, default="Blending modern aesthetics with timeless traditions to create something truly unique.", nullable=False)
    about_image_url: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    about_note: Mapped[str] = mapped_column(Text, default="", nullable=False)

    # --- 3D FEATURE BLOCKS (JSON string for flexibility) ---
    # Example format: [{"id": 1, "title": "...", "description": "...", "icon": "..."}]
    feature_blocks: Mapped[str] = mapped_column(Text, default="[]", nullable=False)

    # --- DESIGN ---
    primary_color: Mapped[str] = mapped_column(String(50), default="#991b1b", nullable=False)
    background_style: Mapped[str] = mapped_column(String(50), default="futuristic-dark", nullable=False)

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
