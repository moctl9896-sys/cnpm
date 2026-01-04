from typing import Union
from infrastructure.databases.postgres import test_connection
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
<<<<<<< HEAD
=======
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from auth.jwt import create_access_token
>>>>>>> 81d785d5042dbe14c228f13d3ba5ed95d6eeb60a

app = FastAPI()

@app.on_event("startup")
async def on_startup():
    await test_connection()

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

#be connect fe
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {"status": "OK", "service": "backend"}
<<<<<<< HEAD
=======


#API lOGIN

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DEMO USER
fake_user = {
    "email": "test@test.com",
    "password": "123456",
    "id": 1,
}

@app.post("/api/login")
def login(data: dict):
    if data["email"] != fake_user["email"] or data["password"] != fake_user["password"]:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": fake_user["email"]})
    return {
        "access_token": token,
        "token_type": "bearer"
    }
>>>>>>> 81d785d5042dbe14c228f13d3ba5ed95d6eeb60a
