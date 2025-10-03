import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CFRSResume, ValidationError, Theme } from '../types/cfrs';

interface ResumeState {
  resume: CFRSResume | null;
  setResume: (resume: CFRSResume | null) => void;
  updateResume: (updates: Partial<CFRSResume>) => void;
  clearResume: () => void;
}

interface UIState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  validationErrors: ValidationError[];
  setValidationErrors: (errors: ValidationError[]) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

interface ImportState {
  importFormat: string | null;
  setImportFormat: (format: string | null) => void;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      resume: null,
      setResume: (resume) => set({ resume }),
      updateResume: (updates) =>
        set((state) => ({
          resume: state.resume ? { ...state.resume, ...updates } : null,
        })),
      clearResume: () => set({ resume: null }),
    }),
    {
      name: 'cfrs-resume-storage',
      partialize: (state) => ({ resume: state.resume }),
    }
  )
);

export const useUIStore = create<UIState>()((set) => ({
  theme: 'classic',
  setTheme: (theme) => set({ theme }),
  validationErrors: [],
  setValidationErrors: (errors) => set({ validationErrors: errors }),
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));

export const useImportStore = create<ImportState>()((set) => ({
  importFormat: null,
  setImportFormat: (format) => set({ importFormat: format }),
}));
