from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import uvicorn
import uuid

#next steps:
#postgre
#make a frontend


# FastAPI app setup
app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
DATABASE_URL = "sqlite:///./Car-Swiper.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, index=True)
    password = Column(String)

class Car(Base):
    __tablename__ = "cars"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    image_url = Column(String)
    description = Column(String)  # New field for car details

class Like(Base):
    __tablename__ = "likes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    car_id = Column(Integer, ForeignKey("cars.id"))

class Dislike(Base):
    __tablename__ = "dislikes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    car_id = Column(Integer, ForeignKey("cars.id"))

Base.metadata.create_all(bind=engine)

# Predefined set of cars
PREDEFINED_CARS = [
    {"name": "Ferrari 488", "image_url": "https://example.com/ferrari.jpg", "description": "A high-performance sports car from Ferrari."},
    {"name": "Lamborghini Huracan", "image_url": "https://example.com/lamborghini.jpg", "description": "A stylish and powerful supercar from Lamborghini."},
    {"name": "Porsche 911", "image_url": "https://example.com/porsche.jpg", "description": "An iconic sports car with a rich racing heritage."},
]

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Insert predefined cars into database if they don't exist
def initialize_cars():
    db = SessionLocal()
    for car in PREDEFINED_CARS:
        existing_car = db.query(Car).filter(Car.name == car["name"]).first()
        if not existing_car:
            new_car = Car(name=car["name"], image_url=car["image_url"], description=car["description"])
            db.add(new_car)
    db.commit()
    db.close()

initialize_cars()  # Ensure cars are in the database on startup

# Schemas
class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

# Routes
@app.post("/create_user")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")
    new_user = User(username=user.username, password=user.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"user_id": new_user.id}

@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user.username, User.password == user.password).first()
    if not existing_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"user_id": existing_user.id, "message": "Login successful"}

@app.get("/cars")
def get_cars(db: Session = Depends(get_db)):
    cars = db.query(Car).all()
    return [{"id": car.id, "name": car.name, "image_url": car.image_url} for car in cars]

@app.get("/car/{car_id}")
def get_car_details(car_id: int, db: Session = Depends(get_db)):
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return {"id": car.id, "name": car.name, "image_url": car.image_url, "description": car.description}

@app.post("/like/{car_id}")
def like_car(car_id: int, user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db_like = Like(user_id=user_id, car_id=car_id)
    db.add(db_like)
    db.commit()
    return {"message": "Car liked"}

@app.post("/dislike/{car_id}")
def dislike_car(car_id: int, user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db_dislike = Dislike(user_id=user_id, car_id=car_id)
    db.add(db_dislike)
    db.commit()
    return {"message": "Car disliked"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)


# uvicorn main:app --reload
