import sys
import os
from sqlalchemy import text

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'server')))

from app.db.session import engine

def main():
    with engine.begin() as conn:
        try:
            conn.execute(text("ALTER TABLE products ADD COLUMN is_dynamic_stock BOOLEAN DEFAULT FALSE;"))
            print("Column 'is_dynamic_stock' added successfully to 'products' table.")
        except Exception as e:
            print(f"Error adding column: {e}")

if __name__ == "__main__":
    main()
