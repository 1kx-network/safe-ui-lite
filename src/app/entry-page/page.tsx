'use client';

import { Box } from '@mui/system';

import { WalletLayout } from '@/ui-kit';

import { Overview } from './components/overview/overview';
import { TokenList } from './components/tokens-list/tokens-list';
import { Transactions } from './components/transactions/transactions';
import { BoxGridStyled, WrapperStyled } from './entry-page.styles';

export default function EntryPage() {
  return (
    <WalletLayout>
      <WrapperStyled>
        <BoxGridStyled>
          <Box width={'100%'}>
            <Overview />
          </Box>
          <Box width={'100%'}>
            <Transactions />
          </Box>
        </BoxGridStyled>

        <TokenList />
      </WrapperStyled>
    </WalletLayout>
  );
}
