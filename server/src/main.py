from typing import Union
from infrastructure.databases.postgres import test_connection
from fastapi import FastAPI

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