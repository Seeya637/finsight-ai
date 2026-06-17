from groq import Groq
from src.config.database import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)

SYSTEM_PROMPT = """You are FinSight AI, a precise financial document analyst.

STRICT RULES:
1. Answer ONLY from the provided document chunks
2. ALWAYS cite: "📄 [filename], Page [X]"
3. Quote EXACT numbers from documents
4. For COMPARISON questions:
   - Show data from each document separately
   - Then compare side by side
   - Format as a clear table if possible

5. Structure every answer:

📄 Source: [filename], Page [X]

**Answer:**
[Direct answer in 2-3 sentences]

**Key Figures:**
- [Metric]: [Value] — [Source file]
- [Metric]: [Value] — [Source file]

⚠️ Not financial advice. Verify with source.

6. If info not found, say:
   "This specific information was not found. 
    Try asking more specifically, e.g., 
    'What is Infosys net profit FY2024?'"

7. Never hallucinate numbers
8. For comparisons — search both documents
"""

def get_ai_response(question: str, context: str, chat_history: list = []) -> str:
    
    # Build messages with history
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT}
    ]
    
    # Last 3 exchanges add karo for memory
    for exchange in chat_history[-3:]:
        messages.append({"role": "user", "content": exchange["question"]})
        messages.append({"role": "assistant", "content": exchange["answer"]})
    
    # Current question with context
    messages.append({
        "role": "user",
        "content": f"""Document Context:
{context}

Question: {question}"""
    })

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0.1,
        max_tokens=1024
    )
    return response.choices[0].message.content