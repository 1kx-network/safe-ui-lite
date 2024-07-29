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
import Safe from '@safe-global/protocol-kit';

import { WalletTypography } from '@/ui-kit/wallet-typography';
import { WalletButton, WalletLayout, WalletPaper } from '@/ui-kit';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import useSafeStore from '@/stores/safe-store';
import { customToasty } from '@/components';
import { useMultySign } from '@/hooks/useMultySign';
import useSignStore from '@/stores/sign-store';
import { formatterIcon } from '@/utils/icon-formatter';
import IconWarning from '@/assets/svg/notifications/alert.svg';
import { formattedLabel } from '@/utils/formatters';
import { ITypeSignTrx } from '@/constants/type-sign';
import { setNetworkDB, setDataDB } from '@/db/set-info';
import OpenInNewIcon from '@/assets/svg/open-in-new.svg';
import CopyIcon from '@/assets/svg/copy.svg';
import IconDefaultAddress from '@/assets/svg/defult-icon-address.svg';
import routes from '../routes';
import useNetworkStore from '@/stores/networks-store';
import { parseSearchParams } from '@/utils/helpers';
import useActiveSafeAddress from '@/stores/safe-address-store';
import { useSafeSdk } from '@/hooks/useSafeSdk';

import Proof from './components/proof';
import {
  BoxOwnerLinkStyled,
  GridButtonStyled,
  OwnerLinkStyled,
  OwnersInfoStyled,
  TransactionInfoStyled,
  WarningBoxStyled,
  WrapperStyled,
  styledBtn,
  styledPaper,
  styledSecondaryBtn,
} from './sing-transaction.styles';
import { SignTransactionInfo } from './sign-trx-info';
import { IBatchTr } from './tr-builder';
import { optionsNetwork } from '@/constants/networks';

const SignTransactionComponent = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [signedCount, setSignedCount] = useState(0);
  const { safeTransaction, safeSdk } = useSafeStore();
  const { threshold, status, setThreshold } = useSignStore();
  const { address, chainId } = useWeb3ModalAccount();
  const { switchNetwork } = useSwitchNetwork();
  const { walletProvider } = useWeb3ModalProvider();
  const { open } = useWeb3Modal();
  const { networks, setChosenNetwork, loadNetworks } = useNetworkStore();
  const { setBalanceAccount, setIsLoading } = useActiveSafeAddress();
  const { getInfoByAccount, createSdkInstance } = useSafeSdk();

  const [ownerList, setOwnerList] = useState<string[] | null>(null);

  const [linkOnScan, setLinkOnScan] = useState<string>('');
  const [safeTransactionHash, setSafeTransactionHash] = useState<string | null>(null);
  const [safeOwners, setSafeOwners] = useState<string[]>([]);
  const safeAddress = typeof window !== 'undefined' ? searchParams.get('address') : null;
  const chainIdUrl = searchParams.get('chainId');
  const amount = searchParams.get('amount');
  const destinationAddress = searchParams.get('destinationAddress');
  const destinationName = searchParams.get('destinationName');
  const safeTxHash = searchParams.get('safeTxHash');
  const tokenType = searchParams.get('tokenType');
  const thresholdUrl = searchParams.get('thresholdUrl');
  const newThreshold = searchParams.get('newThreshold');
  const nonceUrl = searchParams.get('nonce');
  const userNetworkTrxUrl = searchParams.get('userNetworkTrx');
  const signatures = searchParams.getAll('signatures')[0];
  const signers = searchParams.getAll('signers')[0];
  const calldata = searchParams.get('calldata');

  const batchTr = searchParams.get('batchTr');
  const parseRawTr: IBatchTr[] | null = parseSearchParams(batchTr);
  const rawTr = parseRawTr ? parseRawTr.map(elem => elem.rawTr) : undefined;

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
    destinationName,
    safeTxHash: safeTxHashJSON,
    tokenType,
    typeSignTrx,
    linkOnScan,
    safeTransaction,
    thresholdUrl,
    newThreshold,
    nonce: nonceUrl,
    rawTr,
    calldata,
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
        currency: userNetwork.currency ?? userNetwork.name,
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

    const getTransactionHash = async () => {
      if (!safeSdk || !safeTransaction) return;
      const hash = await safeSdk.getTransactionHash(safeTransaction);
      setSafeTransactionHash(hash);
    };
    getTransactionHash();
  }, [safeTransaction, safeSdk]);

  useEffect(() => {
    const getSafeOwners = async () => {
      if (!safeSdk) return;
      const owners = await safeSdk.getOwners();
      setSafeOwners(owners);
    };
    getSafeOwners();
  }, [safeSdk, safeAddress]);

  useEffect(() => {
    if (userNetwork.explorerUrl) setLinkOnScan(userNetwork.explorerUrl);

    if (signatures && signers) {
      if (signedCount !== signatures.split(',').length) {
        setSignedCount(signatures.split(',').length);
      }
    }
  }, [router, searchParams]);

  useEffect(() => {
    if (safeAddress) {
      (async () => {
        await createSdkInstance(safeAddress)
          .then(async (safe: Safe | undefined | null) => {
            if (safe) {
              const ownersList = await safe.getOwners();
              const threshold = await safe.getThreshold();

              setThreshold(threshold);
              setOwnerList(ownersList);
            }
          })
          .catch(error => console.log(`<--${error}-->`));
      })();
    }
  }, [safeAddress, address]);

  // Update the balance
  useEffect(() => {
    if (status === 'success') {
      const pendingBalance = async () => {
        setIsLoading(true);
        const dataAcc = await getInfoByAccount(safeSdk);
        if (!dataAcc) return;

        const { balanceAccount } = dataAcc;
        const parceBalance = ethers.formatEther(String(balanceAccount));

        setBalanceAccount(parceBalance);
      };

      pendingBalance();
      setTimeout(() => setIsLoading(false), 400);
    }
  }, [status, safeSdk]);

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

    if (ownerList && ownerList.find(elem => elem === String(address))) {
      await multySign.signTransactionMulty();
    } else {
      customToasty(
        'Transactions can only be signed by Safe owners. Please change your account',
        'error'
      );
    }
  }, [safeSdk, safeTransaction, safeTxHash, status, ownerList, address]);

  const handleExecute = useCallback(async () => {
    if (!multySign) return;

    if (ownerList && ownerList.find(elem => elem === String(address))) {
      await multySign.executeMulty();
    } else {
      customToasty(
        'Transactions can only be signed by Safe owners. Please change your account',
        'error'
      );
    }
  }, [safeSdk, safeTransaction, searchParams, address, ownerList]);

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
    buttonText = 'Sign again';
  }

  const isCustomRpc = userNetwork && optionsNetwork.find(elem => elem.rpc === userNetwork.rpcUrl);

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
              {userNetwork && formatterIcon(+userNetwork.chainId)}
            </Box>

            <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
              Nonce: {nonceUrl && nonceUrl}
            </WalletTypography>

            <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
              Chain: {userNetwork && userNetwork.chainId}
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

          <SignTransactionInfo {...trxUrlInfo} address={destinationAddress} hash={multySign.hash} />

          <GridButtonStyled>
            {address ? (
              <>
                {buttonText === 'Execute' && (
                  <WalletButton
                    loading={status === 'loading'}
                    variant={status === 'success' ? 'outlined' : 'contained'}
                    styles={styledSecondaryBtn}
                    onClick={handleSignTransaction}
                  >
                    {status === 'signed' ? 'Sign again' : 'Sign Transaction'}
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

          {!isCustomRpc && userNetwork && (
            <WarningBoxStyled>
              <Box display={'flex'} alignItems={'center'} gap={1}>
                <IconWarning color={themeMuiBase.palette.warning} />
                <WalletTypography fontWeight={500}>You are using custom Safe RPC</WalletTypography>
              </Box>
              <WalletTypography fontSize={14} fontWeight={500} style={{ paddingLeft: '26px' }}>
                Safe RPC: {userNetwork.rpcUrl}
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
            <WalletTypography fontWeight={500}>Owners: {ownerList?.length ?? 0}</WalletTypography>
            <WalletTypography fontWeight={500}>Need threshold: {threshold}</WalletTypography>
            <WalletTypography fontWeight={500}>Signed: {signedCount}</WalletTypography>
          </OwnersInfoStyled>
          {safeTransaction &&
            safeAddress &&
            signedCount >= threshold &&
            safeTransactionHash &&
            signatures && (
              <Proof
                owners={safeOwners}
                threshold={threshold}
                signatures={signatures.split(',')}
                txHash={safeTransactionHash}
                transaction={safeTransaction}
                safeAddress={safeAddress}
              />
            )}
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
