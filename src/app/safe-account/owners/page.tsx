'use client';
import * as React from 'react';
import { Box } from '@mui/system';

import { WalletButton, WalletInput, WalletLayout, WalletPaper, WalletTypography } from '@/ui-kit';
import {
  GridButtonStyled,
  GridContainer,
  PreviewSectionStyled,
  StepStyled,
  WrapperStyled,
  styleWalletPaper,
} from '../safe-account.styles';
import QrCodeIcon from '@/assets/svg/qr_code.svg';
import WalletAlert from '@/ui-kit/wallet-allert';

import { OwnerStylesBtn } from './owners.styles';
import Accordion from './accordion';

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
            <Box pb={5} borderBottom={1}>
              <WalletAlert
                title="Safe(Wallet) mobile owner key (optional)"
                description="Use your mobile phone as an additional owner key"
              />
            </Box>
            <Box mt={5}>
              <WalletTypography component="p" fontSize={22} fontWeight={600}>
                Threshold
              </WalletTypography>
              <Box mt={3}>
                <WalletTypography>
                  Set the owner wallets of your Safe Account and how many need to confirm to execute
                  a valid transaction
                </WalletTypography>
              </Box>
              <Box mt={3} display="flex" alignItems="center">
                <Box mr={3} maxWidth={82}>
                  <WalletInput value={'1'} onChange={() => console.log} />
                </Box>
                <WalletTypography fontSize={13} fontWeight={600}>
                  out of 1 owners
                </WalletTypography>
              </Box>
            </Box>
            <GridButtonStyled>
              <WalletButton onClick={() => console.log}>Cancel</WalletButton>
              <WalletButton type="submit" variant="contained">
                Next
              </WalletButton>
            </GridButtonStyled>
          </WalletPaper>
          <PreviewSectionStyled>
            <WalletPaper style={styleWalletPaper}>
              <WalletTypography fontSize={17} fontWeight={600}>
                Your Safe Account preview
              </WalletTypography>

              <Box display="flex" justifyContent={'space-between'} mt={1.5}>
                <WalletTypography fontSize={12} fontWeight={600}>
                  Wallet
                </WalletTypography>
                <WalletTypography fontSize={17}>gno:0x98BB81B...5D2e443</WalletTypography>
              </Box>

              <Box display="flex" justifyContent={'space-between'} mt={1.5}>
                <WalletTypography fontSize={12} fontWeight={600}>
                  Network
                </WalletTypography>
                <WalletTypography fontSize={17} fontWeight={600}>
                  Polygon
                </WalletTypography>
              </Box>
            </WalletPaper>
            <Box mt={3}>
              <WalletPaper style={styleWalletPaper}>
                <Box mb={3}>
                  <WalletTypography fontSize={17} fontWeight={600}>
                    Safe account creation
                  </WalletTypography>
                </Box>
                <Accordion
                  title="Network fee"
                  initialOpen
                  description="We recommend using a threshold higher than one to prevent losing access to your safe account in case an owner key is lost or compromised."
                />
                <Accordion title="Address book privacy" description="Some info" />
              </WalletPaper>
            </Box>
            <Box mt={3}>
              <WalletPaper style={styleWalletPaper}>
                <Box mb={3}>
                  <WalletTypography fontSize={17} fontWeight={600}>
                    Safe account setup
                  </WalletTypography>
                </Box>
                <Accordion
                  title="1/1 policy"
                  description="We recommend using a threshold higher than one to prevent losing access to your safe account in case an owner key is lost or compromised."
                />
              </WalletPaper>
            </Box>
          </PreviewSectionStyled>
        </GridContainer>
      </WrapperStyled>
    </WalletLayout>
  );
};

export default SafeAccountOwners;
