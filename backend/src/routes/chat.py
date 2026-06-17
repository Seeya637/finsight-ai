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
    # Last 3 chats fetch karo for memory
    cursor = chats_collection.find(
        {"user_id": user["id"]}
    ).sort("timestamp", -1).limit(3)
    
    history = []
    async for doc in cursor:
        history.append({
            "question": doc["question"],
            "answer": doc["answer"]
        })
    history.reverse()

    # RAG call with history
    result = get_rag_response(
        request.question,
        user["id"],
        history
    )

    # Save to MongoDB
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
            "id": str(chat["_id"]),
            "question": chat["question"],
            "answer": chat["answer"],
            "timestamp": str(chat["timestamp"])
        })

    return {"history": history}

@router.delete("/history")
async def clear_history(user = Depends(verify_token)):
    await chats_collection.delete_many({"user_id": user["id"]})
    return {"message": "Chat history cleared"}
