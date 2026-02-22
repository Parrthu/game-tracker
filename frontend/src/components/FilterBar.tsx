import { Search, Filter, Gamepad2, Monitor, Smartphone } from 'lucide-react';
import { 
  GameStatus, 
  Platform, 
  GameStatusLabels, 
  PlatformLabels,
  UserGameFilter 
} from '@/types';
import { useGameStore } from '@/stores/gameStore';

const statusOptions: { value: GameStatus | ''; label: string }[] = [
  { value: '', label: '全部状态' },
  { value: 'playing', label: '正在玩' },
  { value: 'completed', label: '已完成' },
  { value: 'backlog', label: '积压' },
  { value: 'wishlist', label: '想玩' },
  { value: 'dropped', label: '弃坑' },
  { value: 'not_started', label: '未开始' },
];

const platformOptions: { value: Platform | ''; label: string; icon: typeof Gamepad2 }[] = [
  { value: '', label: '全部平台', icon: Gamepad2 },
  { value: 'steam', label: 'Steam', icon: Gamepad2 },
  { value: 'ps5', label: 'PS5', icon: Gamepad2 },
  { value: 'switch', label: 'Switch', icon: Gamepad2 },
  { value: 'xbox_series', label: 'Xbox', icon: Gamepad2 },
  { value: 'pc', label: 'PC', icon: Monitor },
  { value: 'mobile', label: 'Mobile', icon: Smartphone },
];

export function FilterBar() {
  const { filter, setFilter } = useGameStore();
  
  const handleStatusChange = (status: string) => {
    setFilter({ ...filter, status: status as GameStatus || undefined });
  };
  
  const handlePlatformChange = (platform: string) => {
    setFilter({ ...filter, platform: platform as Platform || undefined });
  };
  
  const handleSearchChange = (search: string) => {
    setFilter({ ...filter, search: search || undefined });
  };
  
  return (
    <div className="glass-panel p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input
          type="text"
          placeholder="搜索游戏..."
          defaultValue={filter.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="input-field pl-10"
        />
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-secondary" />
          <select
            value={filter.status || ''}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="bg-surface-light border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-primary outline-none"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Platform Filter */}
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-text-secondary" />
          <select
            value={filter.platform || ''}
            onChange={(e) => handlePlatformChange(e.target.value)}
            className="bg-surface-light border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-primary outline-none"
          >
            {platformOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Clear Filters */}
        {(filter.status || filter.platform || filter.search) && (
          <button
            onClick={() => setFilter({})}
            className="text-sm text-primary hover:text-primary-dark transition-colors"
          >
            清除筛选
          </button>
        )}
      </div>
    </div>
  );
}
