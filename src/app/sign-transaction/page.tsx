'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as utils from 'ethers';
import { useWeb3ModalAccount, useSwitchNetwork, useWeb3Modal } from '@web3modal/ethers/react';
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

interface ICheckAndSwitchNetwork {
  chainIdUrl: string | null;
  chainId: number | undefined;
  switchNetwork: (chainId: number) => void;
  open: () => void;
}

export default function SignTransaction() {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [owners, setOwners] = useState<string[]>([]);
  const [signedCount, setSignedCount] = useState(0);
  const { safeTransaction, safeSdk, setSafeTransaction } = useSafeStore();

  const { address, chainId } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();
  const { switchNetwork } = useSwitchNetwork();

  const safeAddress = searchParams.get('address');
  useSafeSdk(safeAddress);
  const chainIdUrl = searchParams.get('chainId');
  const amount = searchParams.get('amount');
  const destinationAddress = searchParams.get('destinationAddress');
  const safeTxHash = searchParams.get('safeTxHash');
  // const safeTrxsHash = JSON.parse(localStorage.getItem('safeTrxsHash') ?? '[]');

  const getOwners = async () => {
    if (!safeSdk) return;
    const owners = await safeSdk.getOwners();
    setOwners(owners);
  };

  const checkAndSwitchNetwork = async (props: ICheckAndSwitchNetwork) => {
    const { chainIdUrl, chainId, switchNetwork, open } = props;
    const shouldSwitchNetwork = chainIdUrl && +chainIdUrl !== chainId;
    const isNewNetwork = !chainId && chainIdUrl;

    if (shouldSwitchNetwork) {
      await switchNetwork(+chainIdUrl);
    } else if (isNewNetwork) {
      await open();
      await switchNetwork(+chainIdUrl);
    }
  };

  useEffect(() => {
    checkAndSwitchNetwork({ chainIdUrl, chainId, switchNetwork, open });

    getOwners();
    const conditionForCreateTrx =
      amount && destinationAddress && !safeTransaction && safeSdk && safeAddress;

    const pendingCreateTrxData = async () => {
      if (conditionForCreateTrx) {
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

        // const updateTrxHash = safeTrxsHash[safeAddress].unshift(safeTransaction);
        // localStorage.setItem('safeTrxsHash', JSON.stringify({ safeAddress: updateTrxHash }));

        setSafeTransaction(safeTransaction);
      }
    };

    pendingCreateTrxData();
  }, [safeSdk]);

  const handleTransaction = async () => {
    if (!safeSdk || !safeTransaction) return;
    owners.length > 1 ? handleSignTransaction() : handleExecute();
  };

  const handleSignTransaction = async () => {
    if (!safeSdk || !safeTransaction || !safeTxHash) return;
    if (safeTxHash) {
      const signedTransaction = await safeSdk.signTransaction(safeTransaction);
      const originalUrl = new URL(window.location.href);
      const signatures = originalUrl.searchParams.getAll('signatures');

      const signature = signedTransaction.signatures.entries().next().value[1].data;
      console.log(`signature`, signature);
      if (!signature) return;
      signatures.push(encodeURIComponent(signature));
      const encodedSignatures = signatures.map(sig => encodeURIComponent(sig));
      originalUrl.searchParams.set('signatures', encodedSignatures.join(','));
      router.push(originalUrl.toString());
    }
  };

  useEffect(() => {
    const signatures = searchParams.getAll('signatures');
    setSignedCount(signatures.length);
  }, [router, searchParams]);

  const handleExecute = async () => {
    if (!safeSdk || !safeTransaction) return;
    const txResponse = await safeSdk.executeTransaction(safeTransaction);
    await txResponse.transactionResponse?.wait();
  };

  const handleCopy = () => {
    if (!pathName || !searchParams) return;
    navigator.clipboard.writeText(window.location.href);
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
              Amount: {amount} ETH
            </WalletTypography>
            <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
              Destination: {destinationAddress}
            </WalletTypography>
          </TransactionInfoStyled>

          <GridButtonStyled>
            {address ? (
              <WalletButton variant="contained" styles={styledBtn} onClick={handleTransaction}>
                {`${owners.length > 1 ? 'Sign' : 'Execute'} Transaction`}
              </WalletButton>
            ) : (
              <WalletButton variant="outlined" styles={styledBtn}>
                Connect Wallet
              </WalletButton>
            )}
          </GridButtonStyled>

          <WalletTypography fontSize={22} fontWeight={600}>
            Safe URL
          </WalletTypography>

          <BoxOwnerLinkStyled>
            <OwnerLinkStyled>
              <WalletTypography
                style={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  maxWidth: '450px',
                }}
                fontSize={17}
                fontWeight={400}
              >
                {`${pathName}?${searchParams.toString()}`}
              </WalletTypography>
            </OwnerLinkStyled>
            <OpenInNewIcon width="18" height="19" />
            <CopyIcon width="18px" height="19px" cursor="pointer" onClick={handleCopy} />
          </BoxOwnerLinkStyled>

          <OwnersInfoStyled>
            <WalletTypography fontSize={22} fontWeight={600}>
              Signers
            </WalletTypography>

            <WalletTypography fontSize={17}>
              <WalletTypography fontWeight={600}>{signedCount} </WalletTypography>
              out of <WalletTypography fontWeight={600}>{owners.length}</WalletTypography> owners
            </WalletTypography>
          </OwnersInfoStyled>
        </WalletPaper>
      </WrapperStyled>
    </WalletLayout>
  );
}
