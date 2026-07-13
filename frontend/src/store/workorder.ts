import { create } from 'zustand';
import type { WorkorderVO, ReviewDTO, WorkorderQueryDTO } from '@/types';
import { getWorkorderList as listApi, getWorkorderDetail as detailApi, reviewWorkorder as reviewApi } from '@/services/workorder';

interface WorkorderState {
  workorders: WorkorderVO[];
  currentWorkorder: WorkorderVO | null;
  loading: boolean;
  list: (params?: WorkorderQueryDTO) => Promise<void>;
  detail: (id: string) => Promise<void>;
  review: (id: string, dto: ReviewDTO) => Promise<void>;
}

export const useWorkorderStore = create<WorkorderState>((set) => ({
  workorders: [],
  currentWorkorder: null,
  loading: false,

  list: async (params) => {
    set({ loading: true });
    try {
      const result = await listApi(params);
      if (result.code === 200) {
        const data = result.data as any;
        const orders = data?.records || data || [];
        const ordersWithStringIds = orders.map((order: any) => ({
          ...order,
          id: String(order.id),
          contentId: String(order.contentId),
          handlerId: order.handlerId != null ? String(order.handlerId) : null,
        }));
        set({ workorders: ordersWithStringIds });
      }
    } finally {
      set({ loading: false });
    }
  },

  detail: async (id) => {
    set({ loading: true, currentWorkorder: null });
    try {
      const result = await detailApi(id);
      if (result.code === 200) {
        const workorder = {
          ...result.data,
          id: String(result.data.id),
          contentId: String(result.data.contentId),
          handlerId: result.data.handlerId != null ? String(result.data.handlerId) : null,
        };
        set({ currentWorkorder: workorder });
      } else {
        set({ currentWorkorder: null });
        alert(result.message || '获取工单详情失败');
      }
    } catch (err) {
      set({ currentWorkorder: null });
      alert('网络错误，无法获取工单详情');
    } finally {
      set({ loading: false });
    }
  },

  review: async (id, dto) => {
    set({ loading: true });
    try {
      const result = await reviewApi(id, dto);
      if (result.code !== 200) {
        throw new Error(result.message);
      }
    } finally {
      set({ loading: false });
    }
  },
}));
