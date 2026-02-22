from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.user_game import GameStatus, Platform
from app.schemas.game import GameResponse


class UserGameBase(BaseModel):
    status: GameStatus = GameStatus.NOT_STARTED
    platform: Platform = Platform.STEAM
    user_rating: Optional[int] = Field(None, ge=1, le=10)
    review: Optional[str] = Field(None, max_length=2000)


class UserGameCreate(UserGameBase):
    game_id: int
    playtime_minutes: int = 0


class UserGameUpdate(BaseModel):
    status: Optional[GameStatus] = None
    platform: Optional[Platform] = None
    user_rating: Optional[int] = Field(None, ge=1, le=10)
    review: Optional[str] = Field(None, max_length=2000)
    playtime_minutes: Optional[int] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


class UserGameResponse(UserGameBase):
    id: int
    user_id: int
    game_id: int
    game: GameResponse
    playtime_minutes: int
    playtime_forever: int
    achievements_earned: int
    achievements_total: int
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    last_played_at: Optional[datetime] = None
    is_synced: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class UserGameStats(BaseModel):
    total_games: int
    playing_count: int
    completed_count: int
    dropped_count: int
    backlog_count: int
    wishlist_count: int
    total_playtime_hours: float
    total_achievements: int


class UserGameFilter(BaseModel):
    status: Optional[GameStatus] = None
    platform: Optional[Platform] = None
    search: Optional[str] = None
