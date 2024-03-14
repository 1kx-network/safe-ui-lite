import Safe, { SafeAccountConfig, SafeFactory } from '@safe-global/protocol-kit';

import { useEthersAdapter } from './useEthersAdapter';
export function useSafeSdk() {
  const createEthAdapter = useEthersAdapter();

  const deploySafe = async (owners: string[], threshold: number) => {
    const ethAdapter = await createEthAdapter?.();
    const safeAddress = await ethAdapter?.getSignerAddress();

    if (!safeAddress || !ethAdapter) return null;

    const safeAccountConfig: SafeAccountConfig = {
      owners,
      threshold,
    };
    const safeFactory = await SafeFactory.create({ ethAdapter, isL1SafeSingleton: true });
    const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });

    return safeSdk;
  };

  const createSafe = async (safeAddress: string) => {
    const ethAdapter = await createEthAdapter?.();
    if (!ethAdapter) return null;
    const safeSdk = await Safe.create({
      ethAdapter,
      safeAddress,
      isL1SafeSingleton: true,
    });
    return safeSdk;
  };

  return { deploySafe, createSafe };
}
