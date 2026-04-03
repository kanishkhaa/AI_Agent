from fastapi import APIRouter, UploadFile, File
import shutil
import os

from rag.ingest import process_document   # 👈 import RAG

router = APIRouter()

UPLOAD_DIR = "storage/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = f"{UPLOAD_DIR}/{file.filename}"

    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 🔥 Connect to RAG
    process_document(file_path)

    return {"message": "Uploaded & indexed"}