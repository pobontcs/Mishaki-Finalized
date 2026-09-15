from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import select, desc

from app.db.session import get_db
from app.models.inventory import InventoryLog
from app.schemas.inventory import InventoryLogCreate, InventoryLogResponse
from app.api.deps import get_current_admin_user

router = APIRouter()

@router.get("/history", response_model=List[InventoryLogResponse])
def list_inventory_history(
    type_filter: Optional[str] = Query(None, alias="type", description="Filter by Input or Output"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    query = select(InventoryLog).order_by(desc(InventoryLog.created_at))
    if type_filter:
        query = query.where(InventoryLog.type.ilike(type_filter))
    
    logs = db.scalars(query.offset(skip).limit(limit)).all()
    return logs

@router.post("/log", response_model=InventoryLogResponse, status_code=status.HTTP_201_CREATED)
def create_inventory_log(log_in: InventoryLogCreate, db: Session = Depends(get_db), current_user = Depends(get_current_admin_user)):
    log = InventoryLog(**log_in.model_dump())
    db.add(log)
    db.commit()
    db.refresh(log)
    return log
