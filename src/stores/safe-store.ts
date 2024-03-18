import Safe from '@safe-global/protocol-kit';
import { create } from 'zustand';

type Store = {
  safeSdk: null | Safe;
  saveSdk: (payload: Safe) => void;
};

const useSafeStore = create<Store>()(set => ({
  safeSdk: null,
  saveSdk: (payload: Safe) => set(() => ({ safeSdk: payload })),
}));

export default useSafeStore;
