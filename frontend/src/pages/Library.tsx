import { useEffect, useState } from 'react';
import { 
  Library as LibraryIcon, 
  Clock, 
  Trophy, 
  Gamepad2, 
  CheckCircle, 
  AlertCircle,
  Plus,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { GameCard } from '@/components/GameCard';
import { StatsCard } from '@/components/StatsCard';
import { FilterBar } from '@/components/FilterBar';
import { GameModal } from '@/components/GameModal';
import { AddGameModal } from '@/components/AddGameModal';
import { useGameStore } from '@/stores/gameStore';
import { useAuthStore } from '@/stores/authStore';
import { UserGame, UserGameStats } from '@/types';
import toast from 'react-hot-toast';

function getStatusColor(status: keyof UserGameStats): string {
  const colorMap: Record<string, string> = {
    total_games: '#6366f1',
    playing_count: '#10b981',
    completed_count: '#3b82f6',
    dropped_count: '#ef4444',
    backlog_count: '#f59e0b',
    wishlist_count: '#ec4899',
    total_playtime_hours: '#8b5cf6',
    total_achievements: '#fbbf24',
  };
  return colorMap[status] || '#6366f1';
}

export function Library() {
  const { user } = useAuthStore();
  const { games, stats, isLoading, fetchGames, fetchStats, syncSteam } = useGameStore();
  const [selectedGame, setSelectedGame] = useState<UserGame | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  useEffect(() => {
    fetchGames();
    fetchStats();
  }, [fetchGames, fetchStats]);
  
  const handleSyncSteam = async () => {
    if (!user?.steam_id) {
      toast.error('请先连接Steam账号');
      return;
    }
    
    setIsSyncing(true);
    try {
      await syncSteam();
      toast.success('Steam游戏库同步成功');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSyncing(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Main Content */}
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">我的游戏库</h1>
              <p className="text-text-secondary mt-1">
                共 {stats?.total_games || 0} 款游戏
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSyncSteam}
                disabled={isSyncing || !user?.steam_id}
                className="btn-secondary flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? '同步中...' : '同步Steam'}
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                添加游戏
              </button>
            </div>
          </div>
          
          {/* Stats */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              <StatsCard
                title="总游戏数"
                value={stats.total_games}
                icon={LibraryIcon}
                color={getStatusColor('total_games')}
              />
              <StatsCard
                title="正在玩"
                value={stats.playing_count}
                icon={Gamepad2}
                color={getStatusColor('playing_count')}
              />
              <StatsCard
                title="已完成"
                value={stats.completed_count}
                icon={CheckCircle}
                color={getStatusColor('completed_count')}
              />
              <StatsCard
                title="总时长"
                value={`${Math.round(stats.total_playtime_hours)}h`}
                icon={Clock}
                color={getStatusColor('total_playtime_hours')}
                subtitle={`${stats.total_achievements} 个成就`}
              />
            </motion.div>
          )}
          
          {/* Filters */}
          <div className="mb-6">
            <FilterBar />
          </div>
          
          {/* Game Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : games.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            >
              {games.map((userGame) => (
                <GameCard
                  key={userGame.id}
                  userGame={userGame}
                  onClick={() => setSelectedGame(userGame)}
                />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-surface-light rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-text-muted" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                没有找到游戏
              </h3>
              <p className="text-text-secondary mb-6">
                你的游戏库是空的，开始添加一些游戏吧！
              </p>
              <div className="flex justify-center gap-3">
                {user?.steam_id && (
                  <button
                    onClick={handleSyncSteam}
                    className="btn-secondary"
                  >
                    从Steam同步
                  </button>
                )}
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="btn-primary"
                >
                  手动添加
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Modals */}
      <GameModal
        userGame={selectedGame}
        isOpen={!!selectedGame}
        onClose={() => setSelectedGame(null)}
      />
      
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
