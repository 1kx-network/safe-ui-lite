'use client';

import { Box } from '@mui/system';

import { WalletLayout } from '@/ui-kit';
import { useSafeSdk } from '@/hooks/useSafeSdk';

import { Overview } from './components/overview/overview';
import { Transactions } from './components/transactions/transactions';
import { BoxGridStyled, WrapperStyled } from './wallet.styles';

export default function WalletPage() {
  const safeAddress: string | null =
    typeof window !== 'undefined' ? localStorage.getItem('safeAddress') : null;

  useSafeSdk(safeAddress);

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
      </WrapperStyled>
    </WalletLayout>
  );
}
