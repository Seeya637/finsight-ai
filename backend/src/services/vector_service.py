import os
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
import chromadb
from langchain_community.vectorstores import Chroma

load_dotenv()

os.environ["HUGGINGFACEHUB_API_TOKEN"] = os.getenv("HF_TOKEN", "")
os.environ["TOKENIZERS_PARALLELISM"] = "false"

embeddings = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2"
)

chroma_client = chromadb.PersistentClient(path="./chroma_db")

def store_chunks(chunks: list, user_id: str, doc_id: str):
    collection_name = f"user_{user_id}"
    vectorstore = Chroma(
        client=chroma_client,
        collection_name=collection_name,
        embedding_function=embeddings
    )
    vectorstore.add_documents(chunks)
    return len(chunks)

def search_chunks(query: str, user_id: str, top_k: int = 5) -> str:
    collection_name = f"user_{user_id}"

    try:
        vectorstore = Chroma(
            client=chroma_client,
            collection_name=collection_name,
            embedding_function=embeddings
        )
        results = vectorstore.similarity_search(query, k=top_k)

        if not results:
            return ""

        context = ""
        for i, doc in enumerate(results):
            page = doc.metadata.get("page", 0)
            source = doc.metadata.get("source_file", "document")
            context += f"\n[CHUNK {i+1} | File: {source} | Page: {int(page)+1}]\n"
            context += doc.page_content.strip()
            context += "\n" + "="*50 + "\n"

        return context

    except Exception:
        return ""