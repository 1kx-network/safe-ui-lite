'use client';

import { WalletTypography } from '@/ui-kit/wallet-typography';
import { WalletButton, WalletLayout, WalletPaper } from '@/ui-kit';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import OpenInNewIcon from '@/assets/svg/open-in-new.svg';
import CopyIcon from '@/assets/svg/copy.svg';

import {
  BoxOwnerLinkStyled,
  GridButtonStyled,
  OwnerLinkStyled,
  OwnersInfoStyled,
  TransactionInfoStyled,
  WrapperStyled,
  styledBtn,
} from './sing-transaction.styles';
import { dataOwner } from './fixtures';

const { account, amount, outOwners, owners, ownerName } = dataOwner;

export default function SignTransaction() {
  return (
    <WalletLayout hideSidebar>
      <WrapperStyled>
        <WalletPaper>
          <WalletTypography fontSize={22} fontWeight={600}>
            Sign Transaction
          </WalletTypography>
          <TransactionInfoStyled>
            <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
              Transaction Info
            </WalletTypography>
            <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
              Amount: {amount} USD
            </WalletTypography>
            <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
              Destination: {account}
            </WalletTypography>
          </TransactionInfoStyled>

          <GridButtonStyled>
            <WalletButton variant="outlined" styles={styledBtn}>
              Connect MetaMask
            </WalletButton>
            <WalletButton variant="contained" styles={styledBtn}>
              Sign Transaction
            </WalletButton>
          </GridButtonStyled>

          <WalletTypography fontSize={22} fontWeight={600}>
            Owner Name
          </WalletTypography>

          <BoxOwnerLinkStyled>
            <OwnerLinkStyled>
              <WalletTypography fontSize={17} fontWeight={400}>
                {ownerName}
              </WalletTypography>
            </OwnerLinkStyled>
            <OpenInNewIcon />
            <CopyIcon />
          </BoxOwnerLinkStyled>

          <OwnersInfoStyled>
            <WalletTypography fontSize={22} fontWeight={600}>
              Signers
            </WalletTypography>

            <WalletTypography fontSize={17}>
              <WalletTypography fontWeight={600}>{outOwners} </WalletTypography>
              out of <WalletTypography fontWeight={600}>{owners}</WalletTypography> owners
            </WalletTypography>
          </OwnersInfoStyled>
        </WalletPaper>
      </WrapperStyled>
    </WalletLayout>
  );
}
