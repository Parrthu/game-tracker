from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, Boolean, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class GameStatus(str, enum.Enum):
    NOT_STARTED = "not_started"  # 未开始
    PLAYING = "playing"          # 正在玩
    COMPLETED = "completed"      # 已完成
    DROPPED = "dropped"          # 弃坑
    WISHLIST = "wishlist"        # 想玩
    BACKLOG = "backlog"          # 积压


class Platform(str, enum.Enum):
    STEAM = "steam"
    PS5 = "ps5"
    PS4 = "ps4"
    XBOX_SERIES = "xbox_series"
    XBOX_ONE = "xbox_one"
    SWITCH = "switch"
    PC = "pc"
    MOBILE = "mobile"
    OTHER = "other"


class UserGame(Base):
    __tablename__ = "user_games"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    game_id = Column(Integer, ForeignKey("games.id"), nullable=False)
    
    # 游玩状态
    status = Column(Enum(GameStatus), default=GameStatus.NOT_STARTED, nullable=False)
    platform = Column(Enum(Platform), default=Platform.STEAM, nullable=False)
    
    # 游戏时间（分钟）
    playtime_minutes = Column(Integer, default=0)
    playtime_forever = Column(Integer, default=0)  # Steam总游戏时间
    
    # 成就
    achievements_earned = Column(Integer, default=0)
    achievements_total = Column(Integer, default=0)
    
    # 评分和评价
    user_rating = Column(Integer, nullable=True)  # 1-10
    review = Column(String(2000), nullable=True)
    
    # 时间记录
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    last_played_at = Column(DateTime(timezone=True), nullable=True)
    
    # 同步状态
    is_synced = Column(Boolean, default=False)  # 是否从平台同步
    
    # 时间戳
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 关系
    user = relationship("User", back_populates="games")
    game = relationship("Game", back_populates="user_games")
