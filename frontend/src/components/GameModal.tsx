import { useState } from 'react';
import { X, Clock, Trophy, Calendar, Star, Trash2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserGame, GameStatus, Platform, GameStatusLabels, PlatformLabels } from '@/types';
import { useGameStore } from '@/stores/gameStore';
import { formatPlaytime, formatDate } from '@/utils/format';
import toast from 'react-hot-toast';

interface GameModalProps {
  userGame: UserGame | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusOptions = Object.entries(GameStatusLabels).map(([value, label]) => ({
  value: value as GameStatus,
  label,
}));

const platformOptions = Object.entries(PlatformLabels).map(([value, label]) => ({
  value: value as Platform,
  label,
}));

export function GameModal({ userGame, isOpen, onClose }: GameModalProps) {
  const { updateGame, removeGame } = useGameStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<UserGame>>({});
  
  if (!userGame) return null;
  
  const { game, status, platform, playtime_minutes, achievements_earned, achievements_total } = userGame;
  
  const handleUpdate = async () => {
    try {
      await updateGame(userGame.id, editData);
      toast.success('更新成功');
      setIsEditing(false);
      setEditData({});
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  
  const handleDelete = async () => {
    if (!confirm('确定要从游戏库中移除这款游戏吗？')) return;
    
    try {
      await removeGame(userGame.id);
      toast.success('已移除');
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  
  const achievementRate = achievements_total > 0 
    ? Math.round((achievements_earned / achievements_total) * 100) 
    : 0;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[90vh] bg-surface rounded-2xl border border-border z-50 overflow-hidden flex flex-col"
          >
            {/* Header Image */}
            <div className="relative h-48 md:h-64 flex-shrink-0">
              {game.background_image || game.cover_image ? (
                <img
                  src={game.background_image || game.cover_image}
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-surface-light flex items-center justify-center">
                  <span className="text-6xl">🎮</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              
              {/* Title */}
              <div className="absolute bottom-4 left-6 right-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white text-shadow">
                  {game.name}
                </h2>
                {game.developer && (
                  <p className="text-white/80 mt-1">{game.developer}</p>
                )}
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-panel p-3 text-center">
                  <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold">{formatPlaytime(playtime_minutes)}</p>
                  <p className="text-xs text-text-muted">游戏时间</p>
                </div>
                <div className="glass-panel p-3 text-center">
                  <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                  <p className="text-lg font-bold">{achievementRate}%</p>
                  <p className="text-xs text-text-muted">{achievements_earned}/{achievements_total}</p>
                </div>
                <div className="glass-panel p-3 text-center">
                  <Star className="w-5 h-5 text-game-backlog mx-auto mb-1" />
                  <p className="text-lg font-bold">{userGame.user_rating || '-'}</p>
                  <p className="text-xs text-text-muted">评分</p>
                </div>
                <div className="glass-panel p-3 text-center">
                  <Calendar className="w-5 h-5 text-accent mx-auto mb-1" />
                  <p className="text-lg font-bold">{formatDate(userGame.started_at)}</p>
                  <p className="text-xs text-text-muted">开始时间</p>
                </div>
              </div>
              
              {/* Edit Form or Details */}
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">状态</label>
                    <select
                      value={editData.status || status}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value as GameStatus })}
                      className="input-field"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">平台</label>
                    <select
                      value={editData.platform || platform}
                      onChange={(e) => setEditData({ ...editData, platform: e.target.value as Platform })}
                      className="input-field"
                    >
                      {platformOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">评分 (1-10)</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={editData.user_rating || userGame.user_rating || ''}
                      onChange={(e) => setEditData({ ...editData, user_rating: parseInt(e.target.value) || undefined })}
                      className="input-field"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleUpdate}
                      className="btn-primary flex-1"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditData({});
                      }}
                      className="btn-secondary flex-1"
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Current Status */}
                  <div className="glass-panel p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-text-secondary text-sm">当前状态</p>
                        <p className="text-lg font-semibold mt-1">
                          <span className={`status-badge ${
                            status === 'playing' ? 'status-playing' :
                            status === 'completed' ? 'status-completed' :
                            status === 'dropped' ? 'status-dropped' :
                            status === 'wishlist' ? 'status-wishlist' :
                            status === 'backlog' ? 'status-backlog' :
                            'status-not-started'
                          }`}>
                            {GameStatusLabels[status]}
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-text-secondary text-sm">平台</p>
                        <p className="text-lg font-semibold mt-1">{PlatformLabels[platform]}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  {game.description && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">简介</h3>
                      <p className="text-text-secondary leading-relaxed">{game.description}</p>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn-primary flex-1"
                    >
                      编辑
                    </button>
                    {game.steam_app_id && (
                      <a
                        href={`https://store.steampowered.com/app/${game.steam_app_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Steam
                      </a>
                    )}
                    <button
                      onClick={handleDelete}
                      className="px-4 py-3 bg-game-dropped/20 hover:bg-game-dropped/30 text-game-dropped rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
