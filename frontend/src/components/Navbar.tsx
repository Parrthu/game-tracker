import { Link, useLocation } from 'react-router-dom';
import { Gamepad2, Library, User as UserIcon, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { getInitials } from '@/utils/format';

export function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Game Tracker</span>
          </Link>
          
          {/* Navigation */}
          <div className="flex items-center gap-1">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-primary/20 text-primary' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-light'
              }`}
            >
              <Library className="w-5 h-5" />
              <span className="hidden sm:inline">游戏库</span>
            </Link>
          </div>
          
          {/* User Menu */}
          <div className="flex items-center gap-3">
            {user?.is_demo && (
              <span className="px-2 py-1 text-xs font-medium bg-game-backlog/20 text-game-backlog rounded-full">
                Demo
              </span>
            )}
            
            <div className="flex items-center gap-2">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.username}
                  className="w-8 h-8 rounded-full border border-border"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
                  {user ? getInitials(user.username) : '?'}
                </div>
              )}
              <span className="hidden sm:inline text-sm font-medium text-text-secondary">
                {user?.username}
              </span>
            </div>
            
            <button
              onClick={logout}
              className="p-2 text-text-secondary hover:text-game-dropped transition-colors"
              title="退出登录"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
