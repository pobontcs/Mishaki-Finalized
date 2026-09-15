from typing import List, Optional
from pydantic import BaseModel

class DashboardOverviewResponse(BaseModel):
    current_stock: int
    pending_orders: int
    pending_shipments: int
    completed_orders: int
    total_revenue: float

class KPICard(BaseModel):
    title: str
    amount: str
    change: str
    isPositive: bool

class RevenuePoint(BaseModel):
    name: str  # Month e.g. "Jan", "Feb"
    revenue: float
    expenses: float

class CategorySalesPoint(BaseModel):
    name: str
    sales: float

class ExpenseBreakdown(BaseModel):
    date: str
    product_name: str
    stock_type: str
    quantity: int
    unit_cost: float
    total_cost: float

class FinancialAnalysisResponse(BaseModel):
    kpis: List[KPICard]
    revenue_chart: List[RevenuePoint]
    category_sales: List[CategorySalesPoint]
    expense_breakdown: List[ExpenseBreakdown] = []
