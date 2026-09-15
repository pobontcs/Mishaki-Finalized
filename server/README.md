# Mishaki FastAPI Backend & PostgreSQL Database Architecture

This directory contains the production-ready FastAPI backend and PostgreSQL database architecture for the Mishaki E-Commerce platform, fully modeled after the data requirements of the Next.js frontend in [`mishaki/`](../mishaki).

---

## 🏗️ Architecture & Database Structure

```
server/
├── app/
│   ├── core/
│   │   └── config.py         # App settings, DB URL, and Next.js CORS origins
│   ├── db/
│   │   ├── base.py           # DeclarativeBase base class
│   │   └── session.py        # SQLAlchemy engine, SessionLocal, get_db dependency
│   ├── models/               # SQLAlchemy Models
│   │   ├── user.py           # User (Customer & Admin auth)
│   │   ├── category.py       # Category (Traditional, Western, Daily Life, etc.)
│   │   ├── product.py        # Product, ProductSize, ProductImage
│   │   ├── order.py          # Order, OrderItem (Card, bKash, COD checkout)
│   │   ├── inventory.py      # InventoryLog (Input / Output restock & sales history)
│   │   ├── media.py          # LandingMediaSlot (5 landing banner & gallery slots)
│   │   └── cart.py           # CartItem (persistent cart)
│   ├── schemas/              # Pydantic Schemas for request/response validation
│   │   ├── user.py
│   │   ├── category.py
│   │   ├── product.py
│   │   ├── order.py
│   │   ├── inventory.py
│   │   ├── media.py
│   │   ├── cart.py
│   │   └── analytics.py
│   └── api/
│       └── v1/
│           ├── api.py        # Root v1 router
│           └── endpoints/    # REST endpoints
│               ├── products.py
│               ├── orders.py
│               ├── categories.py
│               ├── inventory.py
│               ├── media.py
│               ├── analytics.py
│               └── users.py
├── main.py                   # FastAPI entrypoint with CORS & lifecycle
├── seed.py                   # Populates DB with initial frontend mock catalog
├── create_pg_db.py           # Creates PostgreSQL database if missing and runs seed
├── requirements.txt          # Python dependencies
├── .env                      # Active environment configuration
└── .env.example              # Sample environment template
```

---

## 🗄️ Database Models Aligned with Next.js Frontend

| Model | Table | Frontend Page / Component | Key Fields |
| :--- | :--- | :--- | :--- |
| **`User`** | `users` | `app/signup`, `app/login`, `app/admin` | `id`, `name`, `email`, `phone`, `hashed_password`, `address`, `role` (`customer`, `admin`), `is_active` |
| **`Category`** | `categories` | `app/shop` category tabs | `id`, `name`, `slug`, `description`, `image_url` |
| **`Product`** | `products` | `app/shop`, `app/contents/card.tsx`, `app/admin/product.tsx` | `id`, `sku`, `name`, `description`, `price`, `compare_at_price`, `discount_percentage`, `material`, `color`, `variant`, `category_id`, `is_active` |
| **`ProductSize`** | `product_sizes` | `app/admin/product.tsx` & `ProductModal.tsx` | `id`, `product_id`, `size` (`XS`, `S`, `M`, `L`, `XL`, `XXL`, `US 7`), `stock` |
| **`ProductImage`** | `product_images` | `app/contents/card.tsx`, `ProductModal.tsx` | `id`, `product_id`, `image_url`, `alt_text`, `is_main`, `sort_order` |
| **`Order`** | `orders` | `app/Cart/page.tsx`, `app/admin/orders.tsx`, `app/admin/page.tsx` | `id`, `order_number` (`#ORD-9021`), `customer_name`, `email`, `phone`, `street_address`, `city`, `postal_code`, `payment_method` (`Card`, `Bkash`, `COD`), `payment_status`, `bkash_number`, `transaction_id`, `card_last4`, `subtotal`, `shipping_fee` ($15.00), `discount_amount`, `total_amount`, `status` (`Pending`, `Completed`, `Cancelled`, `Shipped`) |
| **`OrderItem`** | `order_items` | `app/Cart/page.tsx` checkout & order history | `id`, `order_id`, `product_id`, `product_name`, `variant`, `unit_price`, `quantity`, `total_price`, `image_url` |
| **`InventoryLog`** | `inventory_logs` | `app/admin/product.tsx` Tab 2 (Input/Output History) | `id`, `date_display`, `type` (`Input`, `Output`), `product_id`, `product_name`, `size`, `qty` (+50, -2), `ref_id`, `status`, `notes` |
| **`LandingMediaSlot`** | `landing_media_slots` | `app/admin/product.tsx` Section B & `app/client/Landing.tsx` | `id`, `slot_number` (1-5), `slot_type` (`main`, `gallery`), `title`, `subtitle`, `image_url`, `link_url`, `is_active` |
| **`CartItem`** | `cart_items` | `app/Cart/page.tsx` persistent cart | `id`, `user_id`, `product_id`, `size`, `quantity` |

---

## ⚙️ Quickstart & PostgreSQL Setup

### 1. Set your PostgreSQL credentials in `server/.env`
Open [`server/.env`](file:///Users/abdullahalhossain/Desktop/untitled%20folder/Mishaki-GIT/Mishaki-Finalized/server/.env) and set your PostgreSQL username and password:
```env
DATABASE_URL="postgresql+psycopg2://<username>:<password>@localhost:5432/mishaki_db"
```

*(If you want to test without PostgreSQL, you can use SQLite at any time: `DATABASE_URL="sqlite:///./mishaki.db"`)*

### 2. Initialize and Seed the Database
Run the database creation & seeder script:
```bash
python3 create_pg_db.py
```
Or directly:
```bash
python3 seed.py
```

This populates the database with:
- Categories (`Traditional`, `Western`, `Daily Life`, `Accessories`)
- Products with starting size inventory & images
- Initial customer & admin users
- Mock orders matching `admin/orders.tsx`
- Inventory movement logs matching `admin/product.tsx`
- 5 Landing page media slots

### 3. Start the FastAPI Development Server
```bash
uvicorn main:app --reload --port 8000
```

- **Interactive API Docs (Swagger UI)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

## 🌐 Next.js Frontend Integration Endpoints

All endpoints are prefixed with `/api/v1`:

- **Products**:
  - `GET /api/v1/products?category=Western&search=hoodie`
  - `GET /api/v1/products/{id}`
  - `POST /api/v1/products`
  - `PATCH /api/v1/products/{id}/discount`
- **Orders & Checkout**:
  - `POST /api/v1/orders` *(Receives Cart shipping details, payment method [Card, Bkash, COD], and items)*
  - `GET /api/v1/orders?status=Pending&search=Sarah`
  - `PATCH /api/v1/orders/{id}/status`
- **Categories**:
  - `GET /api/v1/categories`
- **Inventory Logs**:
  - `GET /api/v1/inventory/history?type=Input`
- **Landing Media**:
  - `GET /api/v1/media/slots`
  - `PUT /api/v1/media/slots/{slot_number}`
- **Admin Dashboard & Analytics**:
  - `GET /api/v1/analytics/overview` *(Current Stock, Pending Orders, Pending Shipments, Total Revenue)*
  - `GET /api/v1/analytics/financial` *(KPIs, Revenue/Expense chart, Category breakdown)*
- **Users**:
  - `POST /api/v1/users/signup`
  - `POST /api/v1/users/login`
