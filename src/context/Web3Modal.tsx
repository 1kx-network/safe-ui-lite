'use client';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { useEffect } from 'react';

import useActiveSafeAddress from '@/stores/safe-address-store';
import { WALLETCONNECT_V2_PROJECT_ID } from '@/constants/wallet-connect';

import { networks } from './networks';

const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com',
  icons: ['https://avatars.mywebsite.com/'],
};

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: networks,
  projectId: WALLETCONNECT_V2_PROJECT_ID,
  themeMode: 'light',
  allowUnsupportedChain: true,
});

export function Web3ModalProvider({ children }: { children: React.ReactNode }) {
  const { setSafeAddress } = useActiveSafeAddress();
  const safeAddress: string | null =
    typeof window !== 'undefined' ? localStorage.getItem('safeAddress') : null;

  useEffect(() => {
    setSafeAddress(safeAddress);
  }, [safeAddress]);

  return children;
}
