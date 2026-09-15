import os
import shutil
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from pydantic import BaseModel

router = APIRouter()

# Directory to save uploaded images
UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../uploads"))

# Ensure the upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

class UploadResponse(BaseModel):
    image_url: str
    message: str

@router.post("/image", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    # Generate a unique filename to prevent overwriting
    ext = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    file_location = os.path.join(UPLOAD_DIR, unique_filename)

    try:
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")

    # Return the URL path that will be served by StaticFiles
    # Assuming the static mount path is '/uploads'
    return UploadResponse(
        image_url=f"/uploads/{unique_filename}",
        message="Successfully uploaded"
    )
