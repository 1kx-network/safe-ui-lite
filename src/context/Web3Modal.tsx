'use client';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { useEffect } from 'react';
import { http, createConfig, WagmiProvider } from 'wagmi';
import {
  arbitrum,
  base,
  bsc,
  gnosis,
  mainnet as mViem,
  optimism,
  polygon,
  scroll,
  sepolia as sViem,
  pulsechain,
} from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import useActiveSafeAddress from '@/stores/safe-address-store';
import { WALLETCONNECT_V2_PROJECT_ID } from '@/constants/wallet-connect';
import useNetworkStore from '@/stores/networks-store';

import { networks } from './networks';

const metadata = {
  name: 'ZKSafe',
  description:
    'zkSafe: A Safe module enabling anonymous transaction approvals for multisig users. Enhances privacy by verifying required signatures without revealing signer identities.',
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
  themeMode: 'dark',
  allowUnsupportedChain: true,
});

const config = createConfig({
  chains: [mViem, sViem, base, bsc, polygon, gnosis, optimism, scroll, arbitrum, pulsechain],
  transports: {
    [mViem.id]: http('https://cloudflare-eth.com'),
    [sViem.id]: http('https://ethereum-sepolia-rpc.publicnode.com'),
    [bsc.id]: http('https://binance.llamarpc.com'),
    [base.id]: http('https://base.llamarpc.com'),
    [polygon.id]: http('https://polygon.llamarpc.com'),
    [gnosis.id]: http('https://gnosis-rpc.publicnode.com'),
    [optimism.id]: http('https://optimism.llamarpc.com'),
    [arbitrum.id]: http('https://arbitrum.llamarpc.com'),
    [scroll.id]: http('https://1rpc.io/scroll'),
    [pulsechain.id]: http('https://rpc-pulsechain.g4mm4.io'),
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
