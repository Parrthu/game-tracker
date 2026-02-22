import { create } from 'zustand';
import { 
  UserGame, 
  Game, 
  UserGameStats, 
  UserGameFilter,
  GameStatus,
  Platform 
} from '@/types';
import { api } from '@/services/api';

interface GameState {
  games: UserGame[];
  stats: UserGameStats | null;
  allGames: Game[];
  isLoading: boolean;
  error: string | null;
  filter: UserGameFilter;
  selectedGame: UserGame | null;
  
  // Actions
  fetchGames: (filter?: UserGameFilter) => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchAllGames: () => Promise<void>;
  addToLibrary: (gameId: number, status: GameStatus, platform: Platform) => Promise<void>;
  updateGame: (userGameId: number, data: Partial<UserGame>) => Promise<void>;
  removeGame: (userGameId: number) => Promise<void>;
  syncSteam: () => Promise<void>;
  setFilter: (filter: UserGameFilter) => void;
  setSelectedGame: (game: UserGame | null) => void;
  clearError: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  games: [],
  stats: null,
  allGames: [],
  isLoading: false,
  error: null,
  filter: {},
  selectedGame: null,

  fetchGames: async (filter?: UserGameFilter) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filter?.status) params.append('status', filter.status);
      if (filter?.platform) params.append('platform', filter.platform);
      if (filter?.search) params.append('search', filter.search);
      
      const games = await api.get<UserGame[]>(`/games/library?${params}`);
      set({ games, isLoading: false, filter: filter || {} });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || '获取游戏列表失败',
        isLoading: false,
      });
    }
  },

  fetchStats: async () => {
    try {
      const stats = await api.get<UserGameStats>('/games/library/stats');
      set({ stats });
    } catch (error: any) {
      set({ error: error.response?.data?.detail || '获取统计失败' });
    }
  },

  fetchAllGames: async () => {
    try {
      const games = await api.get<Game[]>('/games/all');
      set({ allGames: games });
    } catch (error: any) {
      set({ error: error.response?.data?.detail || '获取游戏列表失败' });
    }
  },

  addToLibrary: async (gameId: number, status: GameStatus, platform: Platform) => {
    try {
      await api.post('/games/library', {
        game_id: gameId,
        status,
        platform,
        playtime_minutes: 0,
      });
      await get().fetchGames();
      await get().fetchStats();
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || '添加失败');
    }
  },

  updateGame: async (userGameId: number, data: Partial<UserGame>) => {
    try {
      await api.put(`/games/library/${userGameId}`, data);
      await get().fetchGames();
      await get().fetchStats();
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || '更新失败');
    }
  },

  removeGame: async (userGameId: number) => {
    try {
      await api.delete(`/games/library/${userGameId}`);
      await get().fetchGames();
      await get().fetchStats();
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || '删除失败');
    }
  },

  syncSteam: async () => {
    set({ isLoading: true });
    try {
      await api.post('/games/sync/steam');
      await get().fetchGames();
      await get().fetchStats();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || '同步Steam失败',
        isLoading: false,
      });
      throw error;
    }
  },

  setFilter: (filter: UserGameFilter) => {
    set({ filter });
    get().fetchGames(filter);
  },

  setSelectedGame: (game: UserGame | null) => {
    set({ selectedGame: game });
  },

  clearError: () => set({ error: null }),
}));
