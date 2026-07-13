import api from './api';
import type { SubmitContentDTO, ContentDetailVO, Result } from '@/types';

export const submitContent = async (dto: SubmitContentDTO): Promise<Result<ContentDetailVO>> => {
  return api.post('/content/submit', dto);
};

export const getContentList = async (): Promise<Result<ContentDetailVO[]>> => {
  return api.get('/content/list');
};

export const getContentDetail = async (id: string): Promise<Result<ContentDetailVO>> => {
  return api.get(`/content/${id}`);
};
