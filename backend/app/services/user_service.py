from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password


class UserService:
    @staticmethod
    async def get_by_id(db: AsyncSession, user_id: int) -> Optional[User]:
        """通过ID获取用户"""
        result = await db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_by_username(db: AsyncSession, username: str) -> Optional[User]:
        """通过用户名获取用户"""
        result = await db.execute(select(User).where(User.username == username))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_by_email(db: AsyncSession, email: str) -> Optional[User]:
        """通过邮箱获取用户"""
        result = await db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def create(db: AsyncSession, user_create: UserCreate) -> User:
        """创建新用户"""
        hashed_password = get_password_hash(user_create.password)
        
        db_user = User(
            username=user_create.username,
            email=user_create.email,
            hashed_password=hashed_password,
            steam_id=user_create.steam_id,
            is_active=True,
            is_demo=False
        )
        
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        return db_user
    
    @staticmethod
    async def authenticate(db: AsyncSession, username: str, password: str) -> Optional[User]:
        """验证用户密码"""
        user = await UserService.get_by_username(db, username)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user
    
    @staticmethod
    async def update(db: AsyncSession, user: User, user_update: UserUpdate) -> User:
        """更新用户信息"""
        update_data = user_update.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(user, field, value)
        
        await db.commit()
        await db.refresh(user)
        return user
    
    @staticmethod
    async def connect_steam(db: AsyncSession, user: User, steam_id: str, steam_api_key: Optional[str] = None) -> User:
        """连接Steam账号"""
        user.steam_id = steam_id
        if steam_api_key:
            user.steam_api_key = steam_api_key
        
        await db.commit()
        await db.refresh(user)
        return user
