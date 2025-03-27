from typing import Annotated

from fastapi import Depends, FastAPI
from pydantic import BaseModel
from sqlalchemy.orm import Session

from carswiper import models
from carswiper.database import SessionLocal, engine

app = FastAPI()
models.Base.metadata.create_all(bind=engine)


# Defining Models for APIs
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

@app.post("/questions/")
async def create_user(user: UserCreate, db: db_dependency):
    db_username = models.User(models.username)
    db_password = models.User(models.password)
    db.add(db_username)
    db.add(db_password)
    db.commit()
    db.refresh(db_username, db_password)