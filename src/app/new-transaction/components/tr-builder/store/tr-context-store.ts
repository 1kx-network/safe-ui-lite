'use client';

import { create } from 'zustand';

import { customToasty } from '@/components';
import { ProposedTransaction } from '../typings/models';
import useSafeStore from '@/stores/safe-store';

type Store = {
  transactions: ProposedTransaction[];

  resetTransactions: (transactions: ProposedTransaction[]) => void;
  addTransaction: (newTransaction: ProposedTransaction) => void;
  replaceTransaction: (newTransaction: ProposedTransaction, index: number) => void;
  removeTransaction: (index: number) => void;
  removeAllTransactions: () => void;
  reorderTransactions: (sourceIndex: number, destinationIndex: number) => void;
  submitTransactions: () => void;
};

const useTransactionStore = create<Store>((set, get) => ({
  transactions: [],
  safeTransactions: null,

  resetTransactions: transactions => set({ transactions: [...transactions] }),
  addTransaction: newTransaction =>
    set(state => ({ transactions: [...state.transactions, newTransaction] })),
  replaceTransaction: (newTransaction, index) =>
    set(state => {
      const transactions = [...state.transactions];
      transactions[index] = newTransaction;
      return { transactions };
    }),
  removeTransaction: index =>
    set(state => {
      const transactions = [...state.transactions];
      transactions.splice(index, 1);
      return { transactions };
    }),
  removeAllTransactions: () => set({ transactions: [] }),
  reorderTransactions: (sourceIndex, destinationIndex) =>
    set(state => {
      const transactions = [...state.transactions];
      const [movedTransaction] = transactions.splice(sourceIndex, 1);
      transactions.splice(destinationIndex, 0, movedTransaction);
      return { transactions };
    }),

  submitTransactions: async () => {
    const { safeSdk } = useSafeStore();
    if (!safeSdk) return;
    const { transactions } = get();

    const rawTrx = transactions.map(transaction => transaction.raw);
    const trx2 = await safeSdk.createTransactionBatch(rawTrx);

    set(state => ({ ...state, safeTransactions: trx2 }));
    customToasty('Submit transactions confirmed');
  },
}));

export default useTransactionStore;
