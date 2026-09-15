from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Boolean, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class LandingMediaSlot(Base):
    """
    Landing Page Media slots matching Section B of admin/product.tsx:
    5 Slots: 1 Main Banner, 4 Gallery Slots.
    """
    __tablename__ = "landing_media_slots"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    slot_number: Mapped[int] = mapped_column(Integer, unique=True, index=True, nullable=False) # 1 to 5
    slot_type: Mapped[str] = mapped_column(String(50), default="gallery") # "main" for slot 1, "gallery" for 2-5
    title: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    subtitle: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    link_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
