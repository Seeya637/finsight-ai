from fastapi import HTTPException,Depends
from fastapi.security import HTTPBearer,HTTPAuthorizationCredentials
from jose import jwt,JWTError
from src.config.database import SECRET_KEY

security=HTTPBearer()

def verify_token(credentials:HTTPAuthorizationCredentials=Depends(security)):
    try:
        token=credentials.credentials
        payload=jwt.decode(
            token,
            SECRET_KEY,
            algorithms=["HS256"]
         )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or Expired Token"
        )