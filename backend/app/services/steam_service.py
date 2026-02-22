import httpx
from typing import Optional, List, Dict, Any
from app.core.config import get_settings

settings = get_settings()


class SteamService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.STEAM_API_KEY
        self.base_url = settings.STEAM_API_URL
        
    async def _make_request(self, endpoint: str, params: Dict[str, Any]) -> Optional[Dict]:
        """发起Steam API请求"""
        if not self.api_key:
            return None
            
        url = f"{self.base_url}/{endpoint}"
        params["key"] = self.api_key
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, params=params, timeout=30.0)
                response.raise_for_status()
                return response.json()
            except Exception as e:
                print(f"Steam API request failed: {e}")
                return None
    
    async def get_owned_games(self, steam_id: str, include_appinfo: bool = True) -> Optional[List[Dict]]:
        """获取用户拥有的游戏列表"""
        endpoint = "IPlayerService/GetOwnedGames/v0001/"
        params = {
            "steamid": steam_id,
            "include_appinfo": int(include_appinfo),
            "include_played_free_games": 1,
            "format": "json"
        }
        
        data = await self._make_request(endpoint, params)
        if data and "response" in data and "games" in data["response"]:
            return data["response"]["games"]
        return None
    
    async def get_player_achievements(self, steam_id: str, app_id: str) -> Optional[Dict]:
        """获取用户在特定游戏的成就"""
        endpoint = "ISteamUserStats/GetPlayerAchievements/v0001/"
        params = {
            "steamid": steam_id,
            "appid": app_id,
            "format": "json"
        }
        
        return await self._make_request(endpoint, params)
    
    async def get_player_summaries(self, steam_ids: List[str]) -> Optional[List[Dict]]:
        """获取玩家基本信息"""
        endpoint = "ISteamUser/GetPlayerSummaries/v0002/"
        params = {
            "steamids": ",".join(steam_ids),
            "format": "json"
        }
        
        data = await self._make_request(endpoint, params)
        if data and "response" in data and "players" in data["response"]:
            return data["response"]["players"]
        return None
    
    async def get_game_schema(self, app_id: str) -> Optional[Dict]:
        """获取游戏的架构信息（包含成就定义）"""
        endpoint = "ISteamUserStats/GetSchemaForGame/v2/"
        params = {
            "appid": app_id,
            "format": "json"
        }
        
        return await self._make_request(endpoint, params)
    
    async def get_app_details(self, app_id: str) -> Optional[Dict]:
        """获取游戏详细信息（来自Steam Store）"""
        url = f"https://store.steampowered.com/api/appdetails"
        params = {
            "appids": app_id,
            "cc": "cn",
            "l": "schinese"
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, params=params, timeout=30.0)
                response.raise_for_status()
                data = response.json()
                if data and app_id in data and data[app_id].get("success"):
                    return data[app_id]["data"]
            except Exception as e:
                print(f"Steam Store API request failed: {e}")
        return None
    
    @staticmethod
    def get_steam_icon_url(app_id: str, icon_hash: str) -> str:
        """获取Steam游戏图标URL"""
        return f"http://media.steampowered.com/steamcommunity/public/images/apps/{app_id}/{icon_hash}.jpg"
    
    @staticmethod
    def get_steam_header_url(app_id: str) -> str:
        """获取Steam游戏头部图片URL"""
        return f"https://cdn.cloudflare.steamstatic.com/steam/apps/{app_id}/header.jpg"
    
    @staticmethod
    def get_steam_library_hero_url(app_id: str) -> str:
        """获取Steam游戏库英雄图URL"""
        return f"https://cdn.cloudflare.steamstatic.com/steam/apps/{app_id}/library_hero.jpg"
    
    @staticmethod
    def get_steam_library_600x900_url(app_id: str) -> str:
        """获取Steam游戏库海报图（600x900）"""
        return f"https://cdn.cloudflare.steamstatic.com/steam/apps/{app_id}/library_600x900.jpg"
    
    @staticmethod
    def get_steam_store_url(app_id: str) -> str:
        """获取Steam商店页面URL"""
        return f"https://store.steampowered.com/app/{app_id}"


# 单例实例
steam_service = SteamService()


async def get_steam_service(api_key: Optional[str] = None) -> SteamService:
    """获取Steam服务实例"""
    if api_key:
        return SteamService(api_key)
    return steam_service
