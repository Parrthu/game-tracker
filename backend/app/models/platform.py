from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class PlatformAccount(Base):
    """用户关联的游戏平台账号"""
    __tablename__ = "platform_accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    platform_type = Column(String(50), nullable=False)  # steam, psn, xbox, switch
    platform_username = Column(String(100), nullable=True)
    platform_user_id = Column(String(100), nullable=True)
    
    # 认证信息（加密存储）
    access_token = Column(String(500), nullable=True)
    refresh_token = Column(String(500), nullable=True)
    
    is_active = Column(Boolean, default=True)
    is_connected = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_sync_at = Column(DateTime(timezone=True), nullable=True)
