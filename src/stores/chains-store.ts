import { ChainInfo } from '@safe-global/safe-gateway-typescript-sdk';
import { create } from 'zustand';

type Store = {
  chains: null | ChainInfo[];
  setChains: (payload: ChainInfo[] | null) => void;
};

const useChainStore = create<Store>()(set => ({
  chains: [],
  setChains: (payload: ChainInfo[] | null) => set(() => ({ chains: payload })),
}));

export default useChainStore;
