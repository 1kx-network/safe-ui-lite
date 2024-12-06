import {
  mainnet, // 1
  base, // 4222
  bsc, // 56
  polygon, // 137
  gnosis, // 100
  arbitrum, // 42161
  optimism, // 10
  scroll, // 534352
  // sepolia, // 11155111
  pulsechain,
} from '@wagmi/core/chains';

export const chains = [
  mainnet, // Error with adding a new network
  base,
  bsc,
  polygon,
  gnosis,
  arbitrum,
  optimism,
  scroll,
  pulsechain,
];

export const networks = [
  ...chains.map(elem => ({
    chainId: elem.id,
    name: elem.name,
    currency: elem.nativeCurrency.symbol,
    explorerUrl: elem.blockExplorers.default.apiUrl,
    rpcUrl: elem.rpcUrls.default.http[0],
  })),
  {
    chainId: 11155111,
    name: 'Sepolia',
    currency: 'SPO',
    explorerUrl: 'https://sepolia.etherscan.io/',
    rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
  },
];
