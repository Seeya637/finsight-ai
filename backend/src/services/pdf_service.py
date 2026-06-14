from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
import tempfile
import os

def process_pdf(file_content: bytes, filename: str) -> list:
    tmp_path = None
    try:
        # Windows fix — delete=False aur manually close karo
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf",
            dir=tempfile.gettempdir()
        ) as tmp:
            tmp.write(file_content)
            tmp_path = tmp.name
        # File band ho gayi — ab loader use kar sakta hai
        
        loader = PyPDFLoader(tmp_path)  
        pages = loader.load()

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50,
            separators=["\n\n", "\n", " ", ""]
        )
        chunks = splitter.split_documents(pages)

        for chunk in chunks:
            chunk.metadata["source_file"] = filename

        return chunks

    except Exception as e:
        raise Exception(f"PDF processing failed: {str(e)}")

    finally:
        # File band hone ke baad delete karo
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.unlink(tmp_path)
            except Exception:
                pass  # Windows pe kabhi kabhi lock rehti hai — ignore karo