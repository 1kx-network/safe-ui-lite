import Safe from '@safe-global/protocol-kit';
import type { SafeTransaction, SafeMessage } from '@safe-global/safe-core-sdk-types';
import { create } from 'zustand';

type Store = {
  safeSdk: null | Safe;
  safeTransaction: null | SafeTransaction;
  safeMessage: null | SafeMessage;
  saveSdk: (payload: Safe | null) => void;
  setSafeTransaction: (payload: SafeTransaction | null) => void;
  setSafeMessage: (payload: SafeMessage | null) => void;
};

const useSafeStore = create<Store>()(set => ({
  safeSdk: null,
  safeTransaction: null,
  safeMessage: null,
  saveSdk: (payload: Safe | null) => set(() => ({ safeSdk: payload })),
  setSafeTransaction: (payload: SafeTransaction | null) =>
    set(() => ({ safeTransaction: payload })),
  setSafeMessage: (payload: SafeMessage | null) => set(() => ({ safeMessage: payload })),
}));

export default useSafeStore;
