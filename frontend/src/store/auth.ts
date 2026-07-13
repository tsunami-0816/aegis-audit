import { create } from 'zustand';
import type { LoginDTO, LoginVO, RegisterDTO } from '@/types';
import { login as loginApi, register as registerApi } from '@/services/auth';

interface AuthState {
  token: string | null;
  user: LoginVO | null;
  isAuthenticated: boolean;
  login: (dto: LoginDTO) => Promise<void>;
  register: (dto: RegisterDTO) => Promise<void>;
  logout: () => void;
  init: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  init: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      const user = JSON.parse(userStr) as LoginVO;
      set({ token, user, isAuthenticated: true });
    }
  },

  login: async (dto) => {
    try {
      const result = await loginApi(dto);
      if (result.code === 200) {
        const { token, id, username, role } = result.data;
        const user = { token, id, username, role } as LoginVO;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ id, username, role }));
        set({ token, user, isAuthenticated: true });
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.data?.message) {
        throw new Error(error.data.message);
      } else {
        throw new Error('登录失败');
      }
    }
  },

  register: async (dto) => {
    const result = await registerApi(dto);
    if (result.code !== 200) {
      throw new Error(result.message);
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
