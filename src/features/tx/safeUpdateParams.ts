import type { MetaTransactionData } from '@safe-global/safe-core-sdk-types';
import { OperationType } from '@safe-global/safe-core-sdk-types';
import type { ChainInfo, SafeInfo } from '@safe-global/safe-gateway-typescript-sdk';
import { SAFE_FEATURES } from '@safe-global/protocol-kit/dist/src/utils/safeVersions';
import type { SafeContractEthers } from '@safe-global/protocol-kit';

import {
  getReadOnlyFallbackHandlerContract,
  getReadOnlyGnosisSafeContract,
} from '@/features/contracts/safeContracts';
import { LATEST_SAFE_VERSION } from '@/constants/wallet-connect';
import { assertValidSafeVersion } from '@/hooks/coreSDK/safeCoreSDK';
import { hasSafeFeature } from '@/utils/safe-versions';

const getChangeFallbackHandlerCallData = async (
  safe: SafeInfo,
  chain: ChainInfo,
  safeContractInstance: SafeContractEthers
): Promise<string> => {
  if (!hasSafeFeature(SAFE_FEATURES.SAFE_FALLBACK_HANDLER, safe.version)) {
    return '0x';
  }

  const fallbackHandlerAddress = await (
    await getReadOnlyFallbackHandlerContract(chain.chainId, LATEST_SAFE_VERSION)
  ).getAddress();
  return safeContractInstance.encode('setFallbackHandler', [fallbackHandlerAddress]);
};

/**
 * Creates two transactions:
 * - change the mastercopy address
 * - set the fallback handler address
 * Only works for safes < 1.3.0 as the changeMasterCopy function was removed
 */
export const createUpdateSafeTxs = async (
  safe: SafeInfo,
  chain: ChainInfo
): Promise<MetaTransactionData[]> => {
  assertValidSafeVersion(safe.version);

  const latestMasterCopyAddress = await (
    await getReadOnlyGnosisSafeContract(chain, LATEST_SAFE_VERSION)
  ).getAddress();
  const readOnlySafeContract = await getReadOnlyGnosisSafeContract(chain, safe.version);

  // @ts-expect-error this was removed in 1.3.0 but we need to support it for older safe versions
  const changeMasterCopyCallData = readOnlySafeContract.encode('changeMasterCopy', [
    latestMasterCopyAddress,
  ]);
  const changeFallbackHandlerCallData = await getChangeFallbackHandlerCallData(
    safe,
    chain,
    readOnlySafeContract
  );

  const txs: MetaTransactionData[] = [
    {
      to: safe.address.value,
      value: '0',
      data: changeMasterCopyCallData,
      operation: OperationType.Call,
    },
    {
      to: safe.address.value,
      value: '0',
      data: changeFallbackHandlerCallData,
      operation: OperationType.Call,
    },
  ];

  return txs;
};
