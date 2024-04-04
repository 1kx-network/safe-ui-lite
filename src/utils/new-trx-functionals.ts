'use client';

import { MetaTransactionData, Transaction } from '@safe-global/safe-core-sdk-types';
import { parseUnits } from 'ethers';

import { TOKENS_ERC20 } from '@/constants/tokens';
import { CONTRACTS_TOKEN } from '@/constants/tokens-contract';
import { ICreateTrancationERC20 } from '@/hooks/useSafeSdk';

export const returnTransactionObj = async (
  to: string,
  amount: string,
  tokenType: string,
  chainId: number,
  data: string,
  createTrancationERC20: (payload: ICreateTrancationERC20) => Promise<Transaction | undefined>
) => {
  if (TOKENS_ERC20[tokenType]) {
    const parseAmount = parseUnits(amount, 6).toString();
    const trxERC20Data = await createTrancationERC20({
      tokenAddress: CONTRACTS_TOKEN[chainId][tokenType],
      toAddress: to,
      amount: parseAmount,
      data,
    });

    if (!trxERC20Data) return;

    return trxERC20Data;
  }

  const parseAmount = parseUnits(amount, 'ether').toString();
  const safeTransactionData: MetaTransactionData = {
    to,
    value: parseAmount,
    data,
  };

  return safeTransactionData;
};
