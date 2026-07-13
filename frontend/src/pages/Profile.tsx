import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { useContentStore } from '@/store/content';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Loading } from '@/components/common/Loading';
import { User, Calendar, Shield, FileText, Settings, Save, X } from 'lucide-react';
import type { ContentDetailVO } from '@/types';
import { getStatusText, getStatusColor, getRiskLevelText, getRiskLevelColor, formatDate } from '@/utils';
import { updateProfile } from '@/services/auth';

export const Profile = () => {
  const { user } = useAuthStore();
  const { contents, list, loading } = useContentStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    list();
  }, [list]);

  useEffect(() => {
    setEditForm({
      username: user?.username || '',
      password: '',
      confirmPassword: '',
    });
  }, [user]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editForm.password && editForm.password !== editForm.confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    try {
      const dto: { username?: string; password?: string } = {};
      if (editForm.username && editForm.username !== user?.username) {
        dto.username = editForm.username;
      }
      if (editForm.password) {
        dto.password = editForm.password;
      }
      if (Object.keys(dto).length > 0) {
        const result = await updateProfile(dto);
        if (result.code === 200) {
          alert('资料更新成功');
          setIsEditing(false);
        } else {
          alert(result.message || '更新失败');
        }
      } else {
        alert('请输入要修改的内容');
      }
    } catch (err) {
      alert('网络错误，更新失败');
    }
  };

  if (loading) {
    return <Loading />;
  }

  const userStats = {
    totalSubmit: contents.length,
    approved: contents.filter((c) => c.auditStatus === 'PASSED').length,
    rejected: contents.filter((c) => c.auditStatus === 'REJECTED').length,
    pending: contents.filter((c) => c.auditStatus === 'PENDING' || c.auditStatus === 'PROCESSING').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">个人中心</h1>
          <p className="text-gray-500">管理您的账户信息和审核历史</p>
        </div>
      </div>

      {isEditing ? (
        <Card>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">编辑资料</h2>
              <Button variant="secondary" size="sm" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Input
              label="用户名"
              value={editForm.username}
              onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
              disabled
            />
            <Input
              label="新密码"
              type="password"
              placeholder="不修改请留空"
              value={editForm.password}
              onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
            />
            <Input
              label="确认密码"
              type="password"
              placeholder="不修改请留空"
              value={editForm.confirmPassword}
              onChange={(e) => setEditForm({ ...editForm, confirmPassword: e.target.value })}
            />
            <Button type="submit" variant="primary" size="lg" className="w-full">
              <Save className="w-4 h-4 mr-2" />
              保存修改
            </Button>
          </form>
        </Card>
      ) : (
        <Card className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">{user?.username}</h2>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>{user?.role === 'ADMIN' ? '管理员' : '普通用户'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>注册于 2026-07-13</span>
              </div>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
            <Settings className="w-4 h-4 mr-1" />
            编辑资料
          </Button>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{userStats.totalSubmit}</p>
              <p className="text-sm text-gray-500">总提交</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">{userStats.approved}</p>
              <p className="text-sm text-gray-500">已通过</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
              <span className="text-lg">✓</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-yellow-600">{userStats.pending}</p>
              <p className="text-sm text-gray-500">待审核</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-600">
              <span className="text-lg">◯</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-red-600">{userStats.rejected}</p>
              <p className="text-sm text-gray-500">已拒绝</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
              <span className="text-lg">✗</span>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            审核历史
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-3">
            {contents.length > 0 ? (
              contents.map((content) => (
                <div key={content.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{content.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(content.createTime)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(content.riskLevel)}`}>
                      {getRiskLevelText(content.riskLevel)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(content.auditStatus)}`}>
                      {getStatusText(content.auditStatus)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">暂无审核记录</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
