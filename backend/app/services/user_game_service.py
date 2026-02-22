from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import joinedload
from app.models.user_game import UserGame, GameStatus, Platform
from app.models.game import Game
from app.schemas.user_game import UserGameCreate, UserGameUpdate, UserGameStats, UserGameFilter
from app.services.game_service import GameService
from app.services.steam_service import get_steam_service, SteamService


class UserGameService:
    @staticmethod
    async def get_by_id(db: AsyncSession, user_game_id: int, user_id: int) -> Optional[UserGame]:
        """通过ID获取用户游戏记录"""
        result = await db.execute(
            select(UserGame)
            .where(and_(UserGame.id == user_game_id, UserGame.user_id == user_id))
            .options(joinedload(UserGame.game))
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_by_game_id(db: AsyncSession, user_id: int, game_id: int) -> Optional[UserGame]:
        """通过游戏ID获取用户游戏记录"""
        result = await db.execute(
            select(UserGame)
            .where(and_(UserGame.user_id == user_id, UserGame.game_id == game_id))
            .options(joinedload(UserGame.game))
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def create(db: AsyncSession, user_id: int, user_game_create: UserGameCreate) -> UserGame:
        """添加游戏到用户库"""
        db_user_game = UserGame(
            user_id=user_id,
            **user_game_create.model_dump()
        )
        db.add(db_user_game)
        await db.commit()
        await db.refresh(db_user_game)
        return db_user_game
    
    @staticmethod
    async def update(db: AsyncSession, user_game: UserGame, user_game_update: UserGameUpdate) -> UserGame:
        """更新用户游戏记录"""
        update_data = user_game_update.model_dump(exclude_unset=True)
        
        # 处理状态变更的时间记录
        if "status" in update_data:
            new_status = update_data["status"]
            if new_status == GameStatus.PLAYING and not user_game.started_at:
                update_data["started_at"] = func.now()
            elif new_status == GameStatus.COMPLETED and not user_game.completed_at:
                update_data["completed_at"] = func.now()
        
        for field, value in update_data.items():
            setattr(user_game, field, value)
        
        await db.commit()
        await db.refresh(user_game)
        return user_game
    
    @staticmethod
    async def delete(db: AsyncSession, user_game: UserGame) -> None:
        """删除用户游戏记录"""
        await db.delete(user_game)
        await db.commit()
    
    @staticmethod
    async def get_user_games(
        db: AsyncSession, 
        user_id: int, 
        filters: Optional[UserGameFilter] = None,
        skip: int = 0, 
        limit: int = 100
    ) -> List[UserGame]:
        """获取用户的游戏列表"""
        query = select(UserGame).where(UserGame.user_id == user_id).options(joinedload(UserGame.game))
        
        if filters:
            if filters.status:
                query = query.where(UserGame.status == filters.status)
            if filters.platform:
                query = query.where(UserGame.platform == filters.platform)
            if filters.search:
                query = query.join(Game).where(Game.name.ilike(f"%{filters.search}%"))
        
        query = query.offset(skip).limit(limit).order_by(UserGame.last_played_at.desc().nullslast())
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_stats(db: AsyncSession, user_id: int) -> UserGameStats:
        """获取用户游戏统计"""
        # 基础统计
        total_result = await db.execute(
            select(func.count(UserGame.id)).where(UserGame.user_id == user_id)
        )
        total_games = total_result.scalar() or 0
        
        # 各状态统计
        playing_result = await db.execute(
            select(func.count(UserGame.id))
            .where(and_(UserGame.user_id == user_id, UserGame.status == GameStatus.PLAYING))
        )
        playing_count = playing_result.scalar() or 0
        
        completed_result = await db.execute(
            select(func.count(UserGame.id))
            .where(and_(UserGame.user_id == user_id, UserGame.status == GameStatus.COMPLETED))
        )
        completed_count = completed_result.scalar() or 0
        
        dropped_result = await db.execute(
            select(func.count(UserGame.id))
            .where(and_(UserGame.user_id == user_id, UserGame.status == GameStatus.DROPPED))
        )
        dropped_count = dropped_result.scalar() or 0
        
        backlog_result = await db.execute(
            select(func.count(UserGame.id))
            .where(and_(UserGame.user_id == user_id, UserGame.status == GameStatus.BACKLOG))
        )
        backlog_count = backlog_result.scalar() or 0
        
        wishlist_result = await db.execute(
            select(func.count(UserGame.id))
            .where(and_(UserGame.user_id == user_id, UserGame.status == GameStatus.WISHLIST))
        )
        wishlist_count = wishlist_result.scalar() or 0
        
        # 总游戏时间
        playtime_result = await db.execute(
            select(func.sum(UserGame.playtime_minutes)).where(UserGame.user_id == user_id)
        )
        total_minutes = playtime_result.scalar() or 0
        
        # 总成就数
        achievements_result = await db.execute(
            select(func.sum(UserGame.achievements_earned)).where(UserGame.user_id == user_id)
        )
        total_achievements = achievements_result.scalar() or 0
        
        return UserGameStats(
            total_games=total_games,
            playing_count=playing_count,
            completed_count=completed_count,
            dropped_count=dropped_count,
            backlog_count=backlog_count,
            wishlist_count=wishlist_count,
            total_playtime_hours=round(total_minutes / 60, 1),
            total_achievements=total_achievements
        )
    
    @staticmethod
    async def sync_steam_games(db: AsyncSession, user_id: int, steam_id: str, api_key: Optional[str] = None) -> dict:
        """同步Steam游戏库"""
        steam_service = await get_steam_service(api_key)
        
        # 获取Steam游戏列表
        steam_games = await steam_service.get_owned_games(steam_id, include_appinfo=True)
        
        if not steam_games:
            return {"success": False, "message": "无法获取Steam游戏数据", "added": 0, "updated": 0}
        
        added_count = 0
        updated_count = 0
        
        for steam_game in steam_games:
            app_id = str(steam_game["appid"])
            name = steam_game.get("name", "Unknown Game")
            playtime_forever = steam_game.get("playtime_forever", 0)
            playtime_2weeks = steam_game.get("playtime_2weeks", 0)
            
            # 获取或创建游戏记录
            game = await GameService.get_by_steam_app_id(db, app_id)
            if not game:
                # 从Steam获取更多信息
                cover_image = SteamService.get_steam_library_600x900_url(app_id)
                header_image = SteamService.get_steam_header_url(app_id)
                
                game_data = {
                    "name": name,
                    "cover_image": cover_image,
                    "background_image": header_image
                }
                game = await GameService.get_or_create_by_steam_app_id(db, app_id, game_data)
                added_count += 1
            
            # 检查用户是否已有此游戏记录
            user_game = await UserGameService.get_by_game_id(db, user_id, game.id)
            
            if user_game:
                # 更新现有记录
                user_game.playtime_forever = playtime_forever
                user_game.is_synced = True
                if playtime_2weeks > 0:
                    user_game.last_played_at = func.now()
                updated_count += 1
            else:
                # 创建新记录
                user_game_create = UserGameCreate(
                    game_id=game.id,
                    status=GameStatus.NOT_STARTED,
                    platform=Platform.STEAM,
                    playtime_minutes=playtime_forever
                )
                user_game = await UserGameService.create(db, user_id, user_game_create)
                user_game.playtime_forever = playtime_forever
                user_game.is_synced = True
                if playtime_forever > 0:
                    user_game.last_played_at = func.now()
        
        await db.commit()
        
        return {
            "success": True,
            "message": f"成功同步Steam游戏库",
            "added": added_count,
            "updated": updated_count,
            "total": len(steam_games)
        }
