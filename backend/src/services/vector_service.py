import os
import requests
from dotenv import load_dotenv
from langchain_chroma import Chroma
from langchain.embeddings.base import Embeddings
import chromadb
from typing import List

load_dotenv()

# Custom embedding class — HF API directly call karo
class HFEmbeddings(Embeddings):
    def __init__(self):
        self.api_key = os.getenv("HF_TOKEN")
        self.api_url = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"
        self.headers = {"Authorization": f"Bearer {self.api_key}"}

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        response = requests.post(
            self.api_url,
            headers=self.headers,
            json={"inputs": texts, "options": {"wait_for_model": True}}
        )
        return response.json()

    def embed_query(self, text: str) -> List[float]:
        response = requests.post(
            self.api_url,
            headers=self.headers,
            json={"inputs": text, "options": {"wait_for_model": True}}
        )
        return response.json()

embeddings = HFEmbeddings()

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

def search_chunks(query: str, user_id: str, top_k: int = 4) -> str:
    collection_name = f"user_{user_id}"

    try:
        vectorstore = Chroma(
            client=chroma_client,
            collection_name=collection_name,
            embedding_function=embeddings
        )

        queries = [query]
        if any(word in query.lower() for word in ['compare', 'vs', 'difference', 'both']):
            queries = [query, query.replace('compare', '').replace('and', '').strip()]

        all_results = []
        seen_content = set()

        for q in queries:
            results = vectorstore.similarity_search_with_score(q, k=top_k)
            for doc, score in results:
                if score < 1.8 and doc.page_content not in seen_content:
                    all_results.append((doc, score))
                    seen_content.add(doc.page_content)

        all_results.sort(key=lambda x: x[1])

        if not all_results:
            return ""

        context = ""
        for i, (doc, score) in enumerate(all_results[:5]):
            page = doc.metadata.get("page", 0)
            source = doc.metadata.get("source_file", "document")
            context += f"\n[CHUNK {i+1} | File: {source} | Page: {int(page)+1}]\n"
            context += doc.page_content.strip()
            context += "\n" + "="*40 + "\n"

        return context

    except Exception as e:
        print(f"Search error: {e}")
        return ""

def delete_document_chunks(user_id: str, filename: str):
    collection_name = f"user_{user_id}"
    try:
        vectorstore = Chroma(
            client=chroma_client,
            collection_name=collection_name,
            embedding_function=embeddings
        )
        results = vectorstore.get(where={"source_file": filename})
        if results and results['ids']:
            vectorstore.delete(ids=results['ids'])
            return len(results['ids'])
        return 0
    except Exception:
        return 0