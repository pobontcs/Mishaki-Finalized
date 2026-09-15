import sys
import os

# Add server directory to python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal
from app.models.category import Category

def seed_categories():
    print("Seeding default categories...")
    db = SessionLocal()
    try:
        categories_data = [
            {"name": "Traditional", "slug": "traditional", "description": "Traditional collections and cultural wear"},
            {"name": "Western", "slug": "western", "description": "Modern western apparel and premium footwear"},
            {"name": "Daily Life", "slug": "daily-life", "description": "Casual daily wear and comfortable essentials"},
            {"name": "Accessories", "slug": "accessories", "description": "Bags, caps, and lifestyle accessories"},
        ]
        
        # Check if they already exist
        existing = db.query(Category).first()
        if existing:
            print("Categories already exist!")
            return
            
        for c in categories_data:
            cat = Category(**c)
            db.add(cat)
        
        db.commit()
        print("✅ Categories seeded successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_categories()
