import { create } from 'zustand';

type Store = {
  safeAddress: string | null;
  balanceAccount: string;
  safeAccountOwners: string[]; // owners
  needConfirmOwner: number;
  contractNonce: number | null;
  contractVersion: string | null;
  isLoading: boolean;

  setIsLoading: (payload: boolean) => void;
  setSafeAddress: (payload: string | null) => void;
  setBalanceAccount: (payload: string) => void;
  setClearActiveSafeStore: () => void;
  setSafeAccountOwners: (payload: string[]) => void; // setOwners

  setNeedConfirmOwner: (payload: number) => void;
  setContractNonce: (payload: number) => void;
  setContractVersion: (payload: string) => void;
};

export const keyFunc = {
  setSafeAddress: 'setSafeAddress',
};

const useActiveSafeAddress = create<Store>(set => ({
  safeAddress: null,
  balanceAccount: '0',
  safeAccountOwners: [],
  needConfirmOwner: 0,
  contractNonce: null,
  contractVersion: null,
  isLoading: false,

  setSafeAddress: (payload: string | null) => set(state => ({ ...state, safeAddress: payload })),
  setBalanceAccount: (payload: string) => set(state => ({ ...state, balanceAccount: payload })),

  setSafeAccountOwners: (payload: string[]) => {
    set(state => ({
      ...state,
      safeAccountOwners: Array.from(new Set([...state.safeAccountOwners, ...payload])),
    }));
  },

  setNeedConfirmOwner: (payload: number) => set(state => ({ ...state, needConfirmOwner: payload })),
  setContractNonce: (payload: number) => set(state => ({ ...state, contractNonce: payload })),
  setContractVersion: (payload: string) => set(state => ({ ...state, contractVersion: payload })),
  setIsLoading: (payload: boolean) => set(state => ({ ...state, isLoading: payload })),

  setClearActiveSafeStore: () => set({}),
}));

export default useActiveSafeAddress;
