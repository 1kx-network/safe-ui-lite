'use client';
import { Box } from '@mui/system';
import { WalletButton, WalletLayout, WalletPaper, WalletTypography } from '@/ui-kit';

import { WrapperStyled, styledBtn, styledPaper } from './not-found/404.styles';
import Link from 'next/link';
import routes from './routes';
import { themeMuiBase } from '@/assets/styles/theme-mui';

export default function NotFound() {
  return (
    <main>
      <WalletLayout hideSidebar>
        <WrapperStyled style={styledPaper}>
          <WalletPaper>
            <Box display={'flex'} flexDirection={'column'} gap={2} alignItems={'center'}>
              <WalletTypography fontSize={60} fontWeight={500}>
                404
              </WalletTypography>
              <WalletTypography
                fontSize={21}
                fontWeight={500}
                color={themeMuiBase.palette.tetriaryGrey}
              >
                OOPS! Page not found
              </WalletTypography>
            </Box>

            <Link href={routes.home}>
              <WalletButton variant="contained" styles={styledBtn}>
                Back to Home
              </WalletButton>
            </Link>
          </WalletPaper>
        </WrapperStyled>
      </WalletLayout>
    </main>
  );
}
