import sys
import os
from sqlalchemy import text

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'server')))

from app.db.session import engine

def main():
    with engine.begin() as conn:
        try:
            conn.execute(text("ALTER TABLE orders ADD COLUMN house_number VARCHAR(255);"))
            print("Column 'house_number' added successfully to 'orders' table.")
        except Exception as e:
            print(f"Error adding house_number: {e}")
            
        try:
            conn.execute(text("ALTER TABLE orders ADD COLUMN address_description TEXT;"))
            print("Column 'address_description' added successfully to 'orders' table.")
        except Exception as e:
            print(f"Error adding address_description: {e}")

if __name__ == "__main__":
    main()
