'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import SafeAppsSDK, { ChainInfo, SafeInfo } from '@safe-global/safe-apps-sdk';
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk';
import { SafeAppProvider } from '@safe-global/safe-apps-provider';

import InterfaceRepository, { InterfaceRepo } from '../lib/interfaceRepository';

export type NetworkContextProps = {
  sdk: SafeAppsSDK;
  safe: SafeInfo;
  chainInfo: ChainInfo | undefined;
  web3: Web3 | undefined;
  interfaceRepo: InterfaceRepo | undefined;
  networkPrefix: string;
  nativeCurrencySymbol: string | undefined;
  getAddressFromDomain: (name: string) => Promise<string>;
};

const chainMock = {
  chainName: 'SEP',
  chainId: '11155111',
  shortName: 'SEP',
  nativeCurrency: {
    name: 'SEP',
    symbol: 'SEP',
    decimals: 18,
    logoUri: '',
  },
  blockExplorerUriTemplate: {
    address: '',
    txHash: '',
    api: '',
  },
};

export const NetworkContext = createContext<NetworkContextProps | null>(null);

const NetworkProvider = ({ children }: any) => {
  const { safe } = useSafeAppsSDK();
  const [web3, setWeb3] = useState<Web3 | undefined>();
  const [chainInfo, setChainInfo] = useState<ChainInfo>(chainMock);
  const [interfaceRepo, setInterfaceRepo] = useState<InterfaceRepository | undefined>();

  const sdk = new SafeAppsSDK();

  useEffect(() => {
    if (!chainInfo) {
      return;
    }

    const safeProvider = new SafeAppProvider(safe, sdk);
    // @ts-expect-error Web3 is complaining about some missing properties from websocket provider
    const web3Instance = new Web3(safeProvider);
    const interfaceRepo = new InterfaceRepository(chainInfo);

    setWeb3(web3Instance);
    setInterfaceRepo(interfaceRepo);
  }, [chainInfo, safe, sdk]);

  useEffect(() => {
    const getChainInfo = async () => {
      try {
        const chainInfo = await sdk.safe.getChainInfo();
        setChainInfo(chainInfo);
      } catch (error) {
        console.error('Unable to get chain info:', error);
      }
    };

    getChainInfo();
  }, [sdk.safe]);

  const networkPrefix = chainInfo?.shortName || '';

  const nativeCurrencySymbol = chainInfo?.nativeCurrency.symbol;

  const getAddressFromDomain = (name: string): Promise<string> => {
    return web3?.eth.ens.getAddress(name) || new Promise(resolve => resolve(name));
  };

  return (
    <NetworkContext.Provider
      value={{
        sdk,
        safe,
        chainInfo,
        web3,
        interfaceRepo,
        networkPrefix: 'SEP',
        nativeCurrencySymbol: 'SEP',
        getAddressFromDomain,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = (): NetworkContextProps | null => {
  const contextValue = useContext(NetworkContext);

  if (contextValue === null) {
    console.log('--Component must be wrapped with <TransactionProvider>--');
  }

  return contextValue;
};

export default NetworkProvider;
