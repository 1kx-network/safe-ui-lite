import Safe, { SafeAccountConfig, SafeFactory } from '@safe-global/protocol-kit';
import { useEffect } from 'react';
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';

import useSafeStore from '@/stores/safe-store';

import { useEthersAdapter } from './useEthersAdapter';

export function useSafeSdk(safeAddress: string | null = null) {
  const createEthAdapter = useEthersAdapter();
  const { saveSdk } = useSafeStore();
  const { walletProvider } = useWeb3ModalProvider();
  const { chainId } = useWeb3ModalAccount();

  const createSdkInstance = async () => {
    if (safeAddress && walletProvider) {
      await createSafe(safeAddress);
    }
  };

  useEffect(() => {
    createSdkInstance();
  }, [safeAddress, walletProvider]);

  const deploySafe = async (owners: string[], threshold: number) => {
    try {
      const ethAdapter = await createEthAdapter?.();
      const safeAddress = await ethAdapter?.getSignerAddress();

      if (!safeAddress || !ethAdapter) return null;

      const safeAccountConfig: SafeAccountConfig = {
        owners,
        threshold,
      };
      const safeFactory = await SafeFactory.create({ ethAdapter, isL1SafeSingleton: true }).catch(
        res => {
          return res;
        }
      );
      console.log(`safeFactory`, safeFactory);

      const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });
      const addressAccount = await safeSdk.getAddress();

      const localList = localStorage.getItem('createdSafes');
      const localListParsed = localList
        ? JSON.parse(localList)
        : {
            '1': [],
            '10': [],
            '56': [],
            '100': [],
            '137': [],
            '324': [],
            '1101': [],
            '8453': [],
            '42161': [],
            '42220': [],
            '43114': [],
            '84532': [],
            '11155111': [],
            '1313161554': [],
          };
      localListParsed[chainId ?? 1].push(addressAccount);
      localStorage.setItem('createdSafes', JSON.stringify(localListParsed));
      localStorage.setItem('safeAddress', addressAccount);

      return safeSdk;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const createSafe = async (safeAddress: string) => {
    try {
      const ethAdapter = await createEthAdapter?.();

      if (!ethAdapter) return null;

      const safeSdk = await Safe.create({
        ethAdapter,
        safeAddress,
        isL1SafeSingleton: true,
      });

      saveSdk(safeSdk);
      return safeSdk;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  return { deploySafe, createSafe };
}
