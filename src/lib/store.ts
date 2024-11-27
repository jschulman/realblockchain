import { create } from 'zustand';
import { AppState, MethodologyResponse } from '@/types';

export const useStore = create<AppState>((set) => ({
    methodology: null,
    isLoading: false,
    error: null,
    setMethodology: (methodology: MethodologyResponse) => set({ methodology }),
    setLoading: (isLoading: boolean) => set({ isLoading }),
    setError: (error: string | null) => set({ error }),
    reset: () => set({ methodology: null, isLoading: false, error: null }),
})); 