export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'ASSIGNED':
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'PROCESSING':
      return 'bg-blue-100 text-blue-800';
    case 'COMPLETED':
    case 'PASSED':
      return 'bg-green-100 text-green-800';
    case 'REJECTED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'ASSIGNED':
    case 'PENDING':
      return '待审核';
    case 'PROCESSING':
      return '审核中';
    case 'COMPLETED':
    case 'PASSED':
      return '已通过';
    case 'REJECTED':
      return '已拒绝';
    default:
      return status;
  }
};

export const getRiskLevelColor = (level: string): string => {
  switch (level) {
    case 'LOW':
      return 'bg-green-100 text-green-800';
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800';
    case 'HIGH':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getRiskLevelText = (level: string): string => {
  switch (level) {
    case 'LOW':
      return '低风险';
    case 'MEDIUM':
      return '中风险';
    case 'HIGH':
      return '高风险';
    default:
      return level;
  }
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};
