import { useMemo } from 'react';
import { type ChainInfo } from '@safe-global/safe-gateway-typescript-sdk';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';

import { type FEATURES, hasFeature } from '@/utils/chains';
import useChainStore from '@/stores/chains-store';

const useChains = (): { configs: ChainInfo[]; error?: string; loading?: boolean } => {
  const { chains } = useChainStore();

  return useMemo(
    () => ({
      configs: chains ?? [],
      error: '',
      loading: false,
    }),
    [chains]
  );
};

export default useChains;

export const useChain = (chainId: string): ChainInfo | undefined => {
  const chains = useChains();
  const chainInfo = chains.configs.find(chain => chain.chainId === chainId?.toString());
  return chainInfo;
};

export const useCurrentChain = (): ChainInfo | undefined => {
  const { chainId } = useWeb3ModalAccount();
  const chains = useChains();
  const chainInfo = chains.configs.find(chain => chain.chainId === chainId?.toString());
  return chainInfo;
};

/**
 * Checks if a feature is enabled on the current chain.
 *
 * @param feature name of the feature to check for
 * @returns `true`, if the feature is enabled on the current chain. Otherwise `false`
 */
export const useHasFeature = (feature: FEATURES): boolean => {
  const currentChain = useCurrentChain();
  return !!currentChain && hasFeature(currentChain, feature);
};
