import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gamepad2, Eye, EyeOff, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(formData);
      toast.success('登录成功');
      navigate('/');
    } catch (error) {
      // Error is handled in store
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await login({ username: 'demo', password: 'demo123' });
      toast.success('Demo账号登录成功');
      navigate('/');
    } catch (error) {
      toast.error('Demo登录失败');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-surface to-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Game Tracker</h1>
          <p className="text-text-secondary">管理你的游戏库，追踪游戏进度</p>
        </div>
        
        {/* Login Form */}
        <div className="glass-panel p-8">
          <h2 className="text-xl font-semibold text-center mb-6">欢迎回来</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                用户名
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="input-field"
                placeholder="输入用户名"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                密码
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field pr-10"
                  placeholder="输入密码"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '登录中...' : '登录'}
            </button>
          </form>
          
          {/* Demo Login */}
          <div className="mt-6 pt-6 border-t border-border">
            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-game-backlog/20 to-game-wishlist/20 hover:from-game-backlog/30 hover:to-game-wishlist/30 border border-game-backlog/30 text-game-backlog rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              使用 Demo 账号体验
            </button>
            <p className="text-center text-xs text-text-muted mt-2">
              账号: demo / 密码: demo123
            </p>
          </div>
          
          {/* Register Link */}
          <p className="text-center text-text-secondary mt-6">
            还没有账号？{' '}
            <Link to="/register" className="text-primary hover:text-primary-dark font-medium">
              立即注册
            </Link>
          </p>
        </div>
        
        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mt-8 text-center">
          <div className="p-4">
            <div className="text-2xl mb-2">🎮</div>
            <p className="text-xs text-text-secondary">同步Steam</p>
          </div>
          <div className="p-4">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-xs text-text-secondary">追踪进度</p>
          </div>
          <div className="p-4">
            <div className="text-2xl mb-2">🏆</div>
            <p className="text-xs text-text-secondary">成就统计</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
