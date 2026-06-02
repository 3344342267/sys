import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { api } from '../services/api';
import { BookOpen, Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (password.length < 6) {
      setError('密码至少需要6个字符');
      return;
    }

    setLoading(true);

    try {
      const response = await api.auth.register(email, password, nickname);
      if (response.success) {
        setAuth(response.data.user, response.data.token);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1b2e] via-[#2d2a4a] to-[#1a1b2e] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-[#d4af37] mb-2">梦织机</h1>
          <p className="text-[#8b8997]">Novelist Studio</p>
        </div>

        <div className="bg-[#2d2a4a]/50 backdrop-blur-sm rounded-lg p-8 shadow-xl border border-[#3d3a5a]">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-[#d4af37]" />
            <h2 className="text-2xl font-semibold text-[#e8e6e3]">注册</h2>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-[#8b8997] mb-2">昵称</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b8997]" />
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                  className="w-full bg-[#1a1b2e] border border-[#3d3a5a] rounded-lg pl-10 pr-4 py-2.5 text-[#e8e6e3] focus:outline-none focus:border-[#d4af37] transition-colors"
                  placeholder="你的昵称"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#8b8997] mb-2">邮箱</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b8997]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#1a1b2e] border border-[#3d3a5a] rounded-lg pl-10 pr-4 py-2.5 text-[#e8e6e3] focus:outline-none focus:border-[#d4af37] transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#8b8997] mb-2">密码</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b8997]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#1a1b2e] border border-[#3d3a5a] rounded-lg pl-10 pr-4 py-2.5 text-[#e8e6e3] focus:outline-none focus:border-[#d4af37] transition-colors"
                  placeholder="至少6个字符"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#8b8997] mb-2">确认密码</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b8997]" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-[#1a1b2e] border border-[#3d3a5a] rounded-lg pl-10 pr-4 py-2.5 text-[#e8e6e3] focus:outline-none focus:border-[#d4af37] transition-colors"
                  placeholder="再次输入密码"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#d4af37] hover:bg-[#c49f32] text-[#1a1b2e] font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="animate-spin">⟳</span>
              ) : (
                <>
                  注册
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#8b8997] text-sm">
              已有账号？{' '}
              <Link to="/login" className="text-[#d4af37] hover:underline">
                登录
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
