import { create } from 'zustand';

import { ITransaction } from '@/db';

type Store = {
  transactions: null | ITransaction[];
  transactionsFilter: null | ITransaction[];
  owners: string[] | null;

  setTransactions: (payload: null | ITransaction[]) => void;
  setTransactionsFilter: (payload: null | ITransaction[]) => void;
  setOwners: (payload: null | string[]) => void;
};

const useTransactionsStore = create<Store>(set => ({
  transactions: null,
  transactionsFilter: null,
  owners: null,

  setOwners: (payload: null | string[]) => set(state => ({ ...state, owners: payload })),
  setTransactions: (payload: null | ITransaction[]) =>
    set(state => ({ ...state, transactions: payload })),
  setTransactionsFilter: (payload: null | ITransaction[]) =>
    set(state => ({ ...state, transactionsFilter: payload })),
}));

export default useTransactionsStore;
