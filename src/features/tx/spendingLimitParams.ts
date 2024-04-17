import type { MetaTransactionData } from '@safe-global/safe-core-sdk-types';
import type { ChainInfo } from '@safe-global/safe-gateway-typescript-sdk';

import { getReadOnlyGnosisSafeContract } from '@/features/contracts/safeContracts';
import { getSpendingLimitInterface } from '@/features/contracts/spendingLimitContracts';

export const createEnableModuleTx = async (
  chain: ChainInfo,
  safeAddress: string,
  safeVersion: string,
  spendingLimitAddress: string
): Promise<MetaTransactionData> => {
  const contract = await getReadOnlyGnosisSafeContract(chain, safeVersion);

  const data = contract.encode('enableModule', [spendingLimitAddress]);

  return {
    to: safeAddress,
    value: '0',
    data,
  };
};

export const createAddDelegateTx = (
  delegate: string,
  spendingLimitAddress: string
): MetaTransactionData => {
  const spendingLimitInterface = getSpendingLimitInterface();

  const data = spendingLimitInterface.encodeFunctionData('addDelegate', [delegate]);

  return {
    to: spendingLimitAddress,
    value: '0',
    data,
  };
};

export const createResetAllowanceTx = (
  delegate: string,
  tokenAddress: string,
  spendingLimitAddress: string
): MetaTransactionData => {
  const spendingLimitInterface = getSpendingLimitInterface();

  const data = spendingLimitInterface.encodeFunctionData('resetAllowance', [
    delegate,
    tokenAddress,
  ]);

  return {
    to: spendingLimitAddress,
    value: '0',
    data,
  };
};

export const createSetAllowanceTx = (
  delegate: string,
  tokenAddress: string,
  amountInWei: string,
  resetTimeMin: number,
  resetBaseMin: number,
  spendingLimitAddress: string
) => {
  const spendingLimitInterface = getSpendingLimitInterface();

  const data = spendingLimitInterface.encodeFunctionData('setAllowance', [
    delegate,
    tokenAddress,
    amountInWei,
    resetTimeMin,
    resetBaseMin,
  ]);

  return {
    to: spendingLimitAddress,
    value: '0',
    data,
  };
};
