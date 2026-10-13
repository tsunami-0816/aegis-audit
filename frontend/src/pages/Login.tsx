import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Eye, EyeOff, LogIn, User, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotUsername, setForgotUsername] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ username, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');

    if (!forgotUsername) {
      setForgotError('请输入用户名');
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('两次密码不一致');
      return;
    }

    if (forgotNewPassword.length < 6) {
      setForgotError('密码长度至少6位');
      return;
    }

    setForgotLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: forgotUsername,
          newPassword: forgotNewPassword,
        }),
      });

      const result = await response.json();

      if (result.code === 200) {
        alert('密码重置成功，请使用新密码登录');
        setShowForgotModal(false);
        setForgotUsername('');
        setForgotNewPassword('');
        setForgotConfirmPassword('');
      } else {
        setForgotError(result.message || '重置失败');
      }
    } catch (err) {
      setForgotError('网络错误，重置失败');
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotError('');
    setForgotUsername('');
    setForgotNewPassword('');
    setForgotConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 mb-4 shadow-lg">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">AegisAudit</h1>
          <p className="text-gray-500 mt-2">登录您的账户</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="用户名"
              icon={<User className="w-5 h-5" />}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              error={error && !username ? '请输入用户名' : undefined}
            />
            
            <Input
              label="密码"
              icon={<Lock className="w-5 h-5" />}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              error={error && !password ? '请输入密码' : undefined}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span>记住我</span>
              </label>
              <button type="button" className="text-sm text-blue-600 hover:text-blue-700 font-medium" onClick={() => setShowForgotModal(true)}>
                忘记密码？
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 rounded-lg p-3">
                <Lock className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  登录中...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  登录
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              还没有账户？{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                立即注册
              </Link>
            </p>
          </div>
        </div>
      </div>

      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">重置密码</h2>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={closeForgotModal}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleForgotSubmit} className="p-6 space-y-4">
              <Input
                label="用户名"
                icon={<User className="w-5 h-5" />}
                value={forgotUsername}
                onChange={(e) => setForgotUsername(e.target.value)}
                placeholder="请输入用户名"
              />
              <Input
                label="新密码"
                icon={<Lock className="w-5 h-5" />}
                type="password"
                value={forgotNewPassword}
                onChange={(e) => setForgotNewPassword(e.target.value)}
                placeholder="请输入新密码（至少6位）"
              />
              <Input
                label="确认密码"
                icon={<Lock className="w-5 h-5" />}
                type="password"
                value={forgotConfirmPassword}
                onChange={(e) => setForgotConfirmPassword(e.target.value)}
                placeholder="请再次输入密码"
              />
              {forgotError && (
                <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 rounded-lg p-3">
                  <Lock className="w-4 h-4" />
                  <span>{forgotError}</span>
                </div>
              )}
              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={forgotLoading}>
                {forgotLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    重置中...
                  </span>
                ) : (
                  '重置密码'
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
