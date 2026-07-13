import { create } from 'zustand';
import type { SubmitContentDTO, ContentDetailVO } from '@/types';
import { submitContent as submitApi, getContentList as listApi, getContentDetail as detailApi } from '@/services/content';

interface ContentState {
  contents: ContentDetailVO[];
  currentContent: ContentDetailVO | null;
  loading: boolean;
  submit: (dto: SubmitContentDTO) => Promise<ContentDetailVO>;
  list: () => Promise<void>;
  detail: (id: string) => Promise<void>;
}

export const useContentStore = create<ContentState>((set) => ({
  contents: [],
  currentContent: null,
  loading: false,

  submit: async (dto) => {
    set({ loading: true });
    try {
      const result = await submitApi(dto);
      if (result.code === 200) {
        return result.data;
      }
      throw new Error(result.message);
    } finally {
      set({ loading: false });
    }
  },

  list: async () => {
    set({ loading: true });
    try {
      const result = await listApi();
      if (result.code === 200) {
        set({ contents: result.data });
      }
    } finally {
      set({ loading: false });
    }
  },

  detail: async (id) => {
    set({ loading: true });
    try {
      const result = await detailApi(id);
      if (result.code === 200) {
        set({ currentContent: result.data });
      }
    } finally {
      set({ loading: false });
    }
  },
}));
