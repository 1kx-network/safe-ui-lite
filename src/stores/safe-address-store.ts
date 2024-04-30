import { create } from 'zustand';

type Store = {
  safeAddress: string | null;
  balanceAccount: string;
  safeAccountOwners: string[];
  needConfirmOwner: number;
  contractNonce: number | string | null;
  contractVersion: string | null;
  isLoading: boolean;
  accountList: string[] | [];

  setIsLoading: (payload: boolean) => void;
  setSafeAddress: (payload: string | null) => void;
  setBalanceAccount: (payload: string) => void;
  setClearActiveSafeStore: () => void;
  setSafeAccountOwners: (payload: string[]) => void;

  setNeedConfirmOwner: (payload: number) => void;
  setContractNonce: (payload: number | string) => void;
  setContractVersion: (payload: string) => void;

  setAccountList: (payload: string[] | []) => void;
};

const defaultData = {
  safeAddress: null,
  balanceAccount: '0',
  safeAccountOwners: [],
  needConfirmOwner: 0,
  contractNonce: null,
  contractVersion: null,
  isLoading: false,
  accountList: [],
};

const useActiveSafeAddress = create<Store>(set => ({
  ...defaultData,

  setSafeAddress: (payload: string | null) => set(state => ({ ...state, safeAddress: payload })),

  setBalanceAccount: (payload: string) => set(state => ({ ...state, balanceAccount: payload })),

  setSafeAccountOwners: (payload: string[]) =>
    set(state => ({ ...state, safeAccountOwners: payload })),

  setNeedConfirmOwner: (payload: number) => set(state => ({ ...state, needConfirmOwner: payload })),

  setContractNonce: (payload: number | string) =>
    set(state => ({ ...state, contractNonce: payload })),

  setContractVersion: (payload: string) => set(state => ({ ...state, contractVersion: payload })),

  setIsLoading: (payload: boolean) => set(state => ({ ...state, isLoading: payload })),

  setAccountList: (payload: string[] | []) => set(state => ({ ...state, accountList: payload })),

  setClearActiveSafeStore: () => {
    localStorage.removeItem('safeAddress');
    return set(defaultData);
  },
}));

export default useActiveSafeAddress;
