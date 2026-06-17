from src.services.vector_service import search_chunks
from src.services.groq_service import get_ai_response

def get_rag_response(question: str, user_id: str, chat_history: list = []) -> dict:

    context = search_chunks(question, user_id)

    if not context:
        return {
            "answer": "No relevant information found in your documents. Please upload the relevant financial document first.",
            "context_used": False,
            "disclaimer": "This is not financial advice."
        }

    answer = get_ai_response(question, context, chat_history)

    return {
        "answer": answer,
        "context_used": True,
        "disclaimer": "This is not financial advice. Consult a SEBI registered advisor."
    }