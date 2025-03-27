from sqlalchemy import Column, Integer, String

from carswiper.database import Base


class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True, unique=True)
    password = Column(String, index=True)
