from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime, Boolean, ARRAY
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    rooms = relationship("Room", back_populates="owner")

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    date = Column(DateTime, nullable=False)
    location = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="rooms")
    images = relationship("Image", back_populates="room")

class Image(Base):
    __tablename__ = "images"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    cloudinary_url = Column(String, nullable=False)
    cloudinary_public_id = Column(String, nullable=False)
    status = Column(String, default="pending")
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    username = Column(String, nullable=False)
    room = relationship("Room", back_populates="images")
    persons = relationship("DetectedPerson", back_populates="image", cascade="all, delete-orphan")

class DetectedPerson(Base):
    __tablename__ = "detected_persons"
    id = Column(Integer, primary_key=True, index=True)
    image_id = Column(Integer, ForeignKey("images.id"), nullable=False)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)  # ← เพิ่ม
    cluster_id = Column(Integer, nullable=True)                         # ← เพิ่ม
    embedding = Column(ARRAY(Float), nullable=False)                    # ← เพิ่ม
    confidence = Column(Float, nullable=False)
    bbox_x = Column(Float)
    bbox_y = Column(Float)
    bbox_w = Column(Float)
    bbox_h = Column(Float)
    face_crop_url = Column(String, nullable=True)
    image = relationship("Image", back_populates="persons")