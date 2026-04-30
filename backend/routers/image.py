from fastapi import APIRouter, Depends, File, UploadFile, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from schemas.image import ImageResponse,UploadResponse
from database import get_db
from services.cloudinary_service import upload_image,delete_image
from models import Image, DetectedPerson
from services.cluster_service import cluster_embeddings
import asyncio
from workers.face_work import process_faces
import requests
import cloudinary.uploader
from PIL import Image as PILImage
from io import BytesIO
from sqlalchemy.orm import selectinload


router = APIRouter(prefix="/image", tags=["image"])

@router.post("/upload", response_model=UploadResponse)
async def create_image(
    files: list[UploadFile] = File(...),
    room_id: int = Form(...),
    username: str = Form(...),
    db: AsyncSession = Depends(get_db),
):
    files_bytes = [await f.read() for f in files]

    uploaded_public_ids = []
    
    try:
        upload_result = await upload_image(files_bytes)
        
        failed = [r for r in upload_result if not r["success"]]
        success = [r for r in upload_result if r["success"]]
        uploaded_public_ids = [r["public_id"] for r in upload_result if r["success"]]
        
        image_recodes = []
        for i,result in enumerate(upload_result):
            if not result["success"]:
                continue
            image_data = Image(
                filename=files[i].filename,
                cloudinary_public_id=result["public_id"],
                cloudinary_url=result["url"],
                room_id=room_id,
                username=username,
                status="pending",
            )
            db.add(image_data)
            image_recodes.append(image_data)
        await db.commit()
        
        for image in image_recodes:
            await db.refresh(image)
            asyncio.create_task(
                process_faces(image.id,image.cloudinary_url,room_id)
            )
        
        return {
            "uploaded":image_recodes,
            "failed":[r["error"] for r in failed]
        }
    except Exception as e:
        for public_id in uploaded_public_ids:
            delete_image(public_id)
        raise e
        
@router.post("/room/{room_id}/cluster")
async def cluster_room_faces(
    room_id: int,
    db: AsyncSession = Depends(get_db),
):
    # 1. query พร้อม selectinload
    result = await db.execute(
        select(DetectedPerson)
        .where(DetectedPerson.room_id == room_id)
        .options(selectinload(DetectedPerson.image))
    )
    persons = result.scalars().all()
    if not persons:
        return {"message": "no faces found"}

    # 2. cluster
    faces = [{"embedding": p.embedding} for p in persons]
    labels = cluster_embeddings(faces)
    for i, person in enumerate(persons):
        person.cluster_id = int(labels[i])

    # 3. loop cluster → crop → upload
    unique_clusters = set(l for l in labels if l != -1)
    for cluster_id in unique_clusters:
        cluster_persons = [p for p, label in zip(persons, labels) if label == cluster_id]
        best = max(cluster_persons, key=lambda p: p.confidence)

        # ดึงรูปจาก Cloudinary
        img_url = best.image.cloudinary_url
        response = requests.get(img_url)
        img = PILImage.open(BytesIO(response.content))

        # crop ด้วย bbox
        x, y, w, h = best.bbox_x, best.bbox_y, best.bbox_w, best.bbox_h
        cropped = img.crop((x, y, x + w, y + h))

        # upload crop ไป Cloudinary
        buffer = BytesIO()
        cropped.save(buffer, format="JPEG")
        buffer.seek(0)
        upload_result = cloudinary.uploader.upload(buffer, folder="picroom/face_crops")
        best.face_crop_url = upload_result["secure_url"]

    # 4. update image status
    images_result = await db.execute(
        select(Image).where(Image.room_id == room_id)
    )
    images = images_result.scalars().all()
    for image in images:
        image.status = "done"

    # 5. commit ครั้งเดียว
    await db.commit()

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
            groups[cid] = {
                "face_crop_url": None,
                "image_urls": []
            }  
       # เอา face_crop_url จาก best person (ที่มี face_crop_url)
        if person.face_crop_url and not groups[cid]["face_crop_url"]:
            groups[cid]["face_crop_url"] = person.face_crop_url

        # รูปเต็ม — ไม่ซ้ำ
        if image.cloudinary_url not in groups[cid]["image_urls"]:
            groups[cid]["image_urls"].append(image.cloudinary_url)

    return {
        "clusters": [
            {
                "cluster_id": cid,
                "face_crop_url": data["face_crop_url"],
                "image_urls": data["image_urls"]
            }
            for cid, data in groups.items()
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