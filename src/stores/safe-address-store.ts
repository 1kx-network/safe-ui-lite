import { create } from 'zustand';

type Store = {
  safeAddress: string | null;
  balanceAccount: string | null;
  setSafeAddress: (payload: string | null) => void;
  setBalanceAccount: (payload: string | null) => void;
  setClearActiveSafeStore: () => void;
};

const useActiveSafeAddress = create<Store>(set => ({
  safeAddress: null,
  balanceAccount: '0',

  setSafeAddress: (payload: string | null) => set(state => ({ ...state, safeAddress: payload })),
  setBalanceAccount: (payload: string | null) =>
    set(state => ({ ...state, balanceAccount: payload })),

  setClearActiveSafeStore: () => set({ safeAddress: null, balanceAccount: '0' }),
}));

export default useActiveSafeAddress;
