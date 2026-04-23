import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv
import asyncio
from concurrent.futures import ThreadPoolExecutor

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

executor = ThreadPoolExecutor()


async def upload_image(
    files_bytes: list[bytes] | bytes, folder: str = "picroom/photos"
) -> list[dict] | dict:
    loop = asyncio.get_event_loop()

    async def upload_one(file_bytes: bytes) -> dict:
        try:
            result = await loop.run_in_executor(
                executor, lambda: cloudinary.uploader.upload(file_bytes, folder=folder)
            )
            return {
                "url": result["secure_url"],
                "public_id": result["public_id"],
                "success": True,
            }
        except Exception as e:
            return {"url": None, "public_id": None, "success": False, "error": str(e)}

    if isinstance(files_bytes, bytes):
        return await upload_one(files_bytes)

    tasks = [upload_one(f) for f in files_bytes]
    return await asyncio.gather(*tasks)
