from typing import List
from datetime import datetime
from collections import defaultdict
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from app.db.session import get_db
from app.models.order import Order, OrderItem
from app.models.product import Product, ProductSize
from app.models.category import Category
from app.schemas.analytics import DashboardOverviewResponse, FinancialAnalysisResponse, KPICard, RevenuePoint, CategorySalesPoint, ExpenseBreakdown
from app.api.deps import get_current_admin_user

router = APIRouter()

@router.get("/overview", response_model=DashboardOverviewResponse)
def get_dashboard_overview(db: Session = Depends(get_db), current_user = Depends(get_current_admin_user)):
    # Calculate current stock across all product sizes
    total_stock_val = db.scalar(select(func.sum(ProductSize.stock))) or 0

    # Count orders by status
    pending_orders_val = db.scalar(
        select(func.count(Order.id)).where(Order.status == "Pending")
    ) or 0

    pending_shipments_val = db.scalar(
        select(func.count(Order.id)).where(Order.status.in_(["Pending", "Processing", "Shipped"]))
    ) or 0

    completed_orders_val = db.scalar(
        select(func.count(Order.id)).where(Order.status == "Completed")
    ) or 0

    total_revenue_val = db.scalar(
        select(func.sum(Order.total_amount)).where(Order.status == "Completed")
    ) or 0.0

    return DashboardOverviewResponse(
        current_stock=int(total_stock_val),
        pending_orders=int(pending_orders_val),
        pending_shipments=int(pending_shipments_val),
        completed_orders=int(completed_orders_val),
        total_revenue=float(total_revenue_val)
    )


from datetime import datetime, timedelta

@router.get("/financials", response_model=FinancialAnalysisResponse)
def get_financial_analysis(timeframe: str = "Yearly", db: Session = Depends(get_db), current_user = Depends(get_current_admin_user)):
    now = datetime.now()
    if timeframe == "Weekly":
        start_date = now - timedelta(days=7)
    elif timeframe == "Monthly":
        start_date = now - timedelta(days=30)
    else: # Yearly
        start_date = now.replace(month=1, day=1, hour=0, minute=0, second=0)

    # 1. KPIs
    completed_revenue = db.scalar(
        select(func.sum(Order.total_amount))
        .where(Order.status == "Completed", Order.created_at >= start_date)
    ) or 0.0

    avg_order_val = db.scalar(
        select(func.avg(Order.total_amount))
        .where(Order.status == "Completed", Order.created_at >= start_date)
    ) or 0.0

    # Calculate actual expenses
    # 1. Expense for Normal Stock = (Current Stock + Sold Stock) * Buying Price
    # 2. Expense for Dynamic Stock = Sold Stock * Buying Price (only when completed)
    
    # Let's get all products and calculate their expenses
    all_products = db.scalars(select(Product)).all()
    total_expenses = 0.0
    expense_breakdown = []
    
    for p in all_products:
        if p.is_dynamic_stock:
            # Only cost of goods sold for completed orders
            order_items = db.execute(
                select(OrderItem.quantity, Order.created_at, Order.order_number)
                .join(Order, OrderItem.order_id == Order.id)
                .where(OrderItem.product_id == p.id, Order.status == "Completed", Order.created_at >= start_date)
            ).all()
            
            for qty, created_at, order_number in order_items:
                p_expense = qty * p.buying_price
                total_expenses += p_expense
                expense_breakdown.append(ExpenseBreakdown(
                    date=created_at.strftime("%b %d, %Y"),
                    product_name=p.name,
                    stock_type=f"Dynamic ({order_number})",
                    quantity=qty,
                    unit_cost=p.buying_price,
                    total_cost=p_expense
                ))
        else:
            # Upfront cost for normal stock (current stock + sold stock)
            order_items = db.execute(
                select(OrderItem.quantity, Order.created_at, Order.order_number)
                .join(Order, OrderItem.order_id == Order.id)
                .where(OrderItem.product_id == p.id, Order.status != "Cancelled", Order.created_at >= start_date) # All sold/committed stock
            ).all()
            
            for qty, created_at, order_number in order_items:
                p_expense = qty * p.buying_price
                total_expenses += p_expense
                expense_breakdown.append(ExpenseBreakdown(
                    date=created_at.strftime("%b %d, %Y"),
                    product_name=p.name,
                    stock_type=f"Normal COGS ({order_number})",
                    quantity=qty,
                    unit_cost=p.buying_price,
                    total_cost=p_expense
                ))

            if timeframe == "Yearly" and p.total_stock > 0:
                p_expense = p.total_stock * p.buying_price
                total_expenses += p_expense
                expense_breakdown.append(ExpenseBreakdown(
                    date=datetime.now().strftime("%b %d, %Y"),
                    product_name=p.name,
                    stock_type="Normal (Unsold)",
                    quantity=p.total_stock,
                    unit_cost=p.buying_price,
                    total_cost=p_expense
                ))
        
    # Sort breakdown by date (latest first)
    expense_breakdown.sort(key=lambda x: datetime.strptime(x.date, "%b %d, %Y") if "Unsold" not in x.stock_type else datetime.now(), reverse=True)

    net_profit = completed_revenue - total_expenses
    margin = (net_profit / completed_revenue * 100) if completed_revenue > 0 else 0.0

    kpis = [
        KPICard(title="Total Revenue", amount=f"৳{completed_revenue:,.2f}", change="+14.5%", isPositive=True),
        KPICard(title="Average Order Value", amount=f"৳{avg_order_val:,.2f}", change="+5.2%", isPositive=True),
        KPICard(title="Total Expenses", amount=f"৳{total_expenses:,.2f}", change="-2.4%", isPositive=False),
        KPICard(title="Net Profit", amount=f"৳{net_profit:,.2f}", change="+1.2%", isPositive=net_profit >= 0),
    ]

    # 2. Revenue Chart
    completed_orders = db.scalars(
        select(Order).where(Order.status == "Completed", Order.created_at >= start_date)
    ).all()
    
    monthly_data = defaultdict(float)
    
    for order in completed_orders:
        if timeframe == "Yearly":
            label = order.created_at.strftime("%b") # "Jan"
        else:
            label = order.created_at.strftime("%b %d") # "Sep 01"
        monthly_data[label] += order.total_amount

    revenue_chart = []
    
    if timeframe == "Yearly":
        labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    elif timeframe == "Weekly":
        labels = [(start_date + timedelta(days=i)).strftime("%b %d") for i in range(8)]
    else: # Monthly
        labels = [(start_date + timedelta(days=i)).strftime("%b %d") for i in range(31)]
        
    for label in labels:
        rev = monthly_data.get(label, 0.0)
        exp = rev * 0.70
        revenue_chart.append(RevenuePoint(name=label, revenue=rev, expenses=exp))

    # 3. Category Sales
    # Join OrderItems -> Product -> Category
    category_sales_query = (
        select(Category.name, func.sum(OrderItem.total_price).label("sales"))
        .join(Product, OrderItem.product_id == Product.id)
        .join(Category, Product.category_id == Category.id)
        .join(Order, OrderItem.order_id == Order.id)
        .where(Order.status == "Completed", Order.created_at >= start_date)
        .group_by(Category.name)
    )
    
    cat_results = db.execute(category_sales_query).all()
    category_sales = [
        CategorySalesPoint(name=row.name, sales=float(row.sales)) for row in cat_results
    ]
    
    # If no sales yet, return an empty array or a fallback so chart doesn't break
    if not category_sales:
        category_sales = [CategorySalesPoint(name="No Sales", sales=1)]

    return FinancialAnalysisResponse(
        kpis=kpis,
        revenue_chart=revenue_chart,
        category_sales=category_sales,
        expense_breakdown=expense_breakdown
    )
