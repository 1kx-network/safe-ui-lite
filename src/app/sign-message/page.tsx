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

import IconWarning from '@/assets/svg/notifications/alert.svg';
import { WalletTypography } from '@/ui-kit/wallet-typography';
import { WalletButton, WalletLayout, WalletPaper } from '@/ui-kit';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import useSafeStore from '@/stores/safe-store';
import { customToasty } from '@/components';
import useSignStore from '@/stores/sign-store';
import { formatterIcon } from '@/utils/icon-formatter';
import { formattedLabel } from '@/utils/formatters';
import { ITypeSignTrx } from '@/constants/type-sign';
import { setNetworkDB, setDataDB } from '@/db/set-info';
import { INetworkDB } from '@/db';
import OpenInNewIcon from '@/assets/svg/open-in-new.svg';
import CopyIcon from '@/assets/svg/copy.svg';
import IconDefaultAddress from '@/assets/svg/defult-icon-address.svg';
import IconArrowLeft from '@/assets/svg/left-arrow.svg';
import routes from '../routes';
import useNetworkStore from '@/stores/networks-store';
import { useMessageMultySign } from '@/hooks/useMessageMultySign';

import {
  BoxOwnerLinkStyled,
  GridButtonStyled,
  OwnerLinkStyled,
  OwnersInfoStyled,
  TransactionInfoStyled,
  WrapperStyled,
  styledBtn,
  styledBtnBack,
  styledPaper,
  styledSecondaryBtn,
} from './sign-message.styles';
import { SignMessageInfo } from './sign-msg-info';
import { WarningBoxStyled } from '../sign-transaction/sing-transaction.styles';
import { optionsNetwork } from '@/constants/networks';

const SignMessageComponent = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [signedCount, setSignedCount] = useState(0);
  const { safeMessage, safeSdk } = useSafeStore();
  const { threshold, status, owners } = useSignStore();
  const { address, chainId } = useWeb3ModalAccount();
  const { switchNetwork } = useSwitchNetwork();
  const { walletProvider } = useWeb3ModalProvider();
  const { open } = useWeb3Modal();
  const { networks, setChosenNetwork } = useNetworkStore();

  const [linkOnScan, setLinkOnScan] = useState<string>('');

  const safeAddress = typeof window !== 'undefined' ? searchParams.get('address') : null;
  const chainIdUrl = searchParams.get('chainId');
  const amount = searchParams.get('amount');
  const destinationAddress = searchParams.get('destinationAddress');
  const safeMsg = searchParams.get('safeMsg');
  const networkName = searchParams.get('networkName');
  const name = searchParams.get('name');
  const description = searchParams.get('description');
  const thresholdUrl = searchParams.get('thresholdUrl');
  const newThreshold = searchParams.get('newThreshold');
  const nonceUrl = searchParams.get('nonce');
  const userNetworkTrxUrl = searchParams.get('userNetworkTrx');
  const signatures = searchParams.getAll('signatures')[0];
  const signers = searchParams.getAll('signers')[0];

  const typeSignTrx: keyof ITypeSignTrx | null = searchParams.get('typeSignTrx') as
    | keyof ITypeSignTrx
    | null;

  const msgUrlInfo = {
    safeAddress,
    chainIdUrl,
    amount,
    address: destinationAddress,
    safeMsg: safeMsg,
    networkName,
    typeSignTrx,
    linkOnScan,
    thresholdUrl,
    newThreshold,
    nonce: nonceUrl,
  };

  const addNetworkForUserSign = async () => {
    if (!userNetworkTrxUrl) return;
    const userNetwork = JSON.parse(userNetworkTrxUrl) as INetworkDB;

    const existingNetwork =
      networks && networks.find(network => network.rpc === userNetwork.rpcUrl);
    const decimalChainId = ethers.toBeHex(userNetwork.chainId);

    if (!existingNetwork) {
      setChosenNetwork({
        chainId: userNetwork.chainId,
        label: userNetwork.name,
        value: userNetwork.name,
        rpc: userNetwork.rpcUrl,
        currency: userNetwork.symbol,
      });

      await setNetworkDB({
        ...userNetwork,
        //@ts-ignore rpcUri can be get from opensean
        rpcUrl: userNetwork.rpcUri.value ?? userNetwork.rpcUrl,
        //@ts-ignore
        name: userNetwork.chainName ?? userNetwork.name,
      });

      if (safeAddress) {
        await setDataDB(safeAddress, {});
      }

      if (!walletProvider) return;
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

  const multySign = useMessageMultySign({
    ...msgUrlInfo,
    safeAddress: safeAddress ?? '',
    safeMsg: safeMsg ?? '',
    mode: 'url',
  });

  const handleMessageClick = async () => {
    if (!safeSdk || !safeMessage) return;
    if (status === 'success') return;
    signedCount >= threshold ? multySign.executeMulty() : handleSignMessage();
  };

  const handleSignMessage = useCallback(async () => {
    if (!multySign) return;

    if (!safeSdk || !safeMessage || !safeMsg) return;

    await multySign.signMessageMulty();
  }, [safeSdk, safeMessage, safeMsg, status]);

  const handleCopy = (address: string | null) => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    customToasty('Was copy', 'success');
  };

  const handleConnectWallet = () => {
    open();
  };

  let buttonText = 'Sign Message';
  if (status === 'success') {
    buttonText = 'Executed Successfully';
  } else if (signedCount >= threshold) {
    buttonText = 'Confirm';
  } else if (status === 'loading') {
    buttonText = 'Loading...';
  } else if (status === 'signed') {
    buttonText = 'Sign again';
  }

  const isCustomRpc =
    userNetworkTrxUrl &&
    optionsNetwork.find(elem => elem.rpc === JSON.parse(userNetworkTrxUrl).rpcUri.value);

  return (
    <WalletLayout hideSidebar>
      <WrapperStyled>
        <WalletPaper style={styledPaper}>
          <Link href={routes.home}>
            <WalletButton styles={styledBtnBack} variant="contained">
              <IconArrowLeft />
              Back
            </WalletButton>
          </Link>
          <WalletTypography fontSize={22} fontWeight={600}>
            Sign Message
          </WalletTypography>
          <TransactionInfoStyled>
            <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
              Account info
            </WalletTypography>
            <Box display={'flex'} alignItems={'center'} gap={1}>
              <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
                Network: {networkName}
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

          <SignMessageInfo
            message={safeMsg ?? ''}
            name={name ?? ''}
            description={description ?? ''}
          />

          <GridButtonStyled>
            {address ? (
              <>
                {buttonText === 'Execute' && (
                  <WalletButton
                    loading={status === 'loading'}
                    // disabled={status === 'loading'}
                    variant={status === 'success' ? 'outlined' : 'contained'}
                    styles={styledSecondaryBtn}
                    onClick={handleMessageClick}
                  >
                    {status === 'signed' ? 'Sign again' : 'Sign Message'}
                  </WalletButton>
                )}
                <WalletButton
                  loading={status === 'loading'}
                  // disabled={status === 'loading'}
                  variant={status === 'success' ? 'outlined' : 'contained'}
                  styles={styledBtn}
                  onClick={handleMessageClick}
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

          {!isCustomRpc && userNetworkTrxUrl && (
            <WarningBoxStyled style={{ marginTop: '1rem' }}>
              <Box display={'flex'} alignItems={'center'} gap={1}>
                <IconWarning color={themeMuiBase.palette.warning} />
                <WalletTypography fontWeight={500}>You are using custom Safe RPC</WalletTypography>
              </Box>
              <WalletTypography fontSize={14} fontWeight={500} style={{ paddingLeft: '26px' }}>
                Safe RPC: {JSON.parse(userNetworkTrxUrl).rpcUri.value}
              </WalletTypography>
            </WarningBoxStyled>
          )}

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
      <SignMessageComponent />
    </Suspense>
  );
}
