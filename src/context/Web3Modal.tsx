'use client';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';

// 1. Get projectId at https://cloud.walletconnect.com
export const projectId = 'dde89f3d2432564a5cad9cadb88f93d0';

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com',
};

const sepolia = {
  chainId: 11155111,
  name: 'Sepolia',
  currency: 'SPO',
  explorerUrl: 'https://sepolia.etherscan.io/',
  rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
};

// 3. Create modal
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com', // origin must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/'],
};

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [mainnet, sepolia],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  themeMode: 'light',
});

export function Web3ModalProvider({ children }: { children: React.ReactNode }) {
  return children;
}
