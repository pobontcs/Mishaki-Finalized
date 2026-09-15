from app.db.base import Base
from app.db.session import engine, SessionLocal
from sqlalchemy import text
from app.models.settings import StoreSetting, LandingSetting

def migrate():
    print("Running database schema updates...")
    with engine.connect() as conn:
        # Check and add buying_price
        conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS buying_price FLOAT DEFAULT 0.0;"))
        # Check and add selling_price
        conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS selling_price FLOAT DEFAULT 0.0;"))
        # Check and add stock_quantity
        conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0;"))

        # Synchronize selling_price with price
        conn.execute(text("UPDATE products SET selling_price = price WHERE selling_price = 0.0 OR selling_price IS NULL;"))
        # Populate realistic buying_price (60% of retail price) for existing items
        conn.execute(text("UPDATE products SET buying_price = ROUND((price * 0.6)::numeric, 2) WHERE buying_price = 0.0 OR buying_price IS NULL;"))
        # Populate stock_quantity from sizes
        conn.execute(text("UPDATE products p SET stock_quantity = COALESCE((SELECT SUM(stock) FROM product_sizes WHERE product_id = p.id), 0) WHERE stock_quantity = 0;"))
        conn.commit()
        print("✓ Products table columns updated and synchronized.")

    # Create store_settings table
    Base.metadata.create_all(bind=engine)
    print("✓ Table store_settings verified/created.")

    # Add columns for new 4-row layout on landing_settings
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE landing_settings ADD COLUMN new_arrivals_images TEXT DEFAULT '[]';"))
            conn.execute(text("ALTER TABLE landing_settings ADD COLUMN about_image_url VARCHAR(1000);"))
            conn.execute(text("ALTER TABLE landing_settings ADD COLUMN about_note TEXT DEFAULT '';"))
            conn.commit()
            print("✓ landing_settings columns updated.")
        except Exception as e:
            # Column might already exist
            pass

    # Seed default StoreSetting if missing
    db = SessionLocal()
    try:
        setting = db.query(StoreSetting).first()
        if not setting:
            setting = StoreSetting(
                store_name="Mishaki",
                store_tagline="Modern & Traditional Fashion",
                contact_email="support@mishaki.com",
                contact_phone="+880 1700-000000",
                address="Mishaki Tower, Banani, Dhaka, Bangladesh",
                currency_symbol="$",
                currency_code="USD",
                shipping_fee_standard=15.00,
                shipping_fee_express=25.00,
                free_shipping_threshold=150.00,
                estimated_delivery_days="3-5 Business Days",
                enable_cod=True,
                enable_card=True,
                enable_bkash=True,
                bkash_merchant_number="01712-345678",
                enable_nagad=False,
                announcement_text="✨ Seasonal Sale: Enjoy free delivery on orders over $150!",
                announcement_active=True,
                maintenance_mode=False,
                low_stock_threshold=10
            )
            db.add(setting)
            db.commit()
            print("✓ Default store settings created.")
        else:
            print("✓ Store settings already exists.")

        # Seed LandingSetting if missing
        landing_setting = db.query(LandingSetting).first()
        if not landing_setting:
            landing_setting = LandingSetting(
                hero_title="Welcome to Mishaki",
                hero_subtitle="Discover the future of fashion.",
                new_arrivals_images="[]",
                about_title="Our Vision",
                about_description="Blending modern aesthetics with timeless traditions to create something truly unique.",
                about_image_url="",
                about_note="A journey born from passion and elegance.",
                feature_blocks="[]",
                primary_color="#991b1b",
                background_style="clean-white"
            )
            db.add(landing_setting)
            db.commit()
            print("✓ Default landing settings created.")
        else:
            print("✓ Landing settings already exists.")
            
    finally:
        db.close()

    print("All database updates completed successfully!")

if __name__ == "__main__":
    migrate()
