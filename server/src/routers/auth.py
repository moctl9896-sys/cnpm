from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

#tra role
router = APIRouter(prefix="/api")

users_db = [
    {"email": "admin@test.com", "password": "123", "role": "admin"},
    {"email": "recruiter@test.com", "password": "123", "role": "recruiter"},
    {"email": "user@test.com", "password": "123", "role": "candidate"},
]

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(data: LoginRequest):
    for u in users_db:
        if u["email"] == data.email and u["password"] == data.password:
            return {
                "email": u["email"],
                "role": u["role"]
            }

    raise HTTPException(status_code=401, detail="Invalid credentials")
