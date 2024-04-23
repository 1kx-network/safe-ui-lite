import { WalletPaper, WalletTypography } from '@/ui-kit';
import { styledHeader } from '../../wallet.styles';
import { TableTransaction } from '@/app/transactions/history/components/table-transactions';

import { styledPaper } from './transactions.styles';

export const Transactions = () => {
  return (
    <>
      <WalletTypography style={styledHeader}>Transactions</WalletTypography>
      <WalletPaper style={styledPaper}>
        <TableTransaction smallType />
      </WalletPaper>
    </>
  );
};
