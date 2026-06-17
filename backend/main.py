from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes.chat import router as chat_router
from src.routes.auth import router as auth_router
from src.routes.upload import router as upload_router

app=FastAPI(
    title="FinSight AI",
    description="GenAI Financial Research Assistant",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router,prefix="/auth", tags=["Auth"])
app.include_router(chat_router,prefix="/chat", tags=["Chat"])
app.include_router(upload_router,prefix="/upload",tags=['Upload'])

@app.get("/")
def home():
    return{
        "app":"FinSight AI",
        "status":"running",
        "version":"1.0.0"
    }
@app.get("/health")
def health():
    return{"status":"OK"}