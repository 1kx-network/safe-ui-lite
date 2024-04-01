'use client';
import { Box } from '@mui/system';

import routes from '@/app/routes';
import { CustomTabs } from '@/components';
import { WalletLayout, WalletTypography } from '@/ui-kit';

import { MenuFilters } from './components/filters-menu';
import { WrapperStyled } from './history-transactions.styles';
import { TableTransaction } from './components/table-transactions';

const tabsTransactions = [{ id: 1, title: 'History', url: routes.transactionsHistory }];

export default function TransactionsHistory() {
  return (
    <WalletLayout>
      <WrapperStyled>
        <Box mb={10}>
          <WalletTypography fontSize={22} fontWeight={600}>
            Transactions
          </WalletTypography>
        </Box>
        <CustomTabs tabs={tabsTransactions} />
        <MenuFilters />
        <TableTransaction />
      </WrapperStyled>
    </WalletLayout>
  );
}
