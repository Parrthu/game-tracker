from sqlalchemy import Column, Integer, String, Text, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Game(Base):
    __tablename__ = "games"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # 游戏基本信息
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    cover_image = Column(String(500), nullable=True)  # 大海报URL
    background_image = Column(String(500), nullable=True)  # 背景图
    
    # Steam信息
    steam_app_id = Column(String(50), unique=True, nullable=True, index=True)
    
    # 其他平台ID
    psn_id = Column(String(50), nullable=True)
    xbox_id = Column(String(50), nullable=True)
    switch_id = Column(String(50), nullable=True)
    
    # 游戏元数据
    developer = Column(String(255), nullable=True)
    publisher = Column(String(255), nullable=True)
    release_date = Column(DateTime(timezone=True), nullable=True)
    genres = Column(String(255), nullable=True)  # JSON字符串存储
    
    # 评分
    metacritic_score = Column(Integer, nullable=True)
    steam_rating = Column(Float, nullable=True)
    
    # 时间戳
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 关系
    user_games = relationship("UserGame", back_populates="game")
