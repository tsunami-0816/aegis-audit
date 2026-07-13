import { useEffect, useState } from 'react';
import { Card } from '@/components/common/Card';
import { Loading } from '@/components/common/Loading';
import { TrendingUp, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { getDashboardStats } from '@/services/dashboard';
import { getContentList } from '@/services/content';
import type { DashboardStats, ContentDetailVO, WorkorderVO } from '@/types';
import { getStatusText, getStatusColor, getRiskLevelText, getRiskLevelColor, formatDate } from '@/utils';

const statCards = [
  { label: '今日提交', key: 'todaySubmit', icon: FileText, color: 'from-blue-500 to-blue-600' },
  { label: '待审核', key: 'pendingCount', icon: Clock, color: 'from-yellow-500 to-orange-500' },
  { label: '已通过', key: 'approvedCount', icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
  { label: '已拒绝', key: 'rejectedCount', icon: XCircle, color: 'from-red-500 to-rose-500' },
];

export const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [contents, setContents] = useState<ContentDetailVO[]>([]);
  const [workorders, setWorkorders] = useState<WorkorderVO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [statsResult, contentsResult] = await Promise.all([
          getDashboardStats(),
          getContentList(),
        ]);
        
        if (statsResult.code === 200) setStats(statsResult.data);
        if (contentsResult.code === 200) {
          const contentData = contentsResult.data as any;
          setContents(Array.isArray(contentData) ? contentData.slice(0, 5) : (contentData?.records || []).slice(0, 5));
        }

        if (user.role === 'ADMIN') {
          const { getWorkorderList } = await import('@/services/workorder');
          const ordersResult = await getWorkorderList({ status: 'ASSIGNED' });
          if (ordersResult.code === 200) {
            const orderData = ordersResult.data as any;
            setWorkorders(Array.isArray(orderData) ? orderData.slice(0, 5) : (orderData?.records || []).slice(0, 5));
          }
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
          <p className="text-gray-500 mt-1">欢迎回来，查看今日数据概览</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <TrendingUp className="w-4 h-4" />
          <span>数据更新于 {new Date().toLocaleString('zh-CN')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          const value = stats?.[card.key as keyof DashboardStats] ?? 0;
          return (
            <Card key={card.key} className="relative overflow-hidden">
              <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${card.color} opacity-10 rounded-full`} />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-bold text-gray-900">{value}</span>
                </div>
                <p className="text-gray-500 mt-2">{card.label}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">最近提交</h2>
          </div>
          <div className="space-y-3">
            {contents.length > 0 ? (
              contents.map((content) => (
                <div key={content.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{content.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{content.username} · {formatDate(content.createTime)}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(content.auditStatus)}`}>
                    {getStatusText(content.auditStatus)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">暂无提交记录</p>
            )}
          </div>
        </Card>

        {user?.role === 'ADMIN' && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">待审核工单</h2>
            </div>
            <div className="space-y-3">
              {workorders.length > 0 ? (
                workorders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{order.content}</p>
                        <p className="text-xs text-gray-500 mt-1">{order.username} · {formatDate(order.createTime)}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(order.riskLevel)}`}>
                        {getRiskLevelText(order.riskLevel)}
                      </span>
                    </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">暂无待审核工单</p>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
