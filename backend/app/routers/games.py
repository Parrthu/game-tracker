from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.routers.auth import get_current_active_user
from app.models.user import User
from app.schemas.game import GameResponse, GameCreate, GameSearchResult
from app.schemas.user_game import (
    UserGameCreate, UserGameResponse, UserGameUpdate, 
    UserGameStats, UserGameFilter, GameStatus, Platform
)
from app.services.game_service import GameService
from app.services.user_game_service import UserGameService

router = APIRouter(prefix="/games", tags=["游戏"])


@router.get("/search", response_model=List[GameSearchResult])
async def search_games(
    q: str = Query(..., min_length=1, description="搜索关键词"),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """搜索游戏"""
    games = await GameService.search_games(db, q, limit)
    return games


@router.get("/library", response_model=List[UserGameResponse])
async def get_library(
    status: Optional[GameStatus] = None,
    platform: Optional[Platform] = None,
    search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取用户游戏库"""
    filters = UserGameFilter(status=status, platform=platform, search=search)
    games = await UserGameService.get_user_games(db, current_user.id, filters, skip, limit)
    return games


@router.post("/library", response_model=UserGameResponse, status_code=status.HTTP_201_CREATED)
async def add_to_library(
    user_game_create: UserGameCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """添加游戏到用户库"""
    # 检查游戏是否存在
    game = await GameService.get_by_id(db, user_game_create.game_id)
    if not game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="游戏不存在"
        )
    
    # 检查是否已添加
    existing = await UserGameService.get_by_game_id(db, current_user.id, user_game_create.game_id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="游戏已在库中"
        )
    
    user_game = await UserGameService.create(db, current_user.id, user_game_create)
    return user_game


@router.get("/library/stats", response_model=UserGameStats)
async def get_library_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取游戏库统计"""
    stats = await UserGameService.get_stats(db, current_user.id)
    return stats


@router.get("/library/{user_game_id}", response_model=UserGameResponse)
async def get_user_game(
    user_game_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取单个游戏详情"""
    user_game = await UserGameService.get_by_id(db, user_game_id, current_user.id)
    if not user_game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="游戏记录不存在"
        )
    return user_game


@router.put("/library/{user_game_id}", response_model=UserGameResponse)
async def update_user_game(
    user_game_id: int,
    user_game_update: UserGameUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """更新游戏记录"""
    user_game = await UserGameService.get_by_id(db, user_game_id, current_user.id)
    if not user_game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="游戏记录不存在"
        )
    
    updated = await UserGameService.update(db, user_game, user_game_update)
    return updated


@router.delete("/library/{user_game_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_game(
    user_game_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """从库中移除游戏"""
    user_game = await UserGameService.get_by_id(db, user_game_id, current_user.id)
    if not user_game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="游戏记录不存在"
        )
    
    await UserGameService.delete(db, user_game)
    return None


@router.post("/sync/steam")
async def sync_steam_games(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """同步Steam游戏库"""
    if not current_user.steam_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="未连接Steam账号"
        )
    
    result = await UserGameService.sync_steam_games(
        db, 
        current_user.id, 
        current_user.steam_id,
        current_user.steam_api_key
    )
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["message"]
        )
    
    return result


@router.get("/all", response_model=List[GameResponse])
async def get_all_games(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取所有游戏（用于手动添加）"""
    games = await GameService.get_all_games(db, skip, limit)
    return games
