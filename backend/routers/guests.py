from fastapi import APIRouter,Depends
from schemas.guests import GuestResponse
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db



router = APIRouter(prefix="/image", tags=["image"])

@router.post("/guests/{room_slug}/auth",response_model=GuestResponse)
async def guest_auth(
    room_slug:str,
    body:guest_auth,
    db: AsyncSession = Depends(get_db),
):
    return