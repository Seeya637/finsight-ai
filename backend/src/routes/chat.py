from fastapi import APIRouter, Depends
from pydantic import BaseModel
from src.services.rag_service import get_rag_response
from src.middleware.auth_middleware import verify_token
from src.config.database import chats_collection
from datetime import datetime

router = APIRouter()

class ChatRequest(BaseModel):
    question: str

@router.post("/")
async def chat(
    request: ChatRequest,
    user = Depends(verify_token)
):
    result = get_rag_response(
        request.question,
        user["id"]
    )

    await chats_collection.insert_one({
        "user_id": user["id"],
        "question": request.question,
        "answer": result["answer"],
        "timestamp": datetime.utcnow()
    })

    return {
        "question": request.question,
        "answer": result["answer"],
        "disclaimer": result["disclaimer"]
    }

@router.get("/history")
async def chat_history(user = Depends(verify_token)):
    cursor = chats_collection.find(
        {"user_id": user["id"]}
    ).sort("timestamp", -1).limit(20)

    history = []
    async for chat in cursor:
        history.append({
            "question": chat["question"],
            "answer": chat["answer"],
            "timestamp": str(chat["timestamp"])
        })

    return {"history": history}