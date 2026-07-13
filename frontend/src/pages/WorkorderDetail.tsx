import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkorderStore } from '@/store/workorder';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { ArrowLeft, CheckCircle, XCircle, Clock, FileText, AlertTriangle, AlertCircle } from 'lucide-react';
import type { ReviewDTO } from '@/types';
import { getStatusText, getStatusColor, getRiskLevelText, getRiskLevelColor, formatDate } from '@/utils';

export const WorkorderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reviewReason, setReviewReason] = useState('');

  const { currentWorkorder, detail, review, loading } = useWorkorderStore();

  useEffect(() => {
    if (id) {
      detail(id);
    }
  }, [id, detail]);

  const handleReview = async (status: 'PASSED' | 'REJECTED') => {
    if (!id) return;
    
    try {
      await review(id, { auditStatus: status, remark: reviewReason });
      navigate('/workorders');
    } catch (err) {
      alert(err instanceof Error ? err.message : '审核失败');
    }
  };

  if (loading || !currentWorkorder) {
    return <Loading />;
  }

  const workorder = currentWorkorder;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="secondary" size="sm" onClick={() => navigate('/workorders')}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          返回列表
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">工单详情</h1>
          <p className="text-gray-500">工单编号: {workorder.id}</p>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              待审核内容
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-900 whitespace-pre-wrap">{workorder.content}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">作者</span>
              <span className="text-sm text-gray-600">{workorder.username}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">风险等级</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(workorder.riskLevel)}`}>
                {getRiskLevelText(workorder.riskLevel)}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">当前状态</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(workorder.contentAuditStatus || workorder.status)}`}>
                {getStatusText(workorder.contentAuditStatus || workorder.status)}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">创建时间</span>
              <span className="text-sm text-gray-600">{formatDate(workorder.createTime)}</span>
            </div>

            {workorder.updateTime && workorder.status === 'COMPLETED' && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">审核时间</span>
                <span className="text-sm text-gray-600">{formatDate(workorder.updateTime)}</span>
              </div>
            )}

            {workorder.handlerName && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">处理人</span>
                <span className="text-sm text-gray-600">{workorder.handlerName}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            AI审核结果
          </h3>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-gray-700">{workorder.aiResult}</p>
          </div>
        </div>

        {workorder.remark && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              备注
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">{workorder.remark}</p>
            </div>
          </div>
        )}
      </Card>

      {workorder.status === 'ASSIGNED' && (
        <Card>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">审核操作</h3>
          <div className="space-y-4">
            <textarea
              placeholder="请输入审核理由（选填）"
              value={reviewReason}
              onChange={(e) => setReviewReason(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
            />
            <div className="flex gap-4">
              <Button
                variant="success"
                size="lg"
                className="flex-1"
                onClick={() => handleReview('PASSED')}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                通过审核
              </Button>
              <Button
                variant="danger"
                size="lg"
                className="flex-1"
                onClick={() => handleReview('REJECTED')}
              >
                <XCircle className="w-5 h-5 mr-2" />
                拒绝审核
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
