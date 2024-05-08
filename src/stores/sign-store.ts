import { create } from 'zustand';

type IStatus = 'loading' | 'success' | 'signed' | 'error' | '';

type Store = {
  threshold: number;
  owners: string[] | null;
  status: IStatus;
  setStatus: (payload: IStatus) => void;
  setThreshold: (payload: number) => void;
  setOwners: (payload: string[]) => void;
};

const useSignStore = create<Store>()(set => ({
  threshold: 0,
  owners: null,
  status: '',

  setStatus: (payload: IStatus) => set(state => ({ ...state, status: payload })),
  setThreshold: (payload: number) => set(state => ({ ...state, threshold: payload })),

  setOwners: (payload: string[]) => set(state => ({ ...state, owners: payload })),
}));

export default useSignStore;
