'use client';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { useEffect } from 'react';
import { http, createConfig, WagmiProvider } from 'wagmi';
import { mainnet as mViem, sepolia as sViem } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import useActiveSafeAddress from '@/stores/safe-address-store';
import { WALLETCONNECT_V2_PROJECT_ID } from '@/constants/wallet-connect';
import useNetworkStore from '@/stores/networks-store';

import { networks } from './networks';

const metadata = {
  name: 'Safe Lite',
  description: 'Safe UI Lite',
  url: 'https://safe-ui-lite.vercel.app/',
  icons: [
    'https://app.safe.global/favicons/mstile-150x150.png',
    'https://app.safe.global/favicons/logo_120x120.png',
  ],
};

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: networks,
  projectId: WALLETCONNECT_V2_PROJECT_ID,
  themeMode: 'light',
  allowUnsupportedChain: true,
});

const config = createConfig({
  chains: [mViem, sViem],
  transports: {
    [mViem.id]: http('https://cloudflare-eth.com'),
    [sViem.id]: http('https://ethereum-sepolia-rpc.publicnode.com'),
  },
});
const queryClient = new QueryClient();

export function Web3ModalProvider({ children }: { children: React.ReactNode }) {
  const { setSafeAddress } = useActiveSafeAddress();
  const { loadNetworks } = useNetworkStore();

  const safeAddress: string | null =
    typeof window !== 'undefined' ? localStorage.getItem('safeAddress') : null;

  useEffect(() => {
    setSafeAddress(safeAddress);
    loadNetworks();
  }, [safeAddress]);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}> {children}</QueryClientProvider>
    </WagmiProvider>
  );
}
