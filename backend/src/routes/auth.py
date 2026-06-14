from fastapi import APIRouter, HTTPException,Depends
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from src.models.user import UserSignup, UserLogin
from src.config.database import users_collection, SECRET_KEY

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"])

def create_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(days=7)
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

@router.post("/signup")
async def signup(user: UserSignup):
    existing = await users_collection.find_one(
        {"email": user.email}
    )
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed = pwd_context.hash(user.password)

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed,
        "documents": []
    }
    result = await users_collection.insert_one(new_user)

    token = create_token({
        "id": str(result.inserted_id),
        "email": user.email,
        "name": user.name
    })

    return {
        "message": "Account created!",
        "token": token,
        "name": user.name,
        "email": user.email
    }

@router.post("/login")
async def login(user: UserLogin):
    existing = await users_collection.find_one(
        {"email": user.email}
    )
    if not existing:
        raise HTTPException(
            status_code=400,
            detail="Email not found"
        )

    if not pwd_context.verify(user.password, existing["password"]):
        raise HTTPException(
            status_code=400,
            detail="Wrong password"
        )

    token = create_token({
        "id": str(existing["_id"]),
        "email": existing["email"],
        "name": existing["name"]
    })

    return {
        "message": "Login successful!",
        "token": token,
        "name": existing["name"],
        "email": existing["email"]
    }

@router.get("/me")
async def get_me(user = Depends(__import__('src.middleware.auth_middleware', fromlist=['verify_token']).verify_token)):
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"]
    }