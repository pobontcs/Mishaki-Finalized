"""
Database Seeder Script for Mishaki E-Commerce Platform
Populates PostgreSQL/SQLite database with the initial catalog, categories,
orders, inventory movements, media slots, and users from the Next.js frontend mockup.
"""

from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.models.category import Category
from app.models.product import Product, ProductSize, ProductImage
from app.models.order import Order, OrderItem
from app.models.inventory import InventoryLog
from app.models.media import LandingMediaSlot
from app.models.user import User
from app.models.settings import StoreSetting
from app.api.v1.endpoints.users import hash_password

def seed_database():
    print("🚀 Initializing database tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(Category).first():
            print("ℹ️ Database already contains data. Skipping seeding.")
            return

        print("📦 Seeding Categories...")
        categories_data = [
            {"name": "Traditional", "slug": "traditional", "description": "Traditional collections and cultural wear"},
            {"name": "Western", "slug": "western", "description": "Modern western apparel and premium footwear"},
            {"name": "Daily Life", "slug": "daily-life", "description": "Casual daily wear and comfortable essentials"},
            {"name": "Accessories", "slug": "accessories", "description": "Bags, caps, and lifestyle accessories"},
        ]
        cat_map = {}
        for c in categories_data:
            cat = Category(**c)
            db.add(cat)
            db.flush()
            cat_map[c["name"]] = cat.id

        print("👤 Seeding Users...")
        admin_user = User(
            name="Admin Mishaki",
            email="admin@mishaki.com",
            phone="+8801700000000",
            hashed_password=hash_password("admin123"),
            address="Mishaki Headquarters, Dhaka",
            role="admin",
            is_active=True
        )
        customer_user = User(
            name="Sarah Jenkins",
            email="sarah.j@example.com",
            phone="+8801711111111",
            hashed_password=hash_password("password123"),
            address="123 Main Street, Dhaka",
            role="customer",
            is_active=True
        )
        db.add(admin_user)
        db.add(customer_user)
        db.flush()

        print("👕 Seeding Products and Sizes...")
        products_data = [
            {
                "sku": "SKU-C001",
                "name": "Classic Cotton T-Shirt",
                "description": "Everyday essential crafted from 100% organic combed cotton for unmatched comfort and breathability.",
                "price": 24.99,
                "compare_at_price": 29.99,
                "discount_percentage": 0.0,
                "material": "100% Organic Cotton",
                "color": "Navy",
                "variant": "MEN APPAREL",
                "category_id": cat_map["Daily Life"],
                "image": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80",
                "sizes": [("XS", 15), ("S", 30), ("M", 45), ("L", 35), ("XL", 20)]
            },
            {
                "sku": "SKU-C002",
                "name": "Denim Trucker Jacket",
                "description": "Classic rugged denim trucker jacket with vintage wash, button front, and reinforced dual chest pockets.",
                "price": 89.00,
                "compare_at_price": 106.80,
                "discount_percentage": 0.0,
                "material": "100% Cotton Denim",
                "color": "Vintage Blue",
                "variant": "UNISEX JACKET",
                "category_id": cat_map["Western"],
                "image": "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80",
                "sizes": [("S", 5), ("M", 12), ("L", 10), ("XL", 5)]
            },
            {
                "sku": "SKU-C003",
                "name": "Fleece Jogger Pants",
                "description": "Ultra-soft brushed fleece joggers featuring an elastic drawstring waistband and ribbed ankle cuffs.",
                "price": 45.50,
                "compare_at_price": 54.60,
                "discount_percentage": 0.0,
                "material": "80% Cotton / 20% Polyester Fleece",
                "color": "Heather Grey",
                "variant": "CASUAL PANTS",
                "category_id": cat_map["Daily Life"],
                "image": "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500&q=80",
                "sizes": [("S", 18), ("M", 25), ("L", 20), ("XL", 15)]
            },
            {
                "sku": "SKU-S001",
                "name": "Nike Air Max 270",
                "description": "The Nike Air Max 270 delivers visible air under every step. Updated for modern comfort, it nods to the original 1991 Air Max 180.",
                "price": 139.99,
                "compare_at_price": 167.99,
                "discount_percentage": 0.0,
                "material": "Engineered Knit & Rubber",
                "color": "Red/Black",
                "variant": "WOMEN SHOES",
                "category_id": cat_map["Western"],
                "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
                "sizes": [("US 6", 10), ("US 7", 15), ("US 8", 12), ("US 9", 8)]
            },
            {
                "sku": "SKU-S002",
                "name": "Nike Joyride Run",
                "description": "Tiny foam beads underfoot conform to your foot for cushioning that stands up to your mileage. Perfect for daily runs.",
                "price": 110.00,
                "compare_at_price": 132.00,
                "discount_percentage": 0.0,
                "material": "Flyknit & Foam Beads",
                "color": "Platinum/Crimson",
                "variant": "RUNNING SHOES",
                "category_id": cat_map["Daily Life"],
                "image": "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500&q=80",
                "sizes": [("US 7", 10), ("US 8", 15), ("US 9", 10), ("US 10", 8)]
            },
            {
                "sku": "SKU-S003",
                "name": "Nike React Infinity",
                "description": "Designed to help reduce injury and keep you on the run. More foam and improved upper details provide a secure and cushioned feel.",
                "price": 160.00,
                "compare_at_price": 192.00,
                "discount_percentage": 0.0,
                "material": "Flyknit & React Foam",
                "color": "Neon Green/Black",
                "variant": "MEN SHOES",
                "category_id": cat_map["Traditional"],
                "image": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80",
                "sizes": [("US 8", 12), ("US 9", 14), ("US 10", 10)]
            }
        ]

        prod_map = {}
        for pdata in products_data:
            sizes = pdata.pop("sizes")
            img_url = pdata.pop("image")
            if "selling_price" not in pdata:
                pdata["selling_price"] = pdata.get("price", 0.0)
            if "buying_price" not in pdata:
                pdata["buying_price"] = round(pdata.get("price", 0.0) * 0.6, 2)
            if "stock_quantity" not in pdata:
                pdata["stock_quantity"] = sum(s[1] for s in sizes) if sizes else 0

            prod = Product(**pdata)
            db.add(prod)
            db.flush()
            prod_map[prod.sku] = prod

            # Add Image
            db.add(ProductImage(
                product_id=prod.id,
                image_url=img_url,
                alt_text=prod.name,
                is_main=True,
                sort_order=1
            ))

            # Add Sizes
            for size_name, stock_qty in sizes:
                db.add(ProductSize(
                    product_id=prod.id,
                    size=size_name,
                    stock=stock_qty
                ))

        print("📋 Seeding Orders from Admin & Checkout mockups...")
        orders_data = [
            {
                "order_number": "#ORD-9021",
                "customer_name": "Sarah Jenkins",
                "email": "sarah.j@example.com",
                "phone": "+8801711111111",
                "street_address": "House 42, Road 11, Banani",
                "city": "Dhaka",
                "postal_code": "1213",
                "payment_method": "Card",
                "payment_status": "Paid",
                "card_last4": "4242",
                "subtotal": 109.00,
                "shipping_fee": 15.00,
                "total_amount": 124.00,
                "status": "Completed",
                "items": [
                    ("Classic Cotton T-Shirt", "M", 24.99, 2, "SKU-C001"),
                    ("Fleece Jogger Pants", "L", 45.50, 1, "SKU-C003")
                ]
            },
            {
                "order_number": "#ORD-9020",
                "customer_name": "Marcus Torres",
                "email": "marcus.t@example.com",
                "phone": "+8801822222222",
                "street_address": "Flat 5B, Gulshan Avenue",
                "city": "Dhaka",
                "postal_code": "1212",
                "payment_method": "Bkash",
                "payment_status": "Paid",
                "bkash_number": "01822222222",
                "transaction_id": "TRX9020BKASH",
                "subtotal": 74.50,
                "shipping_fee": 15.00,
                "total_amount": 89.50,
                "status": "Pending",
                "items": [
                    ("Denim Trucker Jacket", "M", 89.00, 1, "SKU-C002")
                ]
            },
            {
                "order_number": "#ORD-9019",
                "customer_name": "Emily Chen",
                "email": "emily.c@example.com",
                "phone": "+8801933333333",
                "street_address": "Plot 18, Sector 4, Uttara",
                "city": "Dhaka",
                "postal_code": "1230",
                "payment_method": "Card",
                "payment_status": "Failed",
                "card_last4": "1234",
                "subtotal": 334.99,
                "shipping_fee": 15.00,
                "total_amount": 349.99,
                "status": "Cancelled",
                "items": [
                    ("Nike Air Max 270", "US 8", 139.99, 2, "SKU-S001"),
                    ("Fleece Jogger Pants", "M", 45.50, 1, "SKU-C003")
                ]
            },
            {
                "order_number": "#ORD-9018",
                "customer_name": "David Smith",
                "email": "d.smith@example.com",
                "phone": "+8801644444444",
                "street_address": "House 10, Dhanmondi 27",
                "city": "Dhaka",
                "postal_code": "1209",
                "payment_method": "COD",
                "payment_status": "Pending",
                "subtotal": 30.00,
                "shipping_fee": 15.00,
                "total_amount": 45.00,
                "status": "Completed",
                "items": [
                    ("Classic Cotton T-Shirt", "L", 24.99, 1, "SKU-C001")
                ]
            },
            {
                "order_number": "#ORD-9017",
                "customer_name": "Jessica Alba",
                "email": "jalba@example.com",
                "phone": "+8801555555555",
                "street_address": "Mirpur DOHS, Avenue 3",
                "city": "Dhaka",
                "postal_code": "1216",
                "payment_method": "Card",
                "payment_status": "Paid",
                "card_last4": "8888",
                "subtotal": 195.00,
                "shipping_fee": 15.00,
                "total_amount": 210.00,
                "status": "Pending",
                "items": [
                    ("Nike React Infinity", "US 9", 160.00, 1, "SKU-S003")
                ]
            },
            {
                "order_number": "#ORD-9016",
                "customer_name": "Michael Chang",
                "email": "m.chang@example.com",
                "phone": "+8801766666666",
                "street_address": "Mohakhali Wireless Gate",
                "city": "Dhaka",
                "postal_code": "1212",
                "payment_method": "Bkash",
                "payment_status": "Paid",
                "bkash_number": "01766666666",
                "transaction_id": "TRX9016BKASH",
                "subtotal": 14.99,
                "shipping_fee": 15.00,
                "total_amount": 29.99,
                "status": "Completed",
                "items": [
                    ("Classic Cotton T-Shirt", "S", 24.99, 1, "SKU-C001")
                ]
            }
        ]

        for odata in orders_data:
            items = odata.pop("items")
            order = Order(**odata)
            db.add(order)
            db.flush()

            for item_name, variant, price, qty, sku in items:
                prod_obj = prod_map.get(sku)
                db.add(OrderItem(
                    order_id=order.id,
                    product_id=prod_obj.id if prod_obj else None,
                    product_name=item_name,
                    variant=variant,
                    unit_price=price,
                    quantity=qty,
                    total_price=price * qty,
                    image_url=prod_obj.main_image if prod_obj else None
                ))

        print("📜 Seeding Inventory Movement History...")
        history_data = [
            {"date_display": "Oct 26, 2023", "type": "Output", "product_name": "Classic Cotton T-Shirt", "qty": -2, "ref_id": "Sold ID: #ORD-9021", "status": "Shipped"},
            {"date_display": "Oct 25, 2023", "type": "Output", "product_name": "Denim Trucker Jacket", "qty": -1, "ref_id": "Sold ID: #ORD-9020", "status": "Pending"},
            {"date_display": "Oct 24, 2023", "type": "Input", "product_name": "Fleece Jogger Pants", "qty": 50, "ref_id": "PO-RESTOCK-089", "status": "Received"},
            {"date_display": "Oct 22, 2023", "type": "Output", "product_name": "Classic Cotton T-Shirt", "qty": -1, "ref_id": "Sold ID: #ORD-9018", "status": "Shipped"},
        ]
        for h in history_data:
            db.add(InventoryLog(**h))

        print("🖼️ Seeding Landing Media Slots (5 Slots)...")
        media_slots_data = [
            {"slot_number": 1, "slot_type": "main", "title": "Trendy Specials", "subtitle": "JUST FOR YOU!!", "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80", "link_url": "/shop", "is_active": True},
            {"slot_number": 2, "slot_type": "gallery", "title": "Denim Series", "subtitle": "Rugged Style", "image_url": "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&q=80", "link_url": "/shop", "is_active": True},
            {"slot_number": 3, "slot_type": "gallery", "title": "Comfort Fleece", "subtitle": "Daily Life", "image_url": "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&q=80", "link_url": "/shop", "is_active": True},
            {"slot_number": 4, "slot_type": "gallery", "title": "Street Sneakers", "subtitle": "Modern Comfort", "image_url": "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400&q=80", "link_url": "/shop", "is_active": True},
            {"slot_number": 5, "slot_type": "gallery", "title": "Pure Cotton", "subtitle": "Casual Fit", "image_url": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&q=80", "link_url": "/shop", "is_active": True},
        ]
        for slot in media_slots_data:
            db.add(LandingMediaSlot(**slot))

        print("⚙️ Seeding Store Settings...")
        default_settings = StoreSetting(
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
        db.add(default_settings)

        db.commit()
        print("✅ Database seeding completed successfully!")

    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
