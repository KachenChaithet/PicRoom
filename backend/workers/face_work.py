import httpx
from database import AsyncSessionLocal
from services.face_service import extract_faces
from models import DetectedPerson
async def process_faces(image_id: int, image_url: str, room_id: int):
    async with AsyncSessionLocal() as db:
        async with httpx.AsyncClient() as client:
            response = await client.get(image_url)
            image_bytes = response.content

        faces = extract_faces(image_bytes)

        if not faces:
            return

        for face in faces:
            bbox = face["bbox"]
            db_face = DetectedPerson(
                image_id=image_id,
                room_id=room_id,
                cluster_id=None,  # ← ยังไม่ cluster
                embedding=face["embedding"],
                confidence=face["det_score"],
                bbox_x=bbox[0],
                bbox_y=bbox[1],
                bbox_w=bbox[2],
                bbox_h=bbox[3],
            )
            db.add(db_face)

        await db.commit()
   