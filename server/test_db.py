import sys
import os
sys.path.append(os.getcwd())
from app.db.session import SessionLocal
from app.models.category import Category
db = SessionLocal()
cats = db.query(Category).all()
print([c.name for c in cats])
