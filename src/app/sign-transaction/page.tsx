'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import * as utils from 'ethers';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { MetaTransactionData } from '@safe-global/safe-core-sdk-types';

import { WalletTypography } from '@/ui-kit/wallet-typography';
import { WalletButton, WalletLayout, WalletPaper } from '@/ui-kit';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import OpenInNewIcon from '@/assets/svg/open-in-new.svg';
import CopyIcon from '@/assets/svg/copy.svg';
import useSafeStore from '@/stores/safe-store';
import { useSafeSdk } from '@/hooks/useSafeSdk';

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

const { outOwners, ownerName } = dataOwner;

export default function SignTransaction() {
  const { address } = useWeb3ModalAccount();
  const searchParams = useSearchParams();

  const safeAddress = searchParams.get('address');
  useSafeSdk(safeAddress);

  const amount = searchParams.get('amount');
  const destinationAddress = searchParams.get('destinationAddress');

  const { safeTransaction, safeSdk, setSafeTransaction } = useSafeStore();
  const [owners, setOwners] = useState<string[]>([]);

  const getOwners = async () => {
    if (!safeSdk) return;
    const owners = await safeSdk.getOwners();
    setOwners(owners);
  };

  useEffect(() => {
    getOwners();

    const pendingCreateTrxData = async () => {
      if (amount && destinationAddress && !safeTransaction && safeSdk) {
        const parseAmount = utils.parseUnits(amount, 'ether');
        const safeTransactionData: MetaTransactionData = {
          to: destinationAddress,
          value: String(parseAmount),
          data: String(address),
        };
        if (!safeSdk) return;

        const safeTransaction = await safeSdk.createTransaction({
          transactions: [safeTransactionData],
        });

        setSafeTransaction(safeTransaction);
      }
    };

    pendingCreateTrxData();
  }, [safeSdk]);

  const [wasSign, setWasSign] = useState(false);

  const handleTransaction = async () => {
    if (!safeSdk || !safeTransaction) return;
    wasSign ? handleExecute() : handleSignTransaction();
  };

  const handleSignTransaction = async () => {
    if (!safeSdk || !safeTransaction) return;
    const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
    await safeSdk.signHash(safeTxHash);
    setWasSign(true);
  };

  const handleExecute = async () => {
    if (!safeSdk || !safeTransaction) return;
    const txResponse = await safeSdk.executeTransaction(safeTransaction);
    await txResponse.transactionResponse?.wait();
    setWasSign(false);
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
              Destination: {destinationAddress}
            </WalletTypography>
          </TransactionInfoStyled>

          <GridButtonStyled>
            {address ? (
              <WalletButton variant="contained" styles={styledBtn} onClick={handleTransaction}>
                {`${!wasSign ? 'Sign' : 'Execute'} Transaction`}
              </WalletButton>
            ) : (
              <WalletButton variant="outlined" styles={styledBtn}>
                Connect Wallet
              </WalletButton>
            )}
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
            <OpenInNewIcon width="18" height="19" />
            <CopyIcon width="18px" height="19px" />
          </BoxOwnerLinkStyled>

          <OwnersInfoStyled>
            <WalletTypography fontSize={22} fontWeight={600}>
              Signers
            </WalletTypography>

            <WalletTypography fontSize={17}>
              <WalletTypography fontWeight={600}>{outOwners} </WalletTypography>
              out of <WalletTypography fontWeight={600}>{owners.length}</WalletTypography> owners
            </WalletTypography>
          </OwnersInfoStyled>
        </WalletPaper>
      </WrapperStyled>
    </WalletLayout>
  );
}
