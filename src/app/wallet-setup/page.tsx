'use client';

import { Box } from '@mui/system';

import { WalletButton, WalletLayout, WalletPaper, WalletTypography } from '@/ui-kit';
import NonceIcon from '@/assets/svg/nonce-icon.svg';
import { themeMuiBase } from '@/assets/styles/theme-mui';

import {
  BoxIconStyled,
  BoxStyled,
  WrapperStyled,
  styledBtn,
  GridBtnStyled,
  ConfirmationsStyled,
  BodyAccountsStyled,
} from './wallet-setup.styles';
import { ListAccount } from './components/list-account/list-account';

const currentnNonce = 1;

export default function WalletSetup() {
  return (
    <WalletLayout>
      <WrapperStyled>
        <WalletTypography fontSize={22} fontWeight={600} component="h2">
          Overview
        </WalletTypography>

        <WalletPaper>
          <Box display={'flex'} gap={themeMuiBase.spacing(3)}>
            <BoxStyled>
              <Box mr={themeMuiBase.spacing(3)} display={'flex'} alignItems={'center'}>
                <WalletTypography fontSize={17} fontWeight={600}>
                  Safe Account nonce
                </WalletTypography>
                <BoxIconStyled>
                  <NonceIcon />
                </BoxIconStyled>
              </Box>
              <WalletTypography fontWeight={400} fontSize={17}>
                Current nonce: {currentnNonce}
              </WalletTypography>
            </BoxStyled>
            <BoxStyled>
              <WalletTypography fontSize={17} fontWeight={600}>
                Contract Version
              </WalletTypography>
              <WalletTypography fontSize={17}>1.3.0+L2</WalletTypography>
              <WalletTypography fontSize={17}>Latest version</WalletTypography>
            </BoxStyled>
          </Box>
        </WalletPaper>

        <WalletPaper>
          <BodyAccountsStyled>
            <Box mr={4} width={'40%'}>
              <WalletTypography fontSize={17} fontWeight={600}>
                Manage Safe Account owners
              </WalletTypography>
            </Box>
            <Box>
              <Box mb={3}>
                <WalletTypography fontSize={17} fontWeight={400}>
                  Add, remove and replace or rename existing owners. Owner names are only stored
                  locally and will never be shared with us or any third parties.
                </WalletTypography>
              </Box>
              <ListAccount />
              <GridBtnStyled>
                <WalletButton variant="text" styles={styledBtn}>
                  + Add new owner
                </WalletButton>

                <WalletButton variant="text" styles={styledBtn}>
                  Export as CSV
                </WalletButton>
              </GridBtnStyled>
            </Box>
          </BodyAccountsStyled>

          <ConfirmationsStyled>
            <WalletTypography fontSize={17} fontWeight={600}>
              Required confirmations
            </WalletTypography>
            <WalletTypography fontSize={17} fontWeight={400}>
              Any transaction requires the confirmation of:
            </WalletTypography>
            <WalletTypography fontSize={17} fontWeight={400}>
              <WalletTypography fontWeight={600} fontSize={17}>
                2
              </WalletTypography>{' '}
              out of{' '}
              <WalletTypography fontWeight={600} fontSize={17}>
                3
              </WalletTypography>{' '}
              owners
            </WalletTypography>
            <WalletButton variant="contained">Change</WalletButton>
          </ConfirmationsStyled>
        </WalletPaper>
      </WrapperStyled>
    </WalletLayout>
  );
}
