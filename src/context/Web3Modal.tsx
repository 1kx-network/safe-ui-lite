'use client';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { useEffect } from 'react';

import useActiveSafeAddress from '@/stores/safe-address-store';
import { WALLETCONNECT_V2_PROJECT_ID } from '@/constants/wallet-connect';

import { networks } from './networks';

const metadata = {
  name: '1kx',
  description: '1kx wallet',
  url: 'https://safe-ui-lite-git-hotfix-22-04-1kx-network.vercel.app/',
  icons: ['https://avatars.mywebsite.com/'],
};

console.log(`WALLETCONNECT_V2_PROJECT_ID:`, WALLETCONNECT_V2_PROJECT_ID);
const modal = createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: networks,
  projectId: WALLETCONNECT_V2_PROJECT_ID,
  themeMode: 'light',
  allowUnsupportedChain: true,
});

console.log(`modal:`, modal);
export function Web3ModalProvider({ children }: { children: React.ReactNode }) {
  const { setSafeAddress } = useActiveSafeAddress();
  const safeAddress: string | null =
    typeof window !== 'undefined' ? localStorage.getItem('safeAddress') : null;

  useEffect(() => {
    setSafeAddress(safeAddress);
  }, [safeAddress]);

  return children;
}
