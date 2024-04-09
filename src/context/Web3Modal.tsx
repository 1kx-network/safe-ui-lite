'use client';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';

import { networks } from './networks';

// Get projectId at https://cloud.walletconnect.com
export const projectId = 'dde89f3d2432564a5cad9cadb88f93d0';

const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com',
  icons: ['https://avatars.mywebsite.com/'],
};

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: networks,
  projectId,
  themeMode: 'light',
  allowUnsupportedChain: true,
});

export function Web3ModalProvider({ children }: { children: React.ReactNode }) {
  return children;
}
