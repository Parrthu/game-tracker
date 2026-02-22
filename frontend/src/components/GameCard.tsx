import { Play, Clock, Trophy, ExternalLink } from 'lucide-react';
import { UserGame, GameStatusLabels, GameStatusColors, PlatformLabels } from '@/types';
import { formatPlaytime } from '@/utils/format';

interface GameCardProps {
  userGame: UserGame;
  onClick?: () => void;
}

export function GameCard({ userGame, onClick }: GameCardProps) {
  const { game, status, platform, playtime_minutes, achievements_earned, achievements_total } = userGame;
  
  const statusColorClass = GameStatusColors[status];
  const statusLabel = GameStatusLabels[status];
  const platformLabel = PlatformLabels[platform];
  
  const achievementRate = achievements_total > 0 
    ? Math.round((achievements_earned / achievements_total) * 100) 
    : 0;
  
  return (
    <div
      onClick={onClick}
      className="game-card group cursor-pointer bg-surface rounded-xl overflow-hidden border border-border hover:border-primary/50"
    >
      {/* Cover Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {game.cover_image ? (
          <img
            src={game.cover_image}
            alt={game.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=No+Image';
            }}
          />
        ) : (
          <div className="w-full h-full bg-surface-light flex items-center justify-center">
            <span className="text-4xl">🎮</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <span className={`status-badge ${statusColorClass}`}>
            {statusLabel}
          </span>
        </div>
        
        {/* Platform Badge */}
        <div className="absolute top-2 right-2">
          <span className="status-badge bg-surface/80 text-text-primary backdrop-blur-sm">
            {platformLabel}
          </span>
        </div>
        
        {/* Hover Overlay */}
        <div className="game-overlay flex flex-col justify-end p-4">
          <div className="space-y-2">
            {/* Playtime */}
            {playtime_minutes > 0 && (
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <Clock className="w-4 h-4" />
                <span>{formatPlaytime(playtime_minutes)}</span>
              </div>
            )}
            
            {/* Achievements */}
            {achievements_total > 0 && (
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <Trophy className="w-4 h-4" />
                <span>{achievements_earned}/{achievements_total} ({achievementRate}%)</span>
              </div>
            )}
            
            {/* User Rating */}
            {userGame.user_rating && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">{'★'.repeat(userGame.user_rating)}</span>
                <span className="text-yellow-400/50">{'★'.repeat(10 - userGame.user_rating)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Game Info */}
      <div className="p-3">
        <h3 className="font-semibold text-text-primary line-clamp-2 group-hover:text-primary transition-colors">
          {game.name}
        </h3>
        {game.developer && (
          <p className="text-xs text-text-muted mt-1">{game.developer}</p>
        )}
      </div>
    </div>
  );
}
