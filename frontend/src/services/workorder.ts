import api from './api';
import type { WorkorderVO, ReviewDTO, WorkorderQueryDTO, Result } from '@/types';

export const getWorkorderList = async (params?: WorkorderQueryDTO): Promise<Result<WorkorderVO[]>> => {
  return api.get('/workorder/list', { params });
};

export const getWorkorderDetail = async (id: string): Promise<Result<WorkorderVO>> => {
  return api.get(`/workorder/${id}`);
};

export const reviewWorkorder = async (id: string, dto: ReviewDTO): Promise<Result<void>> => {
  return api.post(`/workorder/${id}/review`, dto);
};
