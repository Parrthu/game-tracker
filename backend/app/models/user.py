from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    
    # Steam相关
    steam_id = Column(String(50), unique=True, nullable=True)
    steam_api_key = Column(String(50), nullable=True)  # 用户自己的Steam API Key
    
    # 用户设置
    avatar_url = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    is_demo = Column(Boolean, default=False)  # 标记是否为Demo账号
    
    # 时间戳
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    # 关系
    games = relationship("UserGame", back_populates="user", cascade="all, delete-orphan")
