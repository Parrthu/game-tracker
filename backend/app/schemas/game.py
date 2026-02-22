from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class GameBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    cover_image: Optional[str] = None
    background_image: Optional[str] = None


class GameCreate(GameBase):
    steam_app_id: Optional[str] = None
    psn_id: Optional[str] = None
    xbox_id: Optional[str] = None
    switch_id: Optional[str] = None
    developer: Optional[str] = None
    publisher: Optional[str] = None
    release_date: Optional[datetime] = None
    genres: Optional[str] = None
    metacritic_score: Optional[int] = None
    steam_rating: Optional[float] = None


class GameUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    cover_image: Optional[str] = None
    background_image: Optional[str] = None
    developer: Optional[str] = None
    publisher: Optional[str] = None
    release_date: Optional[datetime] = None
    genres: Optional[str] = None
    metacritic_score: Optional[int] = None
    steam_rating: Optional[float] = None


class GameResponse(GameBase):
    id: int
    steam_app_id: Optional[str] = None
    psn_id: Optional[str] = None
    xbox_id: Optional[str] = None
    switch_id: Optional[str] = None
    developer: Optional[str] = None
    publisher: Optional[str] = None
    release_date: Optional[datetime] = None
    genres: Optional[str] = None
    metacritic_score: Optional[int] = None
    steam_rating: Optional[float] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class GameSearchResult(BaseModel):
    id: int
    name: str
    cover_image: Optional[str] = None
    steam_app_id: Optional[str] = None
    developer: Optional[str] = None
