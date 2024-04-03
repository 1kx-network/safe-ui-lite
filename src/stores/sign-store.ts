import { create } from 'zustand';

type IStatus = 'loading' | 'success' | 'signed' | 'error' | '' | 'Successfully deployed';

type Store = {
  threshold: number;
  status: IStatus;
  setStatus: (payload: IStatus) => void;
  setThreshold: (payload: number) => void;
};

const useSignStore = create<Store>()(set => ({
  threshold: 0,
  status: 'loading',

  setStatus: (payload: IStatus) => set(state => ({ ...state, status: payload })),
  setThreshold: (payload: number) => set(state => ({ ...state, threshold: payload })),
}));

export default useSignStore;
