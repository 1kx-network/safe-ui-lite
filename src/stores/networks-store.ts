import { create } from 'zustand';

import { IOptionNetwork, optionsNetwork } from '@/constants/networks';
import { getNetworksDB } from '@/db/get-info';
import { formatterIcon } from '@/utils/icon-formatter';

type Store = {
  networks: null | IOptionNetwork[];
  setNetwork: (payload: null | IOptionNetwork) => void;
  setNetworksArray: (payload: null | IOptionNetwork[]) => void;
  updateNetwork: (payload: IOptionNetwork) => void;
  loadNetworks: () => void;
};

const useNetworkStore = create<Store>(set => ({
  networks: null,

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
        network =>
          !state.networks?.some(existingNetwork => existingNetwork.chainId === network.chainId)
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

  loadNetworks: () => {
    (async () => {
      const networksDB = await getNetworksDB();

      const updateNetwork = networksDB.map(elem => ({
        ...elem,
        label: elem.name,
        value: elem.name,
        rpc: elem.rpcUrl,
        icon: () => formatterIcon(elem.chainId ?? 0),
      }));

      const updatedArray = optionsNetwork.map(
        option => updateNetwork.find(network => network.chainId === option.chainId) || option
      );

      const networkArray = [
        ...updatedArray,
        ...updateNetwork.filter(network => !updatedArray.some(n => n.chainId === network.chainId)),
      ];

      set({ networks: networkArray });
    })();
  },
}));

useNetworkStore.getState().loadNetworks();

export default useNetworkStore;
