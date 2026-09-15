from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db.session import get_db
from app.models.settings import StoreSetting, LandingSetting
from app.schemas.settings import (
    StoreSettingUpdate, StoreSettingResponse,
    LandingSettingUpdate, LandingSettingResponse
)
from app.api.deps import get_current_admin_user

router = APIRouter()

def get_or_create_settings(db: Session) -> StoreSetting:
    setting = db.scalar(select(StoreSetting).order_by(StoreSetting.id.asc()))
    if not setting:
        setting = StoreSetting()
        db.add(setting)
        db.commit()
        db.refresh(setting)
    return setting

@router.get("", response_model=StoreSettingResponse)
def get_settings(db: Session = Depends(get_db)):
    """Retrieve global store settings (creates default if none exist)."""
    return get_or_create_settings(db)

@router.put("", response_model=StoreSettingResponse)
def update_settings(settings_in: StoreSettingUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_admin_user)):
    """Update global store settings."""
    setting = get_or_create_settings(db)
    
    update_data = settings_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if hasattr(setting, field):
            setattr(setting, field, value)
            
    db.commit()
    db.refresh(setting)
    return setting

def get_or_create_landing_settings(db: Session) -> LandingSetting:
    setting = db.scalar(select(LandingSetting).order_by(LandingSetting.id.asc()))
    if not setting:
        setting = LandingSetting()
        db.add(setting)
        db.commit()
        db.refresh(setting)
    return setting

@router.get("/landing", response_model=LandingSettingResponse)
def get_landing_settings(db: Session = Depends(get_db)):
    """Retrieve landing page settings."""
    return get_or_create_landing_settings(db)

@router.put("/landing", response_model=LandingSettingResponse)
def update_landing_settings(settings_in: LandingSettingUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_admin_user)):
    """Update landing page settings."""
    setting = get_or_create_landing_settings(db)
    
    update_data = settings_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if hasattr(setting, field):
            setattr(setting, field, value)
            
    db.commit()
    db.refresh(setting)
    return setting
