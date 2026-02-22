export interface User {
  id: number;
  username: string;
  email: string;
  avatar_url?: string;
  steam_id?: string;
  is_active: boolean;
  is_demo: boolean;
  created_at: string;
  last_login?: string;
}

export interface Game {
  id: number;
  name: string;
  description?: string;
  cover_image?: string;
  background_image?: string;
  steam_app_id?: string;
  psn_id?: string;
  xbox_id?: string;
  switch_id?: string;
  developer?: string;
  publisher?: string;
  release_date?: string;
  genres?: string;
  metacritic_score?: number;
  steam_rating?: number;
  created_at: string;
}

export type GameStatus = 
  | 'not_started' 
  | 'playing' 
  | 'completed' 
  | 'dropped' 
  | 'wishlist' 
  | 'backlog';

export type Platform = 
  | 'steam' 
  | 'ps5' 
  | 'ps4' 
  | 'xbox_series' 
  | 'xbox_one' 
  | 'switch' 
  | 'pc' 
  | 'mobile' 
  | 'other';

export interface UserGame {
  id: number;
  user_id: number;
  game_id: number;
  game: Game;
  status: GameStatus;
  platform: Platform;
  playtime_minutes: number;
  playtime_forever: number;
  achievements_earned: number;
  achievements_total: number;
  user_rating?: number;
  review?: string;
  started_at?: string;
  completed_at?: string;
  last_played_at?: string;
  is_synced: boolean;
  created_at: string;
}

export interface UserGameStats {
  total_games: number;
  playing_count: number;
  completed_count: number;
  dropped_count: number;
  backlog_count: number;
  wishlist_count: number;
  total_playtime_hours: number;
  total_achievements: number;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  steam_id?: string;
}

export interface UserGameFilter {
  status?: GameStatus;
  platform?: Platform;
  search?: string;
}

export const GameStatusLabels: Record<GameStatus, string> = {
  not_started: '未开始',
  playing: '正在玩',
  completed: '已完成',
  dropped: '弃坑',
  wishlist: '想玩',
  backlog: '积压'
};

export const PlatformLabels: Record<Platform, string> = {
  steam: 'Steam',
  ps5: 'PlayStation 5',
  ps4: 'PlayStation 4',
  xbox_series: 'Xbox Series X/S',
  xbox_one: 'Xbox One',
  switch: 'Nintendo Switch',
  pc: 'PC',
  mobile: 'Mobile',
  other: '其他'
};

export const GameStatusColors: Record<GameStatus, string> = {
  not_started: 'status-not-started',
  playing: 'status-playing',
  completed: 'status-completed',
  dropped: 'status-dropped',
  wishlist: 'status-wishlist',
  backlog: 'status-backlog'
};

export const PlatformIcons: Record<Platform, string> = {
  steam: '🎮',
  ps5: '🎮',
  ps4: '🎮',
  xbox_series: '🎮',
  xbox_one: '🎮',
  switch: '🎮',
  pc: '💻',
  mobile: '📱',
  other: '🎯'
};
