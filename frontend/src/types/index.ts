export interface Result<T> {
  code: number;
  message: string;
  data: T;
}

export interface LoginDTO {
  username: string;
  password: string;
}

export interface LoginVO {
  token: string;
  id: string;
  username: string;
  role: 'USER' | 'ADMIN';
}

export interface RegisterDTO {
  username: string;
  password: string;
  role?: 'USER' | 'ADMIN';
}

export interface SubmitContentDTO {
  content: string;
  contentType: 'text' | 'article' | 'comment';
}

export interface ContentDetailVO {
  id: string;
  userId: string;
  username: string;
  content: string;
  contentType: string;
  auditStatus: 'PENDING' | 'PROCESSING' | 'PASSED' | 'REJECTED';
  auditResult: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  summary: string;
  createTime: string;
  updateTime: string;
}

export interface WorkorderVO {
  id: string;
  contentId: string;
  content: string;
  username: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  aiResult: string;
  handlerId: string;
  handlerName: string;
  status: 'ASSIGNED' | 'COMPLETED';
  contentAuditStatus: 'PENDING' | 'PROCESSING' | 'PASSED' | 'REJECTED';
  remark: string;
  createTime: string;
  updateTime: string;
}

export interface ReviewDTO {
  auditStatus: 'PENDING' | 'PROCESSING' | 'PASSED' | 'REJECTED';
  auditResult?: string;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  summary?: string;
  remark?: string;
}

export interface WorkorderQueryDTO {
  status?: string;
  riskLevel?: string;
  page?: number;
  size?: number;
}

export interface DashboardStats {
  todaySubmit: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}
