import {
  // mainnet, // 1
  bsc, // 56
  polygon, // 137
  gnosis, // 100
  arbitrum, // 42161
  optimism, // 10
  celo, // 42220
  avalanche, // 43114
  aurora, // 1313161554
  // sepolia, // 11155111
  bscTestnet, // 97
  polygonMumbai, // 80001
} from '@wagmi/core/chains';

export const chains = [
  // mainnet,
  // sepolia,
  bsc,
  polygon,
  gnosis,
  arbitrum,
  optimism,
  celo,
  avalanche,
  aurora,
  bscTestnet,
  polygonMumbai,
];

export const networks = [
  {
    chainId: 11155111,
    name: 'Sepolia',
    currency: 'SPO',
    explorerUrl: 'https://sepolia.etherscan.io/',
    rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
  },
];
