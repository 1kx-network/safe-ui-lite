import Safe from '@safe-global/protocol-kit';
import { SafeTransaction } from '@safe-global/safe-core-sdk-types';
import { create } from 'zustand';

type Store = {
  safeSdk: null | Safe;
  safeTransaction: null | SafeTransaction;
  saveSdk: (payload: Safe | null) => void;
  setSafeTransaction: (payload: SafeTransaction) => void;
};

const useSafeStore = create<Store>()(set => ({
  safeSdk: null,
  safeTransaction: null,
  saveSdk: (payload: Safe | null) => set(() => ({ safeSdk: payload })),
  setSafeTransaction: (payload: SafeTransaction) => set(() => ({ safeTransaction: payload })),
}));

export default useSafeStore;
