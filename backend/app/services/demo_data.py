from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.core.security import get_password_hash
from app.models.user import User
from app.models.game import Game
from app.models.user_game import UserGame, GameStatus, Platform


async def create_demo_data():
    """创建Demo账号和示例数据"""
    async with AsyncSessionLocal() as db:
        try:
            # 检查Demo账号是否已存在
            result = await db.execute(select(User).where(User.username == "demo"))
            existing_user = result.scalar_one_or_none()
            
            if existing_user:
                print("Demo user already exists, skipping...")
                return
            
            # 创建Demo用户
            demo_user = User(
                username="demo",
                email="demo@gametracker.com",
                hashed_password=get_password_hash("demo123"),
                steam_id="76561197960434622",  # GabeN的Steam ID作为示例
                is_active=True,
                is_demo=True,
                avatar_url="https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg"
            )
            db.add(demo_user)
            await db.flush()  # 获取ID但不提交
            
            # 创建示例游戏
            demo_games = [
                # Steam游戏
                {
                    "name": "The Witcher 3: Wild Hunt",
                    "steam_app_id": "292030",
                    "description": "你是一个怪物猎人，在一个道德模糊的奇幻开放世界中冒险。",
                    "cover_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/library_600x900.jpg",
                    "background_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg",
                    "developer": "CD PROJEKT RED",
                    "publisher": "CD PROJEKT RED",
                    "genres": "RPG,Open World,Story Rich",
                    "metacritic_score": 93
                },
                {
                    "name": "Hades",
                    "steam_app_id": "1145360",
                    "description": "Defy the god of the dead as you hack and slash out of the Underworld.",
                    "cover_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/library_600x900.jpg",
                    "background_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg",
                    "developer": "Supergiant Games",
                    "publisher": "Supergiant Games",
                    "genres": "Roguelike,Action,Indie",
                    "metacritic_score": 93
                },
                {
                    "name": "Elden Ring",
                    "steam_app_id": "1245620",
                    "description": "THE NEW FANTASY ACTION RPG. Rise, Tarnished.",
                    "cover_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/library_600x900.jpg",
                    "background_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg",
                    "developer": "FromSoftware",
                    "publisher": "FromSoftware Inc.,Bandai Namco Entertainment",
                    "genres": "Souls-like,RPG,Action",
                    "metacritic_score": 96
                },
                {
                    "name": "Hollow Knight",
                    "steam_app_id": "367520",
                    "description": "Forge your own path in Hollow Knight!",
                    "cover_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/367520/library_600x900.jpg",
                    "background_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/367520/header.jpg",
                    "developer": "Team Cherry",
                    "publisher": "Team Cherry",
                    "genres": "Metroidvania,Platformer,Indie",
                    "metacritic_score": 90
                },
                {
                    "name": "Red Dead Redemption 2",
                    "steam_app_id": "1174180",
                    "description": "亚瑟·摩根和范德林德帮派在黑水镇的一次抢劫失败后，不得不开始逃亡。",
                    "cover_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/library_600x900.jpg",
                    "background_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg",
                    "developer": "Rockstar Games",
                    "publisher": "Rockstar Games",
                    "genres": "Open World,Story Rich,Western",
                    "metacritic_score": 93
                },
                {
                    "name": "Cyberpunk 2077",
                    "steam_app_id": "1091500",
                    "description": "Cyberpunk 2077是一款开放世界动作冒险RPG游戏。",
                    "cover_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/library_600x900.jpg",
                    "background_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
                    "developer": "CD PROJEKT RED",
                    "publisher": "CD PROJEKT RED",
                    "genres": "Open World,RPG,Futuristic",
                    "metacritic_score": 86
                },
                {
                    "name": "Baldur's Gate 3",
                    "steam_app_id": "1086940",
                    "description": "召集你的队伍，回到被遗忘的国度。",
                    "cover_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/library_600x900.jpg",
                    "background_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg",
                    "developer": "Larian Studios",
                    "publisher": "Larian Studios",
                    "genres": "RPG,Turn-Based,Story Rich",
                    "metacritic_score": 96
                },
                {
                    "name": "God of War",
                    "steam_app_id": "1593500",
                    "description": "奎托斯复仇奥林匹斯众神的往事已尘封多年，他现在以凡人的身份生活在北欧众神和怪物环伺的领土中。",
                    "cover_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/library_600x900.jpg",
                    "background_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/header.jpg",
                    "developer": "Santa Monica Studio",
                    "publisher": "PlayStation PC LLC",
                    "genres": "Action,Adventure,Story Rich",
                    "metacritic_score": 93
                },
                # 非Steam游戏（数据库中的游戏）
                {
                    "name": "塞尔达传说：王国之泪",
                    "steam_app_id": None,
                    "switch_id": "0100f2c0115b6000",
                    "description": "任天堂动作冒险游戏的巅峰之作，在海拉鲁的空中岛屿展开冒险。",
                    "cover_image": "https://upload.wikimedia.org/wikipedia/en/thumb/f/fb/The_Legend_of_Zelda_Tears_of_the_Kingdom_cover.jpg/400px-The_Legend_of_Zelda_Tears_of_the_Kingdom_cover.jpg",
                    "background_image": None,
                    "developer": "Nintendo EPD",
                    "publisher": "Nintendo",
                    "genres": "Action,Adventure,Open World",
                    "metacritic_score": 96
                },
                {
                    "name": "漫威蜘蛛侠2",
                    "steam_app_id": None,
                    "psn_id": "PPSA08333_00",
                    "description": "彼得·帕克和迈尔斯·莫拉莱斯两代蜘蛛侠联手对抗威胁纽约的反派。",
                    "cover_image": "https://upload.wikimedia.org/wikipedia/en/thumb/0/0f/Spider-Man_2_cover_art.jpg/400px-Spider-Man_2_cover_art.jpg",
                    "background_image": None,
                    "developer": "Insomniac Games",
                    "publisher": "Sony Interactive Entertainment",
                    "genres": "Action,Adventure,Superhero",
                    "metacritic_score": 90
                },
                {
                    "name": "最终幻想 XVI",
                    "steam_app_id": None,
                    "psn_id": "PPSA10665_00",
                    "description": "召唤兽的召唤者们在瓦利斯泽亚大陆上争夺母水晶的力量。",
                    "cover_image": "https://upload.wikimedia.org/wikipedia/en/thumb/0/00/Final_Fantasy_XVI_cover_art.png/400px-Final_Fantasy_XVI_cover_art.png",
                    "background_image": None,
                    "developer": "Square Enix",
                    "publisher": "Square Enix",
                    "genres": "RPG,Action,Fantasy",
                    "metacritic_score": 87
                },
                {
                    "name": "Horizon Forbidden West",
                    "steam_app_id": None,
                    "psn_id": "PPSA01556_00",
                    "description": "埃洛伊前往西方禁地调查一种致命瘟疫。",
                    "cover_image": "https://upload.wikimedia.org/wikipedia/en/thumb/6/69/Horizon_Forbidden_West_cover_art.jpg/400px-Horizon_Forbidden_West_cover_art.jpg",
                    "background_image": None,
                    "developer": "Guerrilla Games",
                    "publisher": "Sony Interactive Entertainment",
                    "genres": "Action,RPG,Open World",
                    "metacritic_score": 88
                }
            ]
            
            created_games = []
            for game_data in demo_games:
                game = Game(**game_data)
                db.add(game)
                created_games.append(game)
            
            await db.flush()
            
            # 创建用户游戏关联
            user_games_data = [
                # 正在玩
                {"game": created_games[0], "status": GameStatus.PLAYING, "platform": Platform.STEAM, 
                 "playtime": 3240, "achievements": 25, "total_achievements": 78},  # 巫师3
                {"game": created_games[10], "status": GameStatus.PLAYING, "platform": Platform.PS5,
                 "playtime": 1800, "achievements": 15, "total_achievements": 50},  # FF16
                
                # 已完成
                {"game": created_games[1], "status": GameStatus.COMPLETED, "platform": Platform.STEAM,
                 "playtime": 4500, "achievements": 49, "total_achievements": 49, "rating": 10},  # Hades
                {"game": created_games[2], "status": GameStatus.COMPLETED, "platform": Platform.STEAM,
                 "playtime": 8900, "achievements": 35, "total_achievements": 42, "rating": 9},  # 老头环
                {"game": created_games[3], "status": GameStatus.COMPLETED, "platform": Platform.STEAM,
                 "playtime": 2800, "achievements": 52, "total_achievements": 63, "rating": 10},  # 空洞骑士
                {"game": created_games[9], "status": GameStatus.COMPLETED, "platform": Platform.PS5,
                 "playtime": 2400, "achievements": 42, "total_achievements": 42, "rating": 9},  # 蜘蛛侠2
                
                # 积压
                {"game": created_games[4], "status": GameStatus.BACKLOG, "platform": Platform.STEAM,
                 "playtime": 120, "achievements": 5, "total_achievements": 51},  # 大镖客2
                {"game": created_games[5], "status": GameStatus.BACKLOG, "platform": Platform.STEAM,
                 "playtime": 480, "achievements": 12, "total_achievements": 44},  # 赛博朋克
                {"game": created_games[11], "status": GameStatus.BACKLOG, "platform": Platform.PS5,
                 "playtime": 0, "achievements": 0, "total_achievements": 79},  # 地平线2
                
                # 想玩
                {"game": created_games[6], "status": GameStatus.WISHLIST, "platform": Platform.STEAM,
                 "playtime": 0, "achievements": 0, "total_achievements": 54},  # 博德之门3
                
                # 弃坑
                {"game": created_games[7], "status": GameStatus.DROPPED, "platform": Platform.STEAM,
                 "playtime": 360, "achievements": 8, "total_achievements": 37},  # 战神
                 
                # Switch游戏
                {"game": created_games[8], "status": GameStatus.COMPLETED, "platform": Platform.SWITCH,
                 "playtime": 5600, "achievements": 0, "total_achievements": 0, "rating": 10},  # 王国之泪
            ]
            
            for ug_data in user_games_data:
                user_game = UserGame(
                    user_id=demo_user.id,
                    game_id=ug_data["game"].id,
                    status=ug_data["status"],
                    platform=ug_data["platform"],
                    playtime_minutes=ug_data["playtime"],
                    playtime_forever=ug_data["playtime"],
                    achievements_earned=ug_data["achievements"],
                    achievements_total=ug_data["total_achievements"],
                    user_rating=ug_data.get("rating"),
                    is_synced=True
                )
                db.add(user_game)
            
            await db.commit()
            print("✅ Demo data created successfully!")
            print(f"   - Demo user: demo / demo123")
            print(f"   - Games in library: {len(user_games_data)}")
            
        except Exception as e:
            await db.rollback()
            print(f"Error creating demo data: {e}")
            raise
