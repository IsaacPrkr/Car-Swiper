from typing import Annotated

from fastapi import Depends, FastAPI
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from carswiper import models
from carswiper.database import SessionLocal, engine

app = FastAPI()
models.Base.metadata.create_all(bind=engine)


# Defining Models for APIs
class UserCreate(BaseModel):
    username: str
    email: str
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

#Uv run python src/carswiper/main.py