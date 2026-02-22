from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional


class Settings(BaseSettings):
    # 应用配置
    APP_NAME: str = "Game Tracker"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # 数据库配置
    DATABASE_URL: str = "sqlite+aiosqlite:///./gametracker.db"
    # 可选：PostgreSQL: postgresql+asyncpg://user:password@localhost/gametracker
    
    # JWT配置
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7天
    
    # Steam API配置
    STEAM_API_KEY: Optional[str] = None
    STEAM_API_URL: str = "https://api.steampowered.com"
    
    # CORS配置
    CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000"]
    
    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
