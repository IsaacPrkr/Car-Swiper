from sqlalchemy import Column, Integer, String, ForeignKey

from carswiper.database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Car(Base):
    __tablename__ = "cars"
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    make = Column(String)
    model = Column(String)
    year = Column(Integer)
    image_url = Column(String)
    description = Column(String)
    