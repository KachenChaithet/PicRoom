from fastapi import APIRouter, Depends, File, UploadFile, Form
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.image import ImageCreate, ImageResponse
from database import get_db
from services.cloudinary_service import upload_image
from models import Image


router = APIRouter(prefix="/image", tags=["image"])


@router.post("/upload", response_model=list[ImageResponse])
async def create_image(
    files: list[UploadFile] = File(...),
    room_id: int = Form(...),
    username: str = Form(...),
    db: AsyncSession = Depends(get_db),
):
    files_bytes = [await f.read() for f in files]

    upload_result = await upload_image(files_bytes)

    image_records = []
    for i, result in enumerate(upload_result):
        image_data = Image(
            filename=files[i].filename,
            cloudinary_public_id=result["public_id"],
            cloudinary_url=result["url"],
            room_id=room_id,
            username=username,
            status="pending",
        )
        db.add(image_data)
        image_records.append(image_data)

    await db.commit()
    for image in image_records:
        await db.refresh(image)
    return image_records
