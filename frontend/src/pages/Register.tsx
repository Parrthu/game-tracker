import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gamepad2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    steam_id: '',
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await register(formData);
      toast.success('注册成功');
      navigate('/');
    } catch (error) {
      // Error is handled in store
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
          <p className="text-text-secondary">创建账号，开始管理你的游戏</p>
        </div>
        
        {/* Register Form */}
        <div className="glass-panel p-8">
          <h2 className="text-xl font-semibold text-center mb-6">创建账号</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                用户名 *
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="input-field"
                placeholder="3-50个字符"
                required
                minLength={3}
                maxLength={50}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                邮箱 *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                密码 *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field pr-10"
                  placeholder="至少6个字符"
                  required
                  minLength={6}
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
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Steam ID <span className="text-text-muted">(可选)</span>
              </label>
              <input
                type="text"
                value={formData.steam_id}
                onChange={(e) => setFormData({ ...formData, steam_id: e.target.value })}
                className="input-field"
                placeholder="你的Steam ID"
              />
              <p className="text-xs text-text-muted mt-1">
                在 <a href="https://steamid.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">steamid.io</a> 查找你的Steam ID
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '注册中...' : '创建账号'}
            </button>
          </form>
          
          {/* Login Link */}
          <p className="text-center text-text-secondary mt-6">
            已有账号？{' '}
            <Link to="/login" className="text-primary hover:text-primary-dark font-medium">
              立即登录
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
