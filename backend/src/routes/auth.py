import bcrypt  # Native, bug-free hashing under modern Python
from fastapi import APIRouter, HTTPException, Depends
from jose import jwt
from datetime import datetime, timedelta, timezone
from src.models.user import UserSignup, UserLogin
from src.config.database import users_collection, SECRET_KEY
from src.middleware.auth_middleware import verify_token

router = APIRouter()

def create_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.now(timezone.utc) + timedelta(days=7)
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


@router.post("/signup")
@router.post("/signup/")  # Dual-mapping to permanently eliminate trailing slash issues
async def signup(user: UserSignup):
    existing = await users_collection.find_one(
        {"email": user.email}
    )
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Convert the string to bytes, enforce explicit truncation, and hash natively
    password_bytes = str(user.password)[:72].encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password_bytes = bcrypt.hashpw(password_bytes, salt)
    
    # Store as a safe decoded string in MongoDB
    hashed_password_str = hashed_password_bytes.decode('utf-8')

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password_str,
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
@router.post("/login/")  # Dual-mapping for stability
async def login(user: UserLogin):
    existing = await users_collection.find_one(
        {"email": user.email}
    )
    if not existing:
        raise HTTPException(
            status_code=400,
            detail="Email not found"
        )

    # Process input matching the exact same bytes conversion rules
    input_bytes = str(user.password)[:72].encode('utf-8')
    stored_bytes = existing["password"].encode('utf-8')

    # Native secure password verification
    if not bcrypt.checkpw(input_bytes, stored_bytes):
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
async def get_me(user = Depends(verify_token)):
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"]
    }
