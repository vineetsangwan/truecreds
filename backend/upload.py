# upload.py — Add this as a new route file, or merge into server.py
#
# Handles image uploads for the admin blog editor. Instead of converting
# images to base64 and storing them in MongoDB (which bloats API responses
# and kills page load speed), this uploads the image to Cloudinary and
# returns just a small URL string to store in the database.
#
# Setup:
#   pip install cloudinary --break-system-packages
#   Add to requirements.txt: cloudinary
#
# Requires these environment variables (set in Railway dashboard):
#   CLOUDINARY_CLOUD_NAME
#   CLOUDINARY_API_KEY
#   CLOUDINARY_API_SECRET

import os
import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, UploadFile, File, HTTPException

router = APIRouter()

cloudinary.config(
    cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME"),
    api_key=os.environ.get("CLOUDINARY_API_KEY"),
    api_secret=os.environ.get("CLOUDINARY_API_SECRET"),
    secure=True,
)


@router.post("/api/admin/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """
    Accepts an image file, uploads it to Cloudinary, returns the URL.
    Frontend should call this instead of converting images to base64.
    """
    allowed_types = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Unsupported file type. Use PNG, JPG, WEBP, or GIF.")

    # 10MB limit — adjust if needed
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max 10MB.")

    try:
        result = cloudinary.uploader.upload(
            contents,
            folder="truecreds_blog",  # keeps uploads organized in Cloudinary
            resource_type="image",
            transformation=[
                {"width": 1600, "height": 1600, "crop": "limit"},
                {"quality": "auto", "fetch_format": "auto"},
            ],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

    return {
        "url": result["secure_url"],
        "public_id": result["public_id"],
        "width": result.get("width"),
        "height": result.get("height"),
    }