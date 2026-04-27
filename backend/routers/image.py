from fastapi import APIRouter, Depends, File, UploadFile, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from schemas.image import ImageResponse
from database import get_db
from services.cloudinary_service import upload_image,delete_image
from models import Image, DetectedPerson
from services.cluster_service import cluster_embeddings
import asyncio
from workers.face_work import process_faces


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
        asyncio.create_task(
            process_faces(image.id, image.cloudinary_url, room_id)
        )

    return image_records

@router.post("/room/{room_id}/cluster")
async def cluster_room_faces(
    room_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(DetectedPerson).where(DetectedPerson.room_id == room_id)
    )
    persons = result.scalars().all()

    if not persons:
        return {"message": "no faces found"}

    faces = [{"embedding": p.embedding} for p in persons]
    labels = cluster_embeddings(faces)

    for i, person in enumerate(persons):
        person.cluster_id = int(labels[i])

    # update status ใน images ทั้งหมดของ room นี้
    images_result = await db.execute(
        select(Image).where(Image.room_id == room_id)
    )
    images = images_result.scalars().all()
    for image in images:
        image.status = "done"

    await db.commit()

    unique_clusters = set(l for l in labels if l != -1)
    return {
        "total_faces": len(persons),
        "total_clusters": len(unique_clusters),
        "outliers": list(labels).count(-1),
    }
     
@router.get("/room/{room_id}/groups")
async def get_face_groups(
    room_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(DetectedPerson, Image)
        .join(Image, DetectedPerson.image_id == Image.id)
        .where(DetectedPerson.room_id == room_id)
        .where(DetectedPerson.cluster_id != None)
    )
    rows = result.all()

    # group by cluster_id
    groups = {}
    for person, image in rows:
        cid = person.cluster_id
        if cid not in groups:
            groups[cid] = []
        if image.cloudinary_url not in groups[cid]:
            groups[cid].append(image.cloudinary_url)

    return {
        "clusters": [
            {"cluster_id": cid, "urls": urls}
            for cid, urls in groups.items()
        ]
    }

@router.get("/room/{room_id}",response_model=list[ImageResponse])
async def get_face(
    room_id:int,
    db:AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Image).where(Image.room_id == room_id)
    )
    images = result.scalars().all()
    return images

@router.delete("/{image_id}")
async def delete_face(
    image_id:int,
    db:AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Image).where(Image.id == image_id)
    )
    image = result.scalar_one_or_none()
    
    if not image:
        return {"message":"imaeg not found"}
    
    delete_image(image.cloudinary_public_id)
    
    await db.delete(image)
    await db.commit()
    
    return {"message":f"deleted {image_id}"}