from typing import Annotated


from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from carswiper import models
from carswiper.database import SessionLocal, engine

from passlib.context import CryptContext

app = FastAPI()
models.Base.metadata.create_all(bind=engine)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# next steps #
# implement main dashboard


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

class CarOut(BaseModel):
    id: int
    make: str
    model: str
    year: int
    image_url: str
    description: str

    class config:
        orm_mode = True

class SwipeIn(BaseModel):
    car_id: int
    liked: bool

class carCreate(BaseModel):
    make: str
    model: str
    year: int
    image_url: str
    description: str


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

# Route to get a list of swipeable cars for a user
@app.get("/cars/swipeable", response_model=list[CarOut])
def get_swipeable_cars(db: Session = Depends(get_db), username: str = ""):

    # for now username is passed as a query parameter for demo;
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found...")
    
    #cars not owned by user and not already swiped on
    swiped_car_ids = db.query(models.Swipe.car_id).filter(models.Swipe.user_id == user.id)
    cars = db.query(models.Car).filter(
        models.Car.owner_id != user.id,
        ~models.Car.id.in_(swiped_car_ids)
    ).all()
    return cars

# Route to record a swipe (like or dislike) on a car
@app.post("/cars/swipe")
def swipe_car(swipe: SwipeIn, db: Session = Depends(get_db), username: str = ""):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # Record the swipe
    db_swipe = models.Swipe(user_id=user.id, car_id=swipe.car_id, liked=swipe.liked)
    db.add(db_swipe)
    db.commit()
    return {"message": "Swipe recorded"}

#endpoint for adding a car (testing)
@app.post("/cars/add")
def add_car(car: carCreate, db: Session = Depends(get_db), username: str = ""):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db_car = models.Car(
        owner_id=user.id,
        make=car.make,
        model=car.model,
        year=car.year,
        image_url=car.image_url,
        description=car.description,
    )
    db.add(db_car)
    db.commit()
    db.refresh(db_car)
    return db_car

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