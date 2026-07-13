import api from './api';
import type { LoginDTO, LoginVO, RegisterDTO, Result } from '@/types';

export const login = async (dto: LoginDTO): Promise<Result<LoginVO>> => {
  return api.post('/auth/login', dto);
};

export const register = async (dto: RegisterDTO): Promise<Result<void>> => {
  return api.post('/auth/register', dto);
};

export const updateProfile = async (dto: { username?: string; password?: string }): Promise<Result<void>> => {
  return api.put('/auth/profile', dto);
};
