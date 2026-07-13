import { useState } from 'react';
import { useContentStore } from '@/store/content';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Textarea } from '@/components/common/Textarea';
import { Input } from '@/components/common/Input';
import { FileText, Send, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import type { ContentDetailVO } from '@/types';
import { getStatusText, getRiskLevelText, getRiskLevelColor } from '@/utils';

export const ContentSubmit = () => {
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<'text' | 'article' | 'comment'>('text');
  const [result, setResult] = useState<ContentDetailVO | null>(null);
  const [error, setError] = useState('');

  const { submit, loading } = useContentStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!content.trim()) {
      setError('请输入内容');
      return;
    }

    try {
      const data = await submit({ content, contentType });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失败');
    }
  };

  const getResultIcon = () => {
    if (!result) return null;
    if (result.auditStatus === 'PASSED') return <CheckCircle className="w-8 h-8 text-green-500" />;
    if (result.auditStatus === 'REJECTED') return <AlertCircle className="w-8 h-8 text-red-500" />;
    return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">提交内容审核</h1>
          <p className="text-gray-500">输入需要审核的内容，AI将自动进行风险评估</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">内容类型</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value as 'text' | 'article' | 'comment')}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none bg-white"
            >
              <option value="text">文本</option>
              <option value="article">文章</option>
              <option value="comment">评论</option>
            </select>
          </div>

          <Textarea
            label="内容"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="请输入需要审核的内容..."
            rows={8}
            error={error}
          />

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{content.length} 字符</span>
            <span>支持最大 5000 字符</span>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                AI审核中...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                提交审核
              </span>
            )}
          </Button>
        </form>
      </Card>

      {result && (
        <Card className="mt-6 animate-[fadeIn_0.3s_ease-out]">
          <div className="flex items-center gap-4 mb-4">
            {getResultIcon()}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">审核结果</h2>
              <p className="text-sm text-gray-500">{getStatusText(result.auditStatus)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">风险等级</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(result.riskLevel)}`}>
                {getRiskLevelText(result.riskLevel)}
              </span>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">审核结果：</span>
              <p className="text-sm text-gray-600 mt-1">{result.auditResult}</p>
            </div>

            {result.auditStatus === 'PENDING' && (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-700">
                  内容已提交人工审核，请耐心等待审核结果。
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
