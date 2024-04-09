import {
  mainnet, // 1
  bsc, // 56
  polygon, // 137
  gnosis, // 100
  arbitrum, // 42161
  optimism, // 10
  celo, // 42220
  avalanche, // 43114
  aurora, // 1313161554
  sepolia, // 11155111
  bscTestnet, // 97
  polygonMumbai, // 80001
  Chain,
} from '@wagmi/core/chains';

export const chains = [
  mainnet,
  bsc,
  polygon,
  gnosis,
  arbitrum,
  optimism,
  celo,
  avalanche,
  aurora,
  sepolia,
  bscTestnet,
  polygonMumbai,
];

export const networks = chains.map((elem: Chain) => {
  const explorerUrl = elem.blockExplorers?.default.apiUrl || '';
  const rpcUrl = elem.rpcUrls.default.http[0] ?? '';

  return {
    ...elem.nativeCurrency,
    name: elem.name,
    chainId: elem.id,
    currency: elem.nativeCurrency.symbol,
    explorerUrl,
    rpcUrl,
  };
});
