from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from src.services.pdf_service import process_pdf
from src.services.vector_service import store_chunks, delete_document_chunks
from src.middleware.auth_middleware import verify_token
from src.config.database import documents_collection
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.post("/")
async def upload_pdf(
    file: UploadFile = File(...),
    user = Depends(verify_token)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files allowed"
        )

    content = await file.read()
    chunks = process_pdf(content, file.filename)

    chunk_count = store_chunks(
        chunks,
        user["id"],
        file.filename
    )

    doc_record = {
        "user_id": user["id"],
        "filename": file.filename,
        "chunk_count": chunk_count,
        "uploaded_at": datetime.utcnow()
    }
    result = await documents_collection.insert_one(doc_record)

    return {
        "message": "PDF processed successfully",
        "filename": file.filename,
        "chunks_created": chunk_count,
        "doc_id": str(result.inserted_id)
    }

@router.get("/my-documents")
async def get_my_documents(user = Depends(verify_token)):
    cursor = documents_collection.find({"user_id": user["id"]})
    docs = []
    async for doc in cursor:
        docs.append({
            "id": str(doc["_id"]),
            "filename": doc["filename"],
            "chunks": doc["chunk_count"],
            "uploaded_at": str(doc["uploaded_at"])
        })
    return {"documents": docs}

@router.delete("/{doc_id}")
async def delete_document(
    doc_id: str,
    user = Depends(verify_token)
):
    # MongoDB se document find karo
    doc = await documents_collection.find_one({
        "_id": ObjectId(doc_id),
        "user_id": user["id"]
    })

    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # ChromaDB se chunks delete karo
    deleted_chunks = delete_document_chunks(user["id"], doc["filename"])

    # MongoDB se record delete karo
    await documents_collection.delete_one({"_id": ObjectId(doc_id)})

    return {
        "message": f"Document deleted successfully",
        "filename": doc["filename"],
        "chunks_deleted": deleted_chunks
    }