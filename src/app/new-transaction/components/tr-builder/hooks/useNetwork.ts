'use client';

import { createContext, useEffect, useState } from 'react';

// import Web3 from 'web3';
// import InterfaceRepository, { InterfaceRepo } from '../lib/interfaceRepository';
// import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
// import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider';
import InterfaceRepository, { InterfaceRepo } from '../utils/InterfaceRepository';
import useNetworkStore from '@/stores/networks-store';
import useActiveSafeAddress from '@/stores/safe-address-store';

type NetworkContextProps = {
  //   sdk: SafeAppsSDK;
  //   safe: SafeInfo;
  //   web3: Web3 | undefined;
  chainId: string | number | undefined;
  interfaceRepo: InterfaceRepo | undefined;
  networkPrefix: string;
  nativeCurrencySymbol: string | undefined;
  getAddressFromDomain: (name: string) => Promise<string>;
};

export const NetworkContext = createContext<NetworkContextProps | null>(null);

const useNetwork = () => {
  //   const { sdk, safe } = useSafeAppsSDK();
  //   const [web3, setWeb3] = useState<Web3 | undefined>();
  //   const [chainInfo, setChainInfo] = useState<ChainInfo>();

  const [interfaceRepo, setInterfaceRepo] = useState<InterfaceRepository | undefined>();
  const { chosenNetwork } = useNetworkStore();
  const { safeAddress } = useActiveSafeAddress();

  useEffect(() => {
    if (!chosenNetwork || !chosenNetwork.chainId) {
      return;
    }

    // const safeProvider = new SafeAppProvider(safe, sdk);
    // const web3Instance = new Web3(safeProvider);
    // setWeb3(web3Instance);

    // Created class with functionals for work with ABI
    const interfaceRepo = new InterfaceRepository(chosenNetwork.chainId);
    setInterfaceRepo(interfaceRepo);
  }, [chosenNetwork]);

  //   useEffect(() => {
  //     const getChainInfo = async () => {
  //       try {
  //         const chainInfo = await sdk.safe.getChainInfo();
  //         // setChainInfo(chainInfo);
  //       } catch (error) {
  //         console.error('Unable to get chain info:', error);
  //       }
  //     };
  //     getChainInfo();
  //   }, [sdk.safe]);

  const networkPrefix = chosenNetwork?.name || chosenNetwork?.label || '';

  const getAddressFromDomain = async (): Promise<string> => {
    if (!safeAddress) {
      throw Error('<-- Error get safe address -->');
    }
    return safeAddress;
  };

  return {
    // sdk,
    // safe,
    // web3,
    chainId: chosenNetwork?.chainId,
    interfaceRepo,
    networkPrefix,
    nativeCurrencySymbol: chosenNetwork?.currency,
    getAddressFromDomain,
  };
};

// export const useNetwork = () => {
//   const contextValue = useContext(NetworkContext);
//   if (contextValue === null) {
//     throw new Error('Component must be wrapped with <TransactionProvider>');
//   }

//   return contextValue;
// };

export default useNetwork;
