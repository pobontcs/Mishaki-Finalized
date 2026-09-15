from datetime import datetime
from typing import Optional
from sqlalchemy import String, Text, Integer, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class InventoryLog(Base):
    """
    Tracks inventory stock movements (Input / Output) matching
    the admin product management history tab.
    """
    __tablename__ = "inventory_logs"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    date_display: Mapped[str] = mapped_column(String(50), nullable=False) # e.g. "Oct 26, 2023"
    type: Mapped[str] = mapped_column(String(50), nullable=False)  # "Input" (Restock) or "Output" (Sale/Adjustment)
    
    product_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("products.id", ondelete="SET NULL"), nullable=True, index=True
    )
    product_name: Mapped[str] = mapped_column(String(255), nullable=False)
    size: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    qty: Mapped[int] = mapped_column(Integer, nullable=False)  # Positive for input (+50), negative for output (-2)
    ref_id: Mapped[str] = mapped_column(String(100), nullable=False)  # "Sold ID: #ORD-9021", "PO-RESTOCK-089"
    status: Mapped[str] = mapped_column(String(50), default="Completed")  # "Shipped", "Pending", "Received"
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    product = relationship("Product", back_populates="inventory_logs")
