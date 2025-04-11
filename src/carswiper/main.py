from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from carswiper import models
from carswiper.database import SessionLocal, engine

from passlib.context import CryptContext

app = FastAPI()
models.Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def password_hash(password):
    return pwd_context.hash(password)

def veryify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


# Defining Models for APIs
class UserCreate(BaseModel):
    username: str
    email: EmailStr
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

def authenticate_user(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user or not veryify_password(password, user.hashed_password):
        return False
    return user

db_dependency = Annotated[Session, Depends(get_db)]


#endpoint for registering
@app.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = password_hash(user.password)
    db_user = models.User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"username": db_user.username, "email": db_user.email}

#endpoint for login
@app.post("/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    # Query the database for the user by username
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    # Verify the provided password
    if not veryify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    # Return a success message
    return {"message": "Login successful", "username": db_user.username}

#Uv run python src/carswiper/main.py
#uvicorn main:app



#Test account for logging in :)
#  "username": "IsaacPrkr",
#  "email": "IsaacPrkr333@carswiper.com",
#  "password": "555lolol555"