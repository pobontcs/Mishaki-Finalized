import sys
import os

# Add server directory to python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import delete
from app.db.session import SessionLocal

from app.models.product import Product, ProductImage, ProductSize
from app.models.category import Category
from app.models.order import Order, OrderItem
from app.models.inventory import InventoryLog
from app.models.media import LandingMediaSlot

def reset_database():
    print("Wiping all demo data (Products, Categories, Orders, Inventory, Landing Slots)...")
    
    db = SessionLocal()
    try:
        # Delete in order of dependencies
        db.execute(delete(OrderItem))
        db.execute(delete(Order))
        
        db.execute(delete(ProductSize))
        db.execute(delete(ProductImage))
        db.execute(delete(InventoryLog))
        db.execute(delete(Product))
        
        db.execute(delete(Category))
        db.execute(delete(LandingMediaSlot))
        
        db.commit()
        print("✅ Database successfully cleared. You can now start fresh!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error clearing database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    reset_database()
