from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db.session import get_db
from app.models.media import LandingMediaSlot
from app.schemas.media import LandingMediaSlotUpdate, LandingMediaSlotResponse
from app.api.deps import get_current_admin_user

router = APIRouter()

@router.get("/slots", response_model=List[LandingMediaSlotResponse])
def list_media_slots(db: Session = Depends(get_db)):
    slots = db.scalars(select(LandingMediaSlot).order_by(LandingMediaSlot.slot_number)).all()
    return slots

@router.put("/slots/{slot_number}", response_model=LandingMediaSlotResponse)
def update_media_slot(
    slot_number: int, 
    slot_in: LandingMediaSlotUpdate, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    slot = db.scalar(select(LandingMediaSlot).where(LandingMediaSlot.slot_number == slot_number))
    if not slot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Slot #{slot_number} not found")

    for field, val in slot_in.model_dump(exclude_unset=True).items():
        setattr(slot, field, val)

    db.commit()
    db.refresh(slot)
    return slot
