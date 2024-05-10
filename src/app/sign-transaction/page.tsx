'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  useSwitchNetwork,
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from '@web3modal/ethers/react';
import { Box } from '@mui/system';
import Link from 'next/link';
import * as ethers from 'ethers';

import { WalletTypography } from '@/ui-kit/wallet-typography';
import { WalletButton, WalletLayout, WalletPaper } from '@/ui-kit';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import useSafeStore from '@/stores/safe-store';
import { customToasty } from '@/components';
import { useMultySign } from '@/hooks/useMultySign';
import useSignStore from '@/stores/sign-store';
import { formatterIcon } from '@/utils/icon-formatter';
import { formattedLabel } from '@/utils/foramtters';
import { ITypeSignTrx } from '@/constants/type-sign';
import { setNetworkDB, setDataDB } from '@/db/set-info';
import OpenInNewIcon from '@/assets/svg/open-in-new.svg';
import CopyIcon from '@/assets/svg/copy.svg';
import IconDefaultAddress from '@/assets/svg/defult-icon-address.svg';
import routes from '../routes';
import useNetworkStore from '@/stores/networks-store';

import {
  BoxOwnerLinkStyled,
  GridButtonStyled,
  OwnerLinkStyled,
  OwnersInfoStyled,
  TransactionInfoStyled,
  WrapperStyled,
  styledBtn,
  styledPaper,
  styledSecondaryBtn,
} from './sing-transaction.styles';
import { SignTransactionInfo } from './sing-trx-info';

const SignTransactionComponent = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [signedCount, setSignedCount] = useState(0);
  const { safeTransaction, safeSdk } = useSafeStore();
  const { threshold, status, owners } = useSignStore();
  const { address, chainId } = useWeb3ModalAccount();
  const { switchNetwork } = useSwitchNetwork();
  const { walletProvider } = useWeb3ModalProvider();
  const { open } = useWeb3Modal();
  const { networks, setChosenNetwork, loadNetworks } = useNetworkStore();

  const [linkOnScan, setLinkOnScan] = useState<string>('');

  const safeAddress = typeof window !== 'undefined' ? searchParams.get('address') : null;
  const chainIdUrl = searchParams.get('chainId');
  const amount = searchParams.get('amount');
  const destinationAddress = searchParams.get('destinationAddress');
  const safeTxHash = searchParams.get('safeTxHash');
  const tokenType = searchParams.get('tokenType');
  // const networkName = searchParams.get('networkName');
  const thresholdUrl = searchParams.get('thresholdUrl');
  const newThreshold = searchParams.get('newThreshold');
  const nonceUrl = searchParams.get('nonce');
  const userNetworkTrxUrl = searchParams.get('userNetworkTrx');
  const signatures = searchParams.getAll('signatures')[0];
  const signers = searchParams.getAll('signers')[0];

  const typeSignTrx: keyof ITypeSignTrx | null = searchParams.get('typeSignTrx') as
    | keyof ITypeSignTrx
    | null;

  const safeTxHashParam = searchParams.get('safeTxHash');
  const safeTxHashJSON = safeTxHashParam ? JSON.parse(JSON.stringify(safeTxHashParam)) : null;
  const userNetwork = userNetworkTrxUrl ? JSON.parse(userNetworkTrxUrl) : null;

  const trxUrlInfo = {
    safeAddress,
    chainIdUrl,
    amount,
    address: destinationAddress,
    safeTxHash: safeTxHashJSON,
    tokenType,
    // networkName,
    typeSignTrx,
    linkOnScan,
    safeTransaction,
    thresholdUrl,
    newThreshold,
    nonce: nonceUrl,
  };

  const addNetworkForUserSign = async () => {
    const existingNetwork =
      networks && networks.find(network => network.rpc === userNetwork.rpcUrl);
    const decimalChainId = ethers.toBeHex(userNetwork.chainId);

    if (!existingNetwork) {
      setChosenNetwork({
        chainId: userNetwork.chainId,
        label: userNetwork.name,
        value: userNetwork.name,
        rpc: userNetwork.rpcUrl,
      });

      await setNetworkDB(userNetwork);
      loadNetworks();

      if (safeAddress) {
        await setDataDB(safeAddress, {});
      }

      if (!walletProvider) {
        throw Error('<-- Wallet provider is undefined -->');
      }

      await walletProvider.request({
        method: 'wallet_addEthereumChain',
        params: {
          chainId: decimalChainId,
          chainName: userNetwork.name + 'custom_',
          nativeCurrency: {
            name: userNetwork.name,
            symbol: userNetwork.symbol,
            decimals: userNetwork.decimals,
          },
          rpcUrls: [userNetwork.rpcUrl],
          blockExplorerUrls: [userNetwork.explorerUrl],
        },
      });
    }

    if (userNetwork.chainId !== chainId) {
      await switchNetwork(userNetwork.chainId);
    }
  };

  useEffect(() => {
    if (userNetworkTrxUrl) (async () => await addNetworkForUserSign())();

    if (chainIdUrl) {
      const linkOnScan = networks?.find(elem => elem.chainId === +chainIdUrl)?.explorerUrl;
      if (linkOnScan) {
        setLinkOnScan(linkOnScan);
      }
    }

    if (signatures && signers) {
      if (signedCount !== signatures.split(',').length) {
        setSignedCount(signatures.split(',').length);
      }
    }
  }, [router, searchParams]);

  const multySign = useMultySign({
    ...trxUrlInfo,
    safeAddress: safeAddress ?? '',
    safeTxHash: safeTxHash ?? '',
    mode: 'url',
  });

  const handleTransaction = async () => {
    if (!safeSdk || !safeTransaction) return;
    if (status === 'success') {
      router.push(routes.home);
      return;
    }

    signedCount >= threshold ? handleExecute() : handleSignTransaction();
  };

  const handleSignTransaction = useCallback(async () => {
    if (!multySign) return;

    if (!safeSdk || !safeTransaction || !safeTxHash) return;

    await multySign.signTransactionMulty();
  }, [safeSdk, safeTransaction, safeTxHash, status]);

  const handleExecute = useCallback(async () => {
    if (!multySign) return;

    await multySign.executeMulty();
  }, [safeSdk, safeTransaction, searchParams]);

  const handleCopy = (address: string | null) => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    customToasty('Was copy', 'success');
  };

  const handleConnectWallet = () => {
    open();
  };

  let buttonText = 'Sign Transaction';
  if (status === 'success') {
    buttonText = 'Executed Successfully';
  } else if (signedCount >= threshold) {
    buttonText = 'Execute';
  } else if (status === 'loading') {
    buttonText = 'Loading...';
  } else if (status === 'signed') {
    buttonText = 'Signed';
  }

  return (
    <WalletLayout>
      <WrapperStyled>
        <WalletPaper style={styledPaper}>
          <WalletTypography fontSize={22} fontWeight={600}>
            Sign Transaction
          </WalletTypography>
          <TransactionInfoStyled>
            <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
              Account info
            </WalletTypography>
            <Box display={'flex'} alignItems={'center'} gap={1}>
              <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
                Network: {userNetwork && userNetwork.name}
              </WalletTypography>
              {chainIdUrl && formatterIcon(+chainIdUrl)}
            </Box>
            <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
              Chain: {chainIdUrl}
            </WalletTypography>
            <Box display={'flex'} alignItems={'center'} gap={1}>
              <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
                Address:{' '}
              </WalletTypography>
              <IconDefaultAddress width="21px" height="21px" />
              <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
                {safeAddress}
              </WalletTypography>
              <Link href={`${linkOnScan}address/${safeAddress}`} target="_blanck">
                <OpenInNewIcon width="19px" height="22px" />
              </Link>
              <CopyIcon
                width="18px"
                height="19px"
                cursor="pointer"
                onClick={() => handleCopy(safeAddress)}
              />
            </Box>
          </TransactionInfoStyled>

          <SignTransactionInfo {...trxUrlInfo} address={destinationAddress} />

          <GridButtonStyled>
            {address ? (
              <>
                {buttonText === 'Execute' && (
                  <WalletButton
                    loading={status === 'loading'}
                    // disabled={status === 'loading'}
                    variant={status === 'success' ? 'outlined' : 'contained'}
                    styles={styledSecondaryBtn}
                    onClick={handleSignTransaction}
                  >
                    {status === 'signed' ? 'Signed' : 'Sign Transaction'}
                  </WalletButton>
                )}
                <WalletButton
                  loading={status === 'loading'}
                  // disabled={status === 'loading'}
                  variant={status === 'success' ? 'outlined' : 'contained'}
                  styles={styledBtn}
                  onClick={handleTransaction}
                >
                  {buttonText}
                </WalletButton>
              </>
            ) : (
              <WalletButton variant="outlined" styles={styledBtn} onClick={handleConnectWallet}>
                Connect Wallet
              </WalletButton>
            )}
          </GridButtonStyled>

          <WalletTypography fontSize={18} fontWeight={600}>
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
                fontWeight={400}
              >
                <WalletTypography fontWeight={600}>{typeSignTrx}</WalletTypography>
                {formattedLabel(`?${searchParams.toString()}`, 27, 40)}
              </WalletTypography>
            </OwnerLinkStyled>

            <Link href={`${pathName}?${searchParams.toString()}`} target="_blanck">
              <OpenInNewIcon width="19px" height="18px" />
            </Link>
            <CopyIcon
              width="18px"
              height="19px"
              cursor="pointer"
              onClick={() => handleCopy(window.location.href)}
            />
          </BoxOwnerLinkStyled>

          <OwnersInfoStyled>
            <WalletTypography fontWeight={500}>Owners: {owners?.length ?? 0}</WalletTypography>
            <WalletTypography fontWeight={500}>Need threshold: {threshold}</WalletTypography>
            <WalletTypography fontWeight={500}>Signed: {signedCount}</WalletTypography>
          </OwnersInfoStyled>
        </WalletPaper>
      </WrapperStyled>
    </WalletLayout>
  );
};

export default function SignTransaction() {
  return (
    <Suspense>
      <SignTransactionComponent />
    </Suspense>
  );
}
