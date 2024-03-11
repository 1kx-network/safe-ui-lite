'use client';
import { Box } from '@mui/system';
import { WalletButton, WalletInput, WalletLayout, WalletPaper, WalletTypography } from '@/ui-kit';
import { styleWalletPaper, Wrapper, GridButtonStyled } from './page-styles';

export default function SafeWallet() {
  return (
    <WalletLayout>
      <Wrapper>
        <WalletTypography fontSize={22} fontWeight={600}>
          Safe light Wallet
        </WalletTypography>
        <WalletPaper style={styleWalletPaper}>
          <WalletTypography fontSize={22} fontWeight={600}>
            Recipient address or ENS
          </WalletTypography>
          <Box display={'flex'} flexDirection={'column'}>
            <Box display={'flex'} flexDirection={'column'}>
              <WalletTypography>Label</WalletTypography>
              <WalletTypography>Description for label</WalletTypography>
            </Box>
            <Box>
              <WalletInput error errorValue="12" />
              {/* <GridButtonStyled>
                <WalletButton onClick={() => {}}>Use MetaMask RPC</WalletButton>
                <WalletButton onClick={() => {}}>Add RPC</WalletButton>
              </GridButtonStyled> */}
            </Box>
          </Box>

          <WalletTypography fontSize={22} fontWeight={600}>
            If you have wallet - enter
          </WalletTypography>

          <Box>1</Box>
          <Box>2</Box>
        </WalletPaper>

        <Box flexDirection={'column'}>
          <WalletTypography fontSize={12} fontWeight={600}>
            If you dont have wallet
          </WalletTypography>
          <WalletButton onClick={() => {}}>Create wallet</WalletButton>
        </Box>
      </Wrapper>
    </WalletLayout>
  );
}
