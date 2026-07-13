import api from './api';
import type { DashboardStats, Result } from '@/types';

export const getDashboardStats = async (): Promise<Result<DashboardStats>> => {
  return api.get('/dashboard/stats');
};
