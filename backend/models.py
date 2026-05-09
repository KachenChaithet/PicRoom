from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime, Boolean, ARRAY
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
import uuid
from sqlalchemy.dialects.postgresql import UUID

class Guest(Base):
    __tablename__ = "guests"
    id = Column(String, primary_key=True, default=lambda: uuid.uuid4().hex)
    name = Column(String, nullable=False)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    images = relationship("Image", back_populates="guest")
    room = relationship("Room", back_populates="guests")

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    date = Column(DateTime(timezone=True), nullable=False)
    location = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    owner_id = Column(UUID(as_uuid=True), nullable=False)
    slug = Column(String, unique=True, nullable=False, default=lambda: uuid.uuid4().hex[:8])
    background_image_url = Column(String, nullable=True)
    background_image_public_id = Column(String, nullable=True)
    images = relationship("Image", back_populates="room")
    guests = relationship("Guest", back_populates="room", cascade="all, delete-orphan")

class Image(Base):
    __tablename__ = "images"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    cloudinary_url = Column(String, nullable=False)
    cloudinary_public_id = Column(String, nullable=False)
    status = Column(String, default="pending")
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    guest_id = Column(String, ForeignKey("guests.id"), nullable=True)
    guest = relationship("Guest", back_populates="images")
    room = relationship("Room", back_populates="images")
    persons = relationship("DetectedPerson", back_populates="image", cascade="all, delete-orphan")

class DetectedPerson(Base):
    __tablename__ = "detected_persons"
    id = Column(Integer, primary_key=True, index=True)
    image_id = Column(Integer, ForeignKey("images.id"), nullable=False)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)  
    cluster_id = Column(Integer, nullable=True)                         
    embedding = Column(ARRAY(Float), nullable=False)                   
    confidence = Column(Float, nullable=False)
    bbox_x = Column(Float)
    bbox_y = Column(Float)
    bbox_w = Column(Float)
    bbox_h = Column(Float)
    face_crop_url = Column(String, nullable=True)
    image = relationship("Image", back_populates="persons")