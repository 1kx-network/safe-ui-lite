import { create } from 'zustand';

import { IOptionNetwork } from '@/constants/networks';

type Store = {
  networks: null | IOptionNetwork[];
  setNetwork: (payload: null | IOptionNetwork) => void;
  setNetworksArray: (payload: null | IOptionNetwork[]) => void;
  updateNetwork: (payload: IOptionNetwork) => void;
};

const useNetworkStore = create<Store>(set => ({
  networks: [],

  setNetwork: (payload: null | IOptionNetwork) => {
    if (!payload) return;
    set(state => {
      const isRpcExist = state.networks?.some(network => network.rpc === payload.rpc);
      if (isRpcExist) {
        return state;
      }

      return { networks: [...(state.networks || []), payload] };
    });
  },

  setNetworksArray: (payload: IOptionNetwork[] | null) => {
    set(state => {
      if (!payload) return state;

      const uniqueNetworks = payload.filter(
        network => !state.networks?.some(existingNetwork => existingNetwork.rpc === network.rpc)
      );

      return { networks: [...(state.networks || []), ...uniqueNetworks] };
    });
  },

  updateNetwork: (payload: IOptionNetwork) => {
    set(state => {
      const updatedNetworks = (state.networks || []).map(network => {
        if (network.chainId === payload.chainId) {
          return payload;
        }
        return network;
      });

      return { networks: updatedNetworks };
    });
  },
}));

export default useNetworkStore;
