import os
from dotenv import load_dotenv
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
from langchain_chroma import Chroma
import chromadb

load_dotenv()

os.environ["TOKENIZERS_PARALLELISM"] = "false"

embeddings = HuggingFaceInferenceAPIEmbeddings(
    api_key=os.getenv("HF_TOKEN"),
    model_name="sentence-transformers/all-MiniLM-L6-v2"
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

def search_chunks(query: str, user_id: str, top_k: int = 4) -> str:
    collection_name = f"user_{user_id}"

    try:
        vectorstore = Chroma(
            client=chroma_client,
            collection_name=collection_name,
            embedding_function=embeddings
        )

        # Multiple sub-queries banao comparison ke liye
        queries = [query]
        if any(word in query.lower() for word in ['compare', 'vs', 'difference', 'both']):
            # Query split karo
            words = query.lower().split()
            queries = [query, query.replace('compare', '').replace('and', '').strip()]

        all_results = []
        seen_content = set()

        for q in queries:
            results = vectorstore.similarity_search_with_score(q, k=top_k)
            for doc, score in results:
                if score < 1.8 and doc.page_content not in seen_content:
                    all_results.append((doc, score))
                    seen_content.add(doc.page_content)

        # Score se sort karo
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
        # Filename se chunks dhundo aur delete karo
        results = vectorstore.get(
            where={"source_file": filename}
        )
        if results and results['ids']:
            vectorstore.delete(ids=results['ids'])
            return len(results['ids'])
        return 0
    except Exception as e:
        return 0