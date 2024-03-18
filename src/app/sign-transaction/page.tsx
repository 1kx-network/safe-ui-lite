'use client';

import { WalletTypography } from '@/ui-kit/wallet-typography';
import { WalletButton, WalletLayout, WalletPaper } from '@/ui-kit';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import OpenInNewIcon from '@/assets/svg/open-in-new.svg';
import CopyIcon from '@/assets/svg/copy.svg';
import useSafeStore from '@/stores/safe-store';

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
  const { safeTransaction, safeSdk } = useSafeStore();
  console.log(safeTransaction, 'safeTransaction');

  const handleSignTransaction = async () => {
    if (!safeSdk || !safeTransaction) return;
    const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
    const signature = await safeSdk.signHash(safeTxHash);
    console.log(signature);
  };

  const handleExecute = async () => {
    if (!safeSdk || !safeTransaction) return;
    const txResponse = await safeSdk.executeTransaction(safeTransaction);
    await txResponse.transactionResponse?.wait();
  };
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
            {/* <WalletButton variant="outlined" styles={styledBtn}>
              Connect MetaMask
            </WalletButton> */}
            <WalletButton variant="contained" styles={styledBtn} onClick={handleSignTransaction}>
              Sign Transaction
            </WalletButton>
          </GridButtonStyled>
          <button onClick={handleExecute}>execute</button>
          <WalletTypography fontSize={22} fontWeight={600}>
            Owner Name
          </WalletTypography>

          <BoxOwnerLinkStyled>
            <OwnerLinkStyled>
              <WalletTypography fontSize={17} fontWeight={400}>
                {ownerName}
              </WalletTypography>
            </OwnerLinkStyled>
            <OpenInNewIcon width="18" height="19" />
            <CopyIcon width="18px" height="19px" />
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
