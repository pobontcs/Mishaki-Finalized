from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Text, Float, Integer, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    order_number: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False) # e.g. #ORD-9021
    
    # Customer Details (from Cart Shipping Details)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    customer_name: Mapped[str] = mapped_column(String(150), nullable=False)
    email: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    phone: Mapped[str] = mapped_column(String(50), nullable=False)
    street_address: Mapped[str] = mapped_column(String(255), nullable=False)
    house_number: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    address_description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    postal_code: Mapped[str] = mapped_column(String(20), nullable=False)

    # Payment Details (from Cart Payment Info: Card, Bkash, COD)
    payment_method: Mapped[str] = mapped_column(String(50), nullable=False)  # "Card", "Bkash", "COD"
    payment_status: Mapped[str] = mapped_column(String(50), default="Pending")  # "Pending", "Paid", "Failed"
    bkash_number: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    transaction_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # TrxID
    card_last4: Mapped[Optional[str]] = mapped_column(String(4), nullable=True)

    # Financial Totals
    subtotal: Mapped[float] = mapped_column(Float, nullable=False)
    shipping_fee: Mapped[float] = mapped_column(Float, default=15.00)
    discount_amount: Mapped[float] = mapped_column(Float, default=0.00)
    total_amount: Mapped[float] = mapped_column(Float, nullable=False)

    # Order Processing Status (matches admin tabs: Pending, Completed, Cancelled, Shipped)
    status: Mapped[str] = mapped_column(String(50), default="Pending", index=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    user = relationship("User", back_populates="orders")
    items: Mapped[List["OrderItem"]] = relationship(
        "OrderItem", back_populates="order", cascade="all, delete-orphan"
    )

    @property
    def total_items(self) -> int:
        return sum(item.quantity for item in self.items) if self.items else 0


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True
    )
    product_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("products.id", ondelete="SET NULL"), nullable=True
    )
    
    product_name: Mapped[str] = mapped_column(String(255), nullable=False)
    variant: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # Size or style variant
    unit_price: Mapped[float] = mapped_column(Float, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    total_price: Mapped[float] = mapped_column(Float, nullable=False)
    image_url: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)

    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")
