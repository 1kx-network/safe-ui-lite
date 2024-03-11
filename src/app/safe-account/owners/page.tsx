'use client';
import * as React from 'react';
import { Box } from '@mui/system';

import { WalletButton, WalletInput, WalletLayout, WalletPaper, WalletTypography } from '@/ui-kit';
import { GridContainer, StepStyled, WrapperStyled, styleWalletPaper } from '../safe-account.styles';
import QrCodeIcon from '@/assets/svg/qr_code.svg';

import { OwnerStylesBtn } from './owners.styles';

const SafeAccountOwners = () => {
  return (
    <WalletLayout hideSidebar>
      <WrapperStyled>
        <WalletTypography
          className="safe-account_main-header"
          fontSize={22}
          fontWeight={600}
          component="h1"
        >
          Create new Safe Account
        </WalletTypography>
        <GridContainer>
          <WalletPaper style={styleWalletPaper} minWidth="653px">
            <Box display="flex" alignItems="center" pb={5} sx={{ borderBottom: '1px solid' }}>
              <StepStyled>
                <WalletTypography fontSize={18} fontWeight={600} color="#fff">
                  2
                </WalletTypography>
              </StepStyled>
              <Box>
                <WalletTypography component="h2" fontSize={22} fontWeight={600}>
                  Owners and confirmation
                </WalletTypography>
                <WalletTypography fontSize={12} fontWeight={400}>
                  Set the owner wallets of your Safe Account and how many need to confirm to execute
                  a valid transaction
                </WalletTypography>
              </Box>
            </Box>
            <Box mt={5}>
              <GridContainer>
                <WalletInput
                  placeholder={'Owner name'}
                  value={''}
                  onChange={() => console.log}
                  label="Owner name"
                />
                <WalletInput
                  placeholder={'Owner address'}
                  value={''}
                  onChange={() => console.log}
                  label="Owner address"
                  endAdornment={<QrCodeIcon />}
                />
              </GridContainer>
              <Box maxWidth="100px" mt={5}>
                <WalletButton onClick={() => console.log} variant="text" styles={OwnerStylesBtn}>
                  + Add new owner
                </WalletButton>
              </Box>
            </Box>
          </WalletPaper>
          <WalletPaper style={styleWalletPaper}>ddd</WalletPaper>
        </GridContainer>
      </WrapperStyled>
    </WalletLayout>
  );
};

export default SafeAccountOwners;
