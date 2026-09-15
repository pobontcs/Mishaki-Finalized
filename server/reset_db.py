import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.base import Base
from app.db.session import engine, SessionLocal
from seed import seed_database
import logging

logging.basicConfig(level=logging.INFO)

def reset_database():
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    
    print("Seeding database...")
    # we need to call seed_database but it contains a check `if db.query(Category).first(): return`
    # since we just dropped all, the tables are empty and seed will proceed.
    seed_database()
    print("Database reset successfully.")

if __name__ == "__main__":
    reset_database()
