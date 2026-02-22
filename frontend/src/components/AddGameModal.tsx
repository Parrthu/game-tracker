import { useState, useEffect } from 'react';
import { X, Search, Plus, Gamepad2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Game, GameStatus, Platform, GameStatusLabels, PlatformLabels } from '@/types';
import { useGameStore } from '@/stores/gameStore';
import toast from 'react-hot-toast';

interface AddGameModalProps {
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

export function AddGameModal({ isOpen, onClose }: AddGameModalProps) {
  const { allGames, fetchAllGames, addToLibrary, isLoading } = useGameStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [status, setStatus] = useState<GameStatus>('not_started');
  const [platform, setPlatform] = useState<Platform>('steam');
  
  useEffect(() => {
    if (isOpen) {
      fetchAllGames();
    }
  }, [isOpen, fetchAllGames]);
  
  const filteredGames = allGames.filter(game =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAdd = async () => {
    if (!selectedGame) return;
    
    try {
      await addToLibrary(selectedGame.id, status, platform);
      toast.success('游戏已添加到库中');
      handleClose();
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  
  const handleClose = () => {
    setSearchQuery('');
    setSelectedGame(null);
    setStatus('not_started');
    setPlatform('steam');
    onClose();
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[90vh] bg-surface rounded-2xl border border-border z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold">添加游戏到库</h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-surface-light rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {!selectedGame ? (
                // Game Selection
                <>
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="搜索游戏..."
                      className="input-field pl-10"
                      autoFocus
                    />
                  </div>
                  
                  {/* Game List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : filteredGames.length > 0 ? (
                      filteredGames.map((game) => (
                        <button
                          key={game.id}
                          onClick={() => setSelectedGame(game)}
                          className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-surface-light transition-colors text-left"
                        >
                          {game.cover_image ? (
                            <img
                              src={game.cover_image}
                              alt={game.name}
                              className="w-16 h-20 object-cover rounded-lg"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-16 h-20 bg-surface-light rounded-lg flex items-center justify-center">
                              <Gamepad2 className="w-6 h-6 text-text-muted" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{game.name}</h3>
                            {game.developer && (
                              <p className="text-sm text-text-muted">{game.developer}</p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              {game.steam_app_id && (
                                <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded">
                                  Steam
                                </span>
                              )}
                              {game.psn_id && (
                                <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                                  PS
                                </span>
                              )}
                              {game.switch_id && (
                                <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded">
                                  Switch
                                </span>
                              )}
                            </div>
                          </div>
                          <Plus className="w-5 h-5 text-text-muted" />
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-text-muted">
                          {searchQuery ? '没有找到匹配的游戏' : '开始输入搜索游戏'}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // Game Configuration
                <>
                  {/* Selected Game */}
                  <div className="flex items-center gap-4 p-4 bg-surface-light rounded-xl">
                    {selectedGame.cover_image ? (
                      <img
                        src={selectedGame.cover_image}
                        alt={selectedGame.name}
                        className="w-16 h-20 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-20 bg-surface rounded-lg flex items-center justify-center">
                        <Gamepad2 className="w-6 h-6 text-text-muted" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{selectedGame.name}</h3>
                      {selectedGame.developer && (
                        <p className="text-sm text-text-muted">{selectedGame.developer}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedGame(null)}
                      className="text-sm text-primary hover:text-primary-dark"
                    >
                      更换
                    </button>
                  </div>
                  
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-3">
                      游玩状态
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setStatus(option.value)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            status === option.value
                              ? option.value === 'playing' ? 'bg-game-playing/20 text-game-playing border border-game-playing/50' :
                                option.value === 'completed' ? 'bg-game-completed/20 text-game-completed border border-game-completed/50' :
                                option.value === 'dropped' ? 'bg-game-dropped/20 text-game-dropped border border-game-dropped/50' :
                                option.value === 'wishlist' ? 'bg-game-wishlist/20 text-game-wishlist border border-game-wishlist/50' :
                                option.value === 'backlog' ? 'bg-game-backlog/20 text-game-backlog border border-game-backlog/50' :
                                'bg-surface-light text-text-primary border border-border'
                              : 'bg-surface-light text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Platform */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-3">
                      游戏平台
                    </label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value as Platform)}
                      className="input-field"
                    >
                      {platformOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
            
            {/* Footer */}
            {selectedGame && (
              <div className="p-6 border-t border-border flex gap-3">
                <button
                  onClick={handleAdd}
                  className="btn-primary flex-1"
                >
                  添加到库
                </button>
                <button
                  onClick={handleClose}
                  className="btn-secondary px-6"
                >
                  取消
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
