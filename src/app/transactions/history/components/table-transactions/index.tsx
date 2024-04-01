'use client';
import { useEffect, useState } from 'react';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';

import { networks } from '@/context/networks';
import { ItemTransaction } from '../item';
import { WalletPaper, WalletTypography } from '@/ui-kit';
import useTransactionsStore from '@/stores/transactions-store';
import { themeMuiBase } from '@/assets/styles/theme-mui';

import { HeaderListStyled, WrapperStyled, styledPaper } from './table-transactions.styles';

export const TableTransaction = () => {
  const { chainId } = useWeb3ModalAccount();
  const { transactions, transactionsFilter } = useTransactionsStore();

  const [linkOnScan, setLinkOnScan] = useState<string>('');

  useEffect(() => {
    if (chainId) {
      // const getTrxDb = async () => {
      //   await db.transactions.filter(trx => {
      //     return trx.amount !== '0';
      //   });
      // };

      const linkOnScan = networks.find(elem => elem.chainId === chainId)?.explorerUrl;
      if (linkOnScan) {
        setLinkOnScan(linkOnScan);
      }
    }
  }, [chainId]);

  return (
    <WrapperStyled>
      {transactions ? (
        <>
          <HeaderListStyled>
            <WalletTypography component="h3" fontSize={18} fontWeight={600}>
              Date
            </WalletTypography>
            <WalletTypography component="h3" fontSize={18} fontWeight={600} textAlign="center">
              Amount
            </WalletTypography>
            <WalletTypography component="h3" fontSize={18} fontWeight={600} textAlign="center">
              Trasholder
            </WalletTypography>
          </HeaderListStyled>
          <WalletPaper style={styledPaper}>
            {transactions &&
              transactionsFilter &&
              transactionsFilter.map(elem => (
                <ItemTransaction {...elem} key={elem.id} linkOnScan={linkOnScan} />
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
