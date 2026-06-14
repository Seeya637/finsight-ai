from groq import Groq
from src.config.database import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)

SYSTEM_PROMPT = """You are FinSight AI, an expert financial analyst assistant.

Your rules:
1. Answer ONLY from the provided document context
2. ALWAYS start your answer with the source like this:
   📄 Source: [filename], Page [number]
3. Quote EXACT numbers from the document
4. Structure your answer like this:

   📄 Source: filename.pdf, Page X
   
   💡 Answer:
   [Your detailed answer here with exact figures]
   
   📊 Key Numbers:
   [List important numbers mentioned]
   
   ⚠️ Disclaimer: This is not financial advice.

5. If answer not in context say:
   "This information is not found in the uploaded documents"
6. Never speculate or guess numbers
"""

def get_ai_response(question: str, context: str) -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": f"""Context from uploaded documents:

{context}

Question: {question}

Answer with exact page citations and key numbers:"""
            }
        ],
        temperature=0.1,
        max_tokens=1024
    )
    return response.choices[0].message.content