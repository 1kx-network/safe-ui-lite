'use client';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '96c9c808e61db92d8af06b8366140bd9';

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
  explorerUrl: 'https://sepolia.io',
  rpcUrl: 'https://gateway.tenderly.co/public/sepolia',
};

// 3. Create modal
const metadata = {
  name: '1kx',
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
  featuredWalletIds: [
    // '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369', // MetaMask
  ],
});

export function Web3ModalProvider({ children }: { children: React.ReactNode }) {
  return children;
}
