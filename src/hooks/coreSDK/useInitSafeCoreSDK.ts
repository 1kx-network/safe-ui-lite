import { useEffect } from 'react';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { ImplementationVersionState } from '@safe-global/safe-gateway-typescript-sdk';

import { initSafeSDK, setSafeSDK } from '@/hooks/coreSDK/safeCoreSDK';
import { useWeb3ReadOnly } from '@/hooks/wallets/web3';
import { asError } from '@/features/exceptions/utils';
import useSafeStore from '@/stores/safe-store';
import useActiveSafeAddress from '@/stores/safe-address-store';

export const useInitSafeCoreSDK = () => {
  const { safeSdk: safe } = useSafeStore();
  const { safeAddress: address, contractVersion } = useActiveSafeAddress();
  const { chainId } = useWeb3ModalAccount();
  const web3ReadOnly = useWeb3ReadOnly();

  useEffect(() => {
    if (!safe || !web3ReadOnly) {
      // If we don't reset the SDK, a previous Safe could remain in the store
      setSafeSDK(undefined);
      return;
    }

    // A read-only instance of the SDK is sufficient because we connect the signer to it when needed
    initSafeSDK({
      provider: web3ReadOnly,
      chainId: chainId?.toString() ?? '1',
      address: address ?? '',
      version: contractVersion,
      implementationVersionState: ImplementationVersionState.UP_TO_DATE,
      implementation: contractVersion ?? '',
    })
      .then(setSafeSDK)
      .catch(_e => {
        const e = asError(_e);
        console.log(`Failed to initialize Safe SDK: ${e.message}`);
      });
  }, [address, address, chainId, contractVersion, safe, web3ReadOnly]);
};
