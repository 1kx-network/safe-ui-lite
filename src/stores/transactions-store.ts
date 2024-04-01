import { create } from 'zustand';

const transactions = [
  {
    id: 1,
    date: '2024-04-01',
    amount: '44',
    token: 'ETH',
    address: '0xssss123ss123ss123ss123ss123ss123',
    theshold: 2,
    owners: ['ccc', 'sdf'],
  },
  {
    id: 2,
    date: '2024-03-25',
    amount: '222',
    token: 'USDT',
    address: '0xssss123ss123ss123ss123ss123ss123',
    theshold: 2,
    owners: ['sdf', 'sdf', 'sdf', 'sdf'],
  },
  {
    id: 3,
    date: '2024-03-29',
    amount: '144',
    token: 'ETH',
    address: '0xssss123ss123ss123ss123ss123ss123',
    theshold: 2,
    owners: ['sdf', 'sdf'],
  },
  {
    id: 4,
    date: '2024-03-02',
    amount: '2',
    token: 'USDC',
    address: '0xssss123ss123ss123ss123ss123ss123',
    theshold: 2,
    owners: ['sdf', 'sdf', 'sdf'],
  },
  {
    id: 5,
    date: '2024-03-02',
    amount: '43',
    token: 'USDT',
    address: '0xssss123ss123ss123ss123ss123ss123',
    theshold: 2,
    owners: ['sdf', 'sdf'],
  },
];

interface ITransaction {
  id: number;
  date: string;
  amount: string;
  token: string;
  address: string;
  theshold: number;
  owners: string[];
}

type Store = {
  transactions: null | ITransaction[];
  transactionsFilter: null | ITransaction[];

  setTransactions: (payload: null | ITransaction[]) => void;
  setTransactionsFilter: (payload: null | ITransaction[]) => void;
};

const useTransactionsStore = create<Store>(set => ({
  transactions: transactions,
  transactionsFilter: transactions,

  setTransactions: (payload: null | ITransaction[]) => set(() => ({ transactions: payload })),
  setTransactionsFilter: (payload: null | ITransaction[]) =>
    set(() => ({ transactionsFilter: payload })),
}));

export default useTransactionsStore;
