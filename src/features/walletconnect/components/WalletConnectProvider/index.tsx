import { type ReactNode, useEffect, useState } from 'react';
import { getSdkError } from '@walletconnect/utils';
import { formatJsonRpcError } from '@walletconnect/jsonrpc-utils';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { ChainInfo, getChainsConfig } from '@safe-global/safe-gateway-typescript-sdk';

import useSafeWalletProvider from '@/features/safe-wallet-provider/useSafeWalletProvider';
import { asError } from '@/features/exceptions/utils';
import { WC_APP_DEV, WC_APP_PROD, IS_PRODUCTION } from '@/constants/wallet-connect';
import { getPeerName, stripEip155Prefix } from '@/features/walletconnect/services/utils';
import { wcPopupStore } from '@/features/walletconnect/components';
import WalletConnectWallet from '@/features/walletconnect/services/WalletConnectWallet';
import { WalletConnectContext } from '@/features/walletconnect/WalletConnectContext';
import useActiveSafeAddress from '@/stores/safe-address-store';
import useChainStore from '@/stores/chains-store';

enum Errors {
  WRONG_CHAIN = '%%dappName%% made a request on a different chain than the one you are connected to',
}

export enum WCLoadingState {
  APPROVE = 'Approve',
  REJECT = 'Reject',
  CONNECT = 'Connect',
  DISCONNECT = 'Disconnect',
}

const WalletConnectSafeApp = IS_PRODUCTION ? WC_APP_PROD : WC_APP_DEV;

const walletConnectSingleton = new WalletConnectWallet();

const getWrongChainError = (dappName: string): Error => {
  const message = Errors.WRONG_CHAIN.replace('%%dappName%%', dappName);
  return new Error(message);
};

export const WalletConnectProvider = ({ children }: { children: ReactNode }) => {
  const { setChains } = useChainStore();
  const { chainId } = useWeb3ModalAccount();
  const { safeAddress } = useActiveSafeAddress();

  const [walletConnect, setWalletConnect] = useState<WalletConnectWallet | null>(null);
  const open = wcPopupStore.useStore() ?? false;
  const setOpen = wcPopupStore.setStore;
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<WCLoadingState>();
  const safeWalletProvider = useSafeWalletProvider();

  // Init WalletConnect
  useEffect(() => {
    walletConnectSingleton
      .init()
      .then(() => setWalletConnect(walletConnectSingleton))
      .catch(setError);
  }, []);

  useEffect(() => {
    const getConfigs = async (): Promise<ChainInfo[]> => {
      const data = await getChainsConfig();
      return data.results || [];
    };
    getConfigs().then(chains => setChains(chains));
  }, [setChains]);

  // Update chainId/safeAddress
  useEffect(() => {
    if (!walletConnect || !chainId || !safeAddress) return;

    walletConnect.updateSessions(chainId.toString(), safeAddress).catch(setError);
  }, [walletConnect, chainId, safeAddress]);

  // Subscribe to requests
  useEffect(() => {
    if (!walletConnect || !safeWalletProvider || !chainId) return;

    return walletConnect.onRequest(async event => {
      if (!IS_PRODUCTION) {
        console.log('[WalletConnect] request', event);
      }

      const { topic } = event;
      const session = walletConnect.getActiveSessions().find(s => s.topic === topic);
      const requestChainId = stripEip155Prefix(event.params.chainId);

      const getResponse = () => {
        // Get error if wrong chain
        if (!session || requestChainId !== chainId.toString()) {
          if (session) {
            setError(getWrongChainError(getPeerName(session.peer)));
          }

          const error = getSdkError('UNSUPPORTED_CHAINS');
          return formatJsonRpcError(event.id, error);
        }

        // Get response from Safe Wallet Provider
        return safeWalletProvider.request(event.id, event.params.request, {
          id: WalletConnectSafeApp.id,
          url: WalletConnectSafeApp.url,
          name: getPeerName(session.peer) || 'Unknown dApp',
          description: session.peer.metadata.description,
          iconUrl: session.peer.metadata.icons[0],
        });
      };

      try {
        const response = await getResponse();

        // Send response to WalletConnect
        await walletConnect.sendSessionResponse(topic, response);
      } catch (e) {
        setError(asError(e));
      }
    });
  }, [walletConnect, chainId, safeWalletProvider]);

  return (
    <WalletConnectContext.Provider
      value={{ walletConnect, error, setError, open, setOpen, isLoading, setIsLoading }}
    >
      {children}
    </WalletConnectContext.Provider>
  );
};
