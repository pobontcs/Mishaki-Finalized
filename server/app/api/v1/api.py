from fastapi import APIRouter
from app.api.v1.endpoints import products, orders, categories, inventory, media, analytics, users, settings, uploads

api_router = APIRouter()

api_router.include_router(products.router, prefix="/products", tags=["Products"])
api_router.include_router(orders.router, prefix="/orders", tags=["Orders"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
api_router.include_router(inventory.router, prefix="/inventory", tags=["Inventory"])
api_router.include_router(media.router, prefix="/media", tags=["Landing Media"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
api_router.include_router(users.router, prefix="/users", tags=["Users & Auth"])
api_router.include_router(settings.router, prefix="/settings", tags=["Store Settings"])
api_router.include_router(uploads.router, prefix="/uploads", tags=["Uploads"])

