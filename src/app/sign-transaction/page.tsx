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
  const [status, setStatus] = useState<'loading' | 'success' | 'signed' | 'error' | ''>('loading');
  const [threshold, setThreshold] = useState<number>(0);
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
    const threshold = await safeSdk.getThreshold();
    setThreshold(threshold);
    setStatus('');
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
          data: '0x',
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
    signedCount === threshold ? handleExecute() : handleSignTransaction();
  };

  const handleSignTransaction = async () => {
    if (!safeSdk || !safeTransaction || !safeTxHash) return;
    if (status === 'signed') {
      // TODO: show toast
      return;
    }
    const signedTransaction = await safeSdk.signTransaction(safeTransaction);
    setSafeTransaction(signedTransaction);
    const originalUrl = new URL(window.location.href);
    const signatures = originalUrl.searchParams.getAll('signatures')[0]?.split(',') ?? [];
    const signers = originalUrl.searchParams.getAll('signers')[0]?.split(',') ?? [];

    const signature = signedTransaction.signatures.entries().next().value[1].data;
    const signer = signedTransaction.signatures.entries().next().value[1].signer;
    signatures.push(encodeURIComponent(signature));
    signers.push(encodeURIComponent(signer));
    const encodedSignatures = signatures.map(sig => encodeURIComponent(sig));
    const encodedSigners = signers.map(sig => encodeURIComponent(sig));
    originalUrl.searchParams.set('signatures', encodedSignatures.join(','));
    originalUrl.searchParams.set('signers', encodedSigners.join(','));
    router.push(originalUrl.toString());
  };

  useEffect(() => {
    const signatures = searchParams.getAll('signatures')[0];
    const signers = searchParams.getAll('signers')[0];
    if (signatures && signers) {
      setSignedCount(signatures.split(',').length);
      if (signers.split(',').some(signer => signer === address)) {
        setStatus('signed');
      }
    }
  }, [router, searchParams]);

  const handleExecute = async () => {
    try {
      setStatus('loading');
      const signatures = searchParams.getAll('signatures')[0];
      const signers = searchParams.getAll('signers')[0];
      if (!safeSdk || !safeTransaction || !signatures || !signers) return;
      signatures.split(',').map((sig: string, idx: number) =>
        safeTransaction.addSignature({
          data: sig,
          isContractSignature: false,
          signer: signers.split(',')[idx],
          staticPart: () => sig,
          dynamicPart: () => '',
        })
      );
      const txResponse = await safeSdk.executeTransaction(safeTransaction);
      await txResponse.transactionResponse?.wait();
      setStatus('success');
    } catch (error) {
      console.log(`error`, error);
    }
  };

  const handleCopy = () => {
    if (!pathName || !searchParams) return;
    navigator.clipboard.writeText(window.location.href);
  };

  let buttonText = 'Sign Transaction';
  if (status === 'success') {
    buttonText = 'Successfully deployed';
  } else if (signedCount === threshold) {
    buttonText = 'Execute';
  } else if (status === 'loading') {
    buttonText = 'Loading...';
  } else if (status === 'signed') {
    buttonText = 'Signed';
  }

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
              <WalletButton
                disabled={status === 'loading'}
                variant={status === 'success' ? 'outlined' : 'contained'}
                styles={styledBtn}
                onClick={handleTransaction}
              >
                {buttonText}
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
            <OpenInNewIcon width="19px" height="18px" />
            <CopyIcon width="18px" height="19px" cursor="pointer" onClick={handleCopy} />
          </BoxOwnerLinkStyled>

          <OwnersInfoStyled>
            <WalletTypography fontSize={22} fontWeight={600}>
              Signers
            </WalletTypography>

            <WalletTypography fontSize={17}>
              <WalletTypography fontWeight={600}>{signedCount} </WalletTypography>
              out of <WalletTypography fontWeight={600}>{threshold}</WalletTypography> owners
            </WalletTypography>
          </OwnersInfoStyled>
        </WalletPaper>
      </WrapperStyled>
    </WalletLayout>
  );
}
