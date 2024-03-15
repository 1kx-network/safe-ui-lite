'use client';

import { WalletLayout, WalletPaper, WalletTypography } from '@/ui-kit';
import TokensIcon from '@/assets/svg/tokens.svg';
import TrxIcon from '@/assets/svg/trx-status.svg';
import { Box } from '@mui/system';
import { NonceBoxStyled } from './new-transaction.styles';
import { themeMuiBase } from '@/assets/styles/theme-mui';

const nonceCount = 1;

export default function NewTransaction() {
  return (
    <WalletLayout>
      <WalletTypography fontSize={17} fontWeight={600}>
        New Transaction
      </WalletTypography>
      <Box display={'flex'}>
        <WalletPaper>
          <WalletTypography fontSize={17} fontWeight={600}>
            <TokensIcon />
            Send Tokens
          </WalletTypography>

          <Box display={'flex'} gap={themeMuiBase.spacing(3.5)}>
            <WalletTypography>Nonce #</WalletTypography>
            <NonceBoxStyled>{nonceCount}</NonceBoxStyled>
          </Box>
        </WalletPaper>
        <WalletPaper>
          <WalletTypography fontSize={17} fontWeight={600}>
            <TrxIcon />
            Transaction Status
          </WalletTypography>
        </WalletPaper>
      </Box>
    </WalletLayout>
  );
}
