'use client';
import { useEffect, useState } from 'react';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';

import { networks } from '@/context/networks';
import { ItemTransaction } from '../item';
import { WalletPaper, WalletTypography } from '@/ui-kit';
import useTransactionsStore from '@/stores/transactions-store';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import { getTransactionsDB } from '@/db/get-info';
import useActiveSafeAddress from '@/stores/safe-address-store';

import {
  HeaderListStyled,
  WrapperStyled,
  styledPaper,
  styledPaperSmallType,
} from './table-transactions.styles';

interface ITableTransaction {
  smallType?: boolean;
}

export const TableTransaction = ({ smallType }: ITableTransaction) => {
  const { chainId } = useWeb3ModalAccount();
  const { transactions, transactionsFilter, setTransactions, setTransactionsFilter } =
    useTransactionsStore();
  const { safeAddress } = useActiveSafeAddress();

  const [linkOnScan, setLinkOnScan] = useState<string>('');

  useEffect(() => {
    if (chainId && safeAddress) {
      const linkOnScan = networks.find(elem => elem.chainId === chainId)?.explorerUrl;
      if (linkOnScan) {
        setLinkOnScan(linkOnScan);
      }

      (async () => {
        const resTrx = await getTransactionsDB(safeAddress);

        setTransactions(resTrx);
        setTransactionsFilter(resTrx);
      })();
    }
  }, [chainId, safeAddress]);

  return (
    <WrapperStyled>
      {transactions ? (
        <>
          <HeaderListStyled smallType={smallType}>
            <WalletTypography component="h3" fontSize={smallType ? 14 : 18} fontWeight={600}>
              Date
            </WalletTypography>
            <WalletTypography
              component="h3"
              fontSize={smallType ? 14 : 18}
              fontWeight={600}
              textAlign="center"
            >
              Amount
            </WalletTypography>
            {!smallType && (
              <WalletTypography
                component="h3"
                fontSize={smallType ? 14 : 18}
                fontWeight={600}
                textAlign="center"
              >
                Thresholders
              </WalletTypography>
            )}
          </HeaderListStyled>
          <WalletPaper style={smallType ? styledPaperSmallType : styledPaper}>
            {transactions &&
              transactionsFilter &&
              transactionsFilter.map(elem => (
                <ItemTransaction
                  {...elem}
                  key={elem.id}
                  linkOnScan={linkOnScan}
                  smallType={smallType}
                />
              ))}
            {transactionsFilter?.length === 0 && (
              <WalletTypography fontWeight={500} textAlign="center">
                No found transaction
              </WalletTypography>
            )}
          </WalletPaper>
        </>
      ) : (
        <WalletTypography fontWeight={400} color={themeMuiBase.palette.tetriaryDark}>
          No transactions
        </WalletTypography>
      )}
    </WrapperStyled>
  );
};
