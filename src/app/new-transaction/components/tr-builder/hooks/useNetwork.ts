'use client';

import { createContext, useEffect, useState } from 'react';

import InterfaceRepository, { InterfaceRepo } from '../utils/InterfaceRepository';
import useNetworkStore from '@/stores/networks-store';
import useActiveSafeAddress from '@/stores/safe-address-store';

type NetworkContextProps = {
  chainId: string | number | undefined;
  interfaceRepo: InterfaceRepo | undefined;
  networkPrefix: string;
  nativeCurrencySymbol: string | undefined;
  getAddressFromDomain: (name: string) => Promise<string>;
};

export const NetworkContext = createContext<NetworkContextProps | null>(null);

const useNetwork = () => {
  const [interfaceRepo, setInterfaceRepo] = useState<InterfaceRepository | undefined>();
  const { chosenNetwork } = useNetworkStore();
  const { safeAddress } = useActiveSafeAddress();

  useEffect(() => {
    if (!chosenNetwork || !chosenNetwork.chainId) {
      return;
    }
    // Created class with functionals for work with ABI
    const interfaceRepo = new InterfaceRepository(chosenNetwork.chainId);
    setInterfaceRepo(interfaceRepo);
  }, [chosenNetwork]);

  const networkPrefix = chosenNetwork?.name || chosenNetwork?.label || '';

  const getAddressFromDomain = async (): Promise<string> => {
    if (!safeAddress) {
      throw Error('<-- Error get safe address -->');
    }
    return safeAddress;
  };

  return {
    chainId: chosenNetwork?.chainId,
    interfaceRepo,
    networkPrefix,
    nativeCurrencySymbol: chosenNetwork?.currency,
    getAddressFromDomain,
  };
};

export default useNetwork;
