from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Annotated
import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session
from . import models
from .database import engine, SessionLocal
app = FastAPI()
models.Base.metadata.create_all(bind=engine)

#Defining Models for APIs
class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

def main() -> None:
    print("Hello from carswiper1!")


#uv run carswiper1