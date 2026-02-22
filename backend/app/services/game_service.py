from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func
from app.models.game import Game
from app.schemas.game import GameCreate, GameUpdate


class GameService:
    @staticmethod
    async def get_by_id(db: AsyncSession, game_id: int) -> Optional[Game]:
        """通过ID获取游戏"""
        result = await db.execute(select(Game).where(Game.id == game_id))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_by_steam_app_id(db: AsyncSession, steam_app_id: str) -> Optional[Game]:
        """通过Steam App ID获取游戏"""
        result = await db.execute(select(Game).where(Game.steam_app_id == steam_app_id))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def create(db: AsyncSession, game_create: GameCreate) -> Game:
        """创建新游戏"""
        db_game = Game(**game_create.model_dump())
        db.add(db_game)
        await db.commit()
        await db.refresh(db_game)
        return db_game
    
    @staticmethod
    async def get_or_create_by_steam_app_id(db: AsyncSession, steam_app_id: str, game_data: dict) -> Game:
        """通过Steam App ID获取或创建游戏"""
        game = await GameService.get_by_steam_app_id(db, steam_app_id)
        if game:
            return game
        
        # 创建新游戏
        game_create = GameCreate(
            name=game_data.get("name", "Unknown Game"),
            steam_app_id=steam_app_id,
            cover_image=game_data.get("cover_image"),
            background_image=game_data.get("background_image"),
            developer=game_data.get("developer"),
            publisher=game_data.get("publisher"),
            genres=game_data.get("genres")
        )
        return await GameService.create(db, game_create)
    
    @staticmethod
    async def search_games(db: AsyncSession, query: str, limit: int = 20) -> List[Game]:
        """搜索游戏"""
        result = await db.execute(
            select(Game)
            .where(Game.name.ilike(f"%{query}%"))
            .limit(limit)
        )
        return result.scalars().all()
    
    @staticmethod
    async def get_all_games(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Game]:
        """获取所有游戏列表"""
        result = await db.execute(
            select(Game)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()
    
    @staticmethod
    async def update(db: AsyncSession, game: Game, game_update: GameUpdate) -> Game:
        """更新游戏信息"""
        update_data = game_update.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(game, field, value)
        
        await db.commit()
        await db.refresh(game)
        return game
