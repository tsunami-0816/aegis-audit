import { useEffect, useState } from 'react';
import { useWorkorderStore } from '@/store/workorder';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { ClipboardList, Eye, Filter, Search, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { WorkorderVO } from '@/types';
import { getStatusText, getStatusColor, getRiskLevelText, getRiskLevelColor, formatDate } from '@/utils';

export const WorkorderList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');

  const { workorders, list, loading, review } = useWorkorderStore();
  const navigate = useNavigate();

  const handleReview = async (id: string, action: 'PASS' | 'REJECT') => {
    try {
      await review(id, { auditStatus: action === 'PASS' ? 'PASSED' : 'REJECTED' });
      alert(action === 'PASS' ? '审核通过' : '审核拒绝');
      list();
    } catch (err) {
      alert('审核失败');
    }
  };

  useEffect(() => {
    list({ status: statusFilter || undefined, riskLevel: riskFilter || undefined });
  }, [statusFilter, riskFilter, list]);

  const filteredOrders = workorders.filter((order) => {
    const matchesSearch = order.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    const matchesRisk = !riskFilter || order.riskLevel === riskFilter;
    return matchesSearch && matchesStatus && matchesRisk;
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center text-white">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">审核工单</h1>
            <p className="text-gray-500">管理和处理待审核的内容工单</p>
          </div>
        </div>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索内容..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              >
                <option value="">全部状态</option>
                <option value="ASSIGNED">待审核</option>
                <option value="COMPLETED">已完成</option>
              </select>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              >
                <option value="">全部风险</option>
                <option value="LOW">低风险</option>
                <option value="MEDIUM">中风险</option>
                <option value="HIGH">高风险</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">内容</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">风险等级</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">状态</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">AI结果</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">创建时间</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">操作</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">详情</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-900 truncate max-w-xs">{order.content}</p>
                      <p className="text-xs text-gray-500 mt-1">{order.username}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(order.riskLevel)}`}>
                        {getRiskLevelText(order.riskLevel)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.contentAuditStatus || order.status)}`}>
                        {getStatusText(order.contentAuditStatus || order.status)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-600 truncate max-w-xs">{order.aiResult}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-500">{formatDate(order.createTime)}</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {order.contentAuditStatus === 'PENDING' || order.contentAuditStatus === 'PROCESSING' ? (
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleReview(order.id, 'REJECT')}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleReview(order.id, 'PASS')}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">已完成</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/workorders/${order.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        详情
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    暂无工单记录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            共 <span className="font-medium text-gray-900">{filteredOrders.length}</span> 条记录
          </p>
        </div>
      </Card>
    </div>
  );
};
