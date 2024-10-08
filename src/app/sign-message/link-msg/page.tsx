'use client';

import { ChangeEvent, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import * as ethers from 'ethers';
import { Box } from '@mui/system';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  useSwitchNetwork,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from '@web3modal/ethers/react';
import { useLiveQuery } from 'dexie-react-hooks';
import Link from 'next/link';

import IconWarning from '@/assets/svg/notifications/alert.svg';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import { ITypeSignTrx, TYPE_SIGN_TRX } from '@/constants/type-sign';
import { formatterIcon } from '@/utils/icon-formatter';
import { formattedLabel, formattedName } from '@/utils/formatters';
import useSignStore from '@/stores/sign-store';
import { useSafeSdk } from '@/hooks/useSafeSdk';
import useSafeStore from '@/stores/safe-store';
import { INetworkDB, db } from '@/db';
import { useMultySign } from '@/hooks/useMultySign';
import { customToasty } from '@/components';
import { setNetworkDB, setDataDB } from '@/db/set-info';
import { networks } from '@/context/networks';
import { IQueryParams } from '@/constants/interfaces';
import routes from '@/app/routes';
import { WalletButton, WalletInput, WalletLayout, WalletPaper, WalletTypography } from '@/ui-kit';
import OpenInNewIcon from '@/assets/svg/open-in-new.svg';
import CopyIcon from '@/assets/svg/copy.svg';
import { WarningBoxStyled } from '@/app/sign-transaction/sing-transaction.styles';
import { optionsNetwork } from '@/constants/networks';

import {
  BoxLinkStyled,
  WrapperStyled,
  BoxAmountStyled,
  styledBtnCheck,
  ItemInfoStyled,
  ItemInfoLabelStyled,
  styledBorderBox,
  SignersBoxStyled,
  SingInfoStyled,
  styledSecondaryBtn,
} from './link-msg.styles';

interface IForm {
  safeAddress: string | null;
  nonce: string | null;
  destinationAddress: string | null;
  amount: string | null;
  tokenType: string | null;
  signers: string[] | null;
  chainIdUrl: string | null;
  networkName: string | null;
  newThreshold: string | null;
}

interface IDataQuery {
  safeTxHash: string;
  safeAddress: string;
  address: string | null;
  newThreshold: string | null;
  tokenType: string | null;
  amount: string | null;
  nonce: string | null;
  calldata: string | null;
  signatures: string[] | null;
  signers: string[] | null;
  userNetworkTrx: string | null;
}

const defaultDataQuery: IDataQuery = {
  safeTxHash: '',
  safeAddress: '',
  calldata: '',
  address: null,
  newThreshold: null,
  tokenType: null,
  amount: null,
  nonce: null,
  signatures: null,
  signers: null,
  userNetworkTrx: null,
};

const parseParamsFromString = (input: string): IQueryParams | null => {
  try {
    const url = new URL(input);
    const searchParams = url.searchParams;

    return {
      safeAddress: searchParams.get('address'),
      chainIdUrl: searchParams.get('chainId'),
      amount: searchParams.get('amount'),
      destinationAddress: searchParams.get('destinationAddress'),
      safeTxHash: searchParams.get('safeTxHash'),
      tokenType: searchParams.get('tokenType'),
      networkName: searchParams.get('networkName'),
      thresholdUrl: searchParams.get('thresholdUrl'),
      newThreshold: searchParams.get('newThreshold'),
      nonce: searchParams.get('nonce'),
      calldata: searchParams.get('calldata'),
      userNetworkTrx: searchParams.get('userNetworkTrx'), // JSON.parse
      signatures: searchParams.get('signatures'),
      signers: searchParams.get('signers'),
      typeSignTrx: searchParams.get('typeSignTrx') as keyof ITypeSignTrx | null,
    };
  } catch (error) {
    console.error('Error parsing URL:', error);
    return null;
  }
};

const NewSignTransactionComponent = () => {
  const [valueLink, setValueLink] = useState('');
  const [chainIdUrl, setChainIdUrl] = useState<string | null>('0');
  const [typeTrx, setTypeTrx] = useState<keyof ITypeSignTrx | null>(null);
  const [signedCount, setSignedCount] = useState(0);
  const [queryParams, setuQeryParams] = useState<IQueryParams | null>(null);

  const { createSdkInstance } = useSafeSdk();
  const { address, chainId } = useWeb3ModalAccount();
  const { safeSdk, setSafeTransaction } = useSafeStore();
  const { switchNetwork } = useSwitchNetwork();
  const { walletProvider } = useWeb3ModalProvider();

  const { threshold, setThreshold, status, setStatus } = useSignStore();

  const { handleSubmit, control, reset } = useForm<IForm>({
    mode: 'onSubmit',
  });

  const [dataQuery, setDataQuery] = useState<IDataQuery>(defaultDataQuery);
  const [ownerList, setOwnerList] = useState<string[] | null>();

  const handleChangeLink = async (value: string) => {
    if (value) {
      try {
        let queryParams = parseParamsFromString(value);

        if (!queryParams) {
          const searchParams = new URLSearchParams(value);

          queryParams = {
            safeAddress: searchParams.get('address'),
            chainIdUrl: searchParams.get('chainId'),
            amount: searchParams.get('amount'),
            destinationAddress: searchParams.get('destinationAddress'),
            safeTxHash: searchParams.get('safeTxHash'),
            tokenType: searchParams.get('tokenType'),
            networkName: searchParams.get('networkName'),
            thresholdUrl: searchParams.get('thresholdUrl'),
            newThreshold: searchParams.get('newThreshold'),
            nonce: searchParams.get('nonce'),
            calldata: searchParams.get('calldata'),
            userNetworkTrx: searchParams.get('userNetworkTrx'), // JSON.parse
            signatures: searchParams.get('signatures'),
            signers: searchParams.get('signers'),
            typeSignTrx: searchParams.get('typeSignTrx') as keyof ITypeSignTrx | null,
          };
        }

        setuQeryParams(queryParams);
        createSdkInstance(queryParams.safeAddress);

        const signatures = queryParams.signatures ? queryParams.signatures.split(',') : [];
        const signers = queryParams.signers ? queryParams.signers.split(',') : [];
        setDataQuery({
          safeTxHash: queryParams.safeTxHash ?? '',
          safeAddress: queryParams.safeAddress ?? '',
          address: queryParams.destinationAddress,
          newThreshold: queryParams.newThreshold,
          tokenType: queryParams.tokenType,
          amount: queryParams.amount,
          nonce: queryParams.nonce,
          calldata: queryParams.calldata,
          signatures,
          signers,
          userNetworkTrx: queryParams.userNetworkTrx,
        });

        setChainIdUrl(queryParams.chainIdUrl);
        setTypeTrx(queryParams.typeSignTrx);

        if (queryParams.userNetworkTrx) (async () => await addNetworkForUserSign())();

        reset({ ...queryParams, signers: queryParams.signers?.split(',') ?? [] });
        setValueLink(JSON.stringify(queryParams));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const [newUrlLink, setNewUrlLink] = useState<string | null>(null);
  const [newQueryLink, setNewQueryLink] = useState<string | null>(null);

  useEffect(() => {
    if (queryParams) {
      const queryParamsString = Object.entries({
        ...queryParams,
        address: queryParams.safeAddress,
        chainId: queryParams.chainIdUrl,
        signatures: dataQuery.signatures,
        signers: dataQuery.signers,
      })
        .filter(([, value]) => value !== null && value !== undefined && value !== '')
        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
        .join('&');

      const newQueryLink = `${window.location.origin}${routes.signTransaction}?${queryParamsString}`;

      setNewQueryLink(queryParamsString);
      setNewUrlLink(newQueryLink);
    }
  }, [queryParams, dataQuery.signatures, dataQuery.signers]);

  useEffect(() => {
    if (safeSdk) {
      (async () => {
        if (!safeFromDb && dataQuery.safeAddress !== '') {
          await setDataDB(dataQuery.safeAddress, {
            address: dataQuery.safeAddress,
            transactions: [],
          });
        }
        const threshold = await safeSdk.getThreshold();
        const ownersList = await safeSdk.getOwners();

        setOwnerList(ownersList);
        setThreshold(threshold);
      })();
    } else {
      createSdkInstance(dataQuery.safeAddress);
    }
  }, [safeSdk, address, dataQuery.safeAddress]);

  const onSubmit: SubmitHandler<any> = () => {};

  const addNetworkForUserSign = async () => {
    if (!dataQuery.userNetworkTrx) return;
    const userNetwork = JSON.parse(dataQuery.userNetworkTrx) as INetworkDB;
    const existingNetwork = networks.find(network => network.rpcUrl === userNetwork.rpcUrl);

    const decimalChainId = ethers.toBeHex(userNetwork.chainId);

    if (!existingNetwork) {
      await setNetworkDB({
        ...userNetwork,
        //@ts-ignore rpcUri can be get from opensean
        rpcUrl: userNetwork.rpcUri.value ?? userNetwork.rpcUrl,
        //@ts-ignore
        name: userNetwork.chainName ?? userNetwork.name,
      });

      if (dataQuery.safeAddress) {
        await setDataDB(dataQuery.safeAddress, {});
      }

      networks.push(userNetwork);

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
    if (dataQuery.safeAddress) {
      createSdkInstance(dataQuery.safeAddress);
    }
  }, [address]);

  useEffect(() => {
    if (dataQuery.signatures && dataQuery.signers) {
      if (signedCount !== dataQuery.signatures.length) {
        setSignedCount(dataQuery.signatures.length);
      }
    }
  }, [dataQuery.signatures, dataQuery.signers, address]);

  const safeFromDb = useLiveQuery(
    () =>
      db.safes
        .where('address')
        .equals(dataQuery.safeAddress ?? '')
        .first(),
    [dataQuery.safeTxHash]
  );
  const transaction = safeFromDb?.transactions.find(tx => tx.hash === dataQuery.safeTxHash);

  useEffect(() => {
    if (transaction && transaction.signatures.length !== dataQuery.signatures?.length) {
      const { signatures, signers } = multySign.getSignaturesFromDbMulty();
      setDataQuery(prev => ({
        ...prev,
        signatures,
        signers,
      }));
    }
  }, [transaction, dataQuery.signatures]);

  const multySign = useMultySign({
    ...dataQuery,
    safeAddress: dataQuery.safeAddress ?? '',
    safeTxHash: dataQuery.safeTxHash ?? '',
    chainIdUrl,
    typeSignTrx: typeTrx ?? TYPE_SIGN_TRX.SEND_TOKEN,
    mode: 'runtime',
  });

  const handleTransaction = useCallback(
    async (allowExec = true) => {
      if (status === 'success') return;

      if (ownerList && ownerList.find(elem => elem === String(address))) {
        signedCount >= threshold && allowExec
          ? await multySign.executeMulty()
          : await multySign.signTransactionMulty();
      } else {
        customToasty(
          'Transactions can only be signed by Safe owners. Please change your account',
          'error'
        );
      }
    },
    [address, ownerList, status, signedCount, threshold]
  );

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

  const handleCopy = (paramsCopy: string | null) => {
    if (!paramsCopy) return;
    navigator.clipboard.writeText(paramsCopy);
    customToasty('New link was copy!', 'success');
  };

  const handleReset = () => {
    setSafeTransaction(null);
    setValueLink('');
    setChainIdUrl(null);
    setTypeTrx(null);
    setSignedCount(0);
    setStatus('');
    setDataQuery(defaultDataQuery);
    setOwnerList(null);
    reset(defaultDataQuery);
  };

  const userNetwork = dataQuery.userNetworkTrx && JSON.parse(dataQuery.userNetworkTrx);
  const userNetworkUri = userNetwork?.rpcUri.value;

  const isCustomRpc = useMemo(
    () =>
      userNetwork &&
      !optionsNetwork.some(
        elem => elem.rpc === (userNetwork.rpcUrl !== '' ? userNetwork.rpcUrl : userNetworkUri)
      ),
    [userNetwork, optionsNetwork]
  );

  return (
    <WalletLayout hideSidebar>
      <WrapperStyled>
        <WalletPaper>
          <Box display={'flex'} alignItems={'center'} gap={2} mb={2}>
            <WalletTypography fontSize={22} fontWeight={600}>
              Sign Transaction
            </WalletTypography>
          </Box>

          <BoxLinkStyled>
            <WalletInput
              label="Enter your link or query params"
              value={valueLink}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeLink(e.target.value)}
            />
            <WalletButton variant="contained" onClick={handleReset} styles={styledBtnCheck}>
              Reset
            </WalletButton>
          </BoxLinkStyled>

          {valueLink && (
            <>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box display={'flex'} flexDirection={'column'} gap={2} sx={styledBorderBox}>
                  {typeTrx && (
                    <Box my={1} pl={themeMuiBase.spacing(2)}>
                      <WalletTypography fontWeight={500}>
                        Transaction type: {formattedName(typeTrx)}
                      </WalletTypography>
                    </Box>
                  )}
                  <Box display={'flex'} gap={2} alignItems={'center'}>
                    <Controller
                      control={control}
                      name="safeAddress"
                      render={({ field }) => (
                        <Box width={'100%'}>
                          <ItemInfoLabelStyled>Safe address</ItemInfoLabelStyled>
                          <ItemInfoStyled>{field.value}</ItemInfoStyled>
                        </Box>
                      )}
                    />
                    <Controller
                      control={control}
                      name="nonce"
                      render={({ field }) => (
                        <Box width={'120px'}>
                          <ItemInfoLabelStyled>Nonce#</ItemInfoLabelStyled>
                          <ItemInfoStyled>{field.value}</ItemInfoStyled>
                        </Box>
                      )}
                    />
                  </Box>

                  {TYPE_SIGN_TRX.ADD_OWNER !== typeTrx &&
                    TYPE_SIGN_TRX.REMOVE_OWNER !== typeTrx && (
                      <Controller
                        control={control}
                        name="destinationAddress"
                        render={({ field }) => (
                          <Box width={'100%'}>
                            <ItemInfoLabelStyled>Recipient Address</ItemInfoLabelStyled>
                            <ItemInfoStyled>{field.value}</ItemInfoStyled>
                          </Box>
                        )}
                      />
                    )}

                  {TYPE_SIGN_TRX.SEND_TOKEN === typeTrx && (
                    <BoxAmountStyled>
                      <Controller
                        control={control}
                        name="amount"
                        render={({ field }) => (
                          <Box display={'flex'} flexDirection={'column'} width="50%">
                            <ItemInfoLabelStyled>Amount</ItemInfoLabelStyled>
                            <ItemInfoStyled>{field.value}</ItemInfoStyled>
                          </Box>
                        )}
                      />

                      <Controller
                        control={control}
                        name="tokenType"
                        render={({ field }) => (
                          <Box display={'flex'} flexDirection={'column'} width="25%">
                            <ItemInfoLabelStyled>Type currency</ItemInfoLabelStyled>
                            <ItemInfoStyled>
                              {field.value && formatterIcon(field.value)} {field.value}
                            </ItemInfoStyled>
                          </Box>
                        )}
                      />

                      <Controller
                        control={control}
                        name="networkName"
                        render={({ field }) => (
                          <Box display={'flex'} flexDirection={'column'} width="25%">
                            <ItemInfoLabelStyled>Network</ItemInfoLabelStyled>
                            <ItemInfoStyled>
                              {field.value && formatterIcon(chainIdUrl ? +chainIdUrl : 0)}
                              {field.value}
                            </ItemInfoStyled>
                          </Box>
                        )}
                      />
                    </BoxAmountStyled>
                  )}

                  {TYPE_SIGN_TRX.CHANGE_THRESHOLD === typeTrx && (
                    <Controller
                      control={control}
                      name="newThreshold"
                      render={({ field }) => (
                        <Box width={'20%'}>
                          <ItemInfoLabelStyled>New count threshold</ItemInfoLabelStyled>
                          <ItemInfoStyled style={{ width: 'fit-content' }}>
                            {field.value}
                          </ItemInfoStyled>
                        </Box>
                      )}
                    />
                  )}

                  {(TYPE_SIGN_TRX.ADD_OWNER === typeTrx ||
                    TYPE_SIGN_TRX.REMOVE_OWNER === typeTrx) && (
                    <Box display={'flex'} alignItems={'center'} gap={2}>
                      <Controller
                        control={control}
                        name="destinationAddress"
                        render={({ field }) => (
                          <Box width={'70%'}>
                            <ItemInfoLabelStyled>{formattedName(typeTrx)}</ItemInfoLabelStyled>
                            <ItemInfoStyled>{field.value}</ItemInfoStyled>
                          </Box>
                        )}
                      />

                      <Controller
                        control={control}
                        name="networkName"
                        render={({ field }) => (
                          <Box display={'flex'} flexDirection={'column'} width="30%">
                            <ItemInfoLabelStyled>Network</ItemInfoLabelStyled>
                            <ItemInfoStyled>
                              {field.value && formatterIcon(chainIdUrl ? +chainIdUrl : 0)}
                              {field.value}
                            </ItemInfoStyled>
                          </Box>
                        )}
                      />
                    </Box>
                  )}

                  <Box width={'60%'} display={'flex'} flexDirection={'column'}>
                    <ItemInfoLabelStyled>Signers</ItemInfoLabelStyled>
                    <SignersBoxStyled>
                      {dataQuery.signers ? (
                        dataQuery.signers.map(elem => (
                          <ItemInfoStyled key={elem}>{elem}</ItemInfoStyled>
                        ))
                      ) : (
                        <ItemInfoStyled>0x</ItemInfoStyled>
                      )}
                    </SignersBoxStyled>
                  </Box>

                  <Box width={'20%'}>
                    <ItemInfoLabelStyled>Need threshold</ItemInfoLabelStyled>
                    <ItemInfoStyled style={{ width: 'fit-content' }}>{threshold}</ItemInfoStyled>
                  </Box>
                </Box>
              </form>

              <Box display={'flex'} justifyContent={'space-between'} mt={7}>
                <Link href={routes.home} style={{ width: '100%' }}>
                  <WalletButton variant="outlined">Back</WalletButton>
                </Link>
                <>
                  {buttonText === 'Execute' && (
                    <WalletButton
                      disabled={status === 'loading'}
                      variant={status === 'success' ? 'outlined' : 'contained'}
                      styles={styledSecondaryBtn}
                      onClick={() => handleTransaction(false)}
                    >
                      {status === 'signed' ? 'Sign again' : 'Sign Transaction'}
                    </WalletButton>
                  )}
                  <WalletButton
                    loading={status === 'loading'}
                    variant="contained"
                    onClick={() => handleTransaction(true)}
                  >
                    {buttonText}
                  </WalletButton>
                </>
              </Box>
            </>
          )}

          {isCustomRpc && userNetwork && (
            <WarningBoxStyled style={{ marginTop: '1rem' }}>
              <Box display={'flex'} alignItems={'center'} gap={1}>
                <IconWarning color={themeMuiBase.palette.warning} />
                <WalletTypography fontWeight={500}>You are using custom Safe RPC</WalletTypography>
              </Box>
              <WalletTypography fontSize={14} fontWeight={500} style={{ paddingLeft: '26px' }}>
                Safe RPC: {JSON.parse(userNetwork).rpcUrl}
              </WalletTypography>
            </WarningBoxStyled>
          )}
        </WalletPaper>

        {dataQuery.signatures && dataQuery.signatures?.length > 0 ? (
          <WalletPaper style={{ marginTop: themeMuiBase.spacing(3) }}>
            <Box display={'flex'} flexDirection={'column'} gap={5}>
              <Box>
                <WalletTypography fontWeight={500}>Url params with information</WalletTypography>
                <Box display={'flex'} alignItems={'center'} gap={3} mt={3}>
                  <SingInfoStyled>{formattedLabel(`${newUrlLink}`, 25, 35)}</SingInfoStyled>

                  <Link href={newUrlLink ?? '/'} target="_blanck">
                    <OpenInNewIcon width="19px" height="18px" />
                  </Link>
                  <CopyIcon
                    width="18px"
                    height="19px"
                    cursor="pointer"
                    onClick={() => handleCopy(newUrlLink)}
                  />
                </Box>
              </Box>
              <Box>
                <WalletTypography fontWeight={500}>Query params with information</WalletTypography>
                <Box display={'flex'} alignItems={'center'} gap={3} mt={3}>
                  <SingInfoStyled>{formattedLabel(`${newQueryLink}`, 25, 35)}</SingInfoStyled>
                  <CopyIcon
                    width="18px"
                    height="19px"
                    cursor="pointer"
                    onClick={() => handleCopy(newQueryLink)}
                  />
                </Box>
              </Box>
            </Box>
          </WalletPaper>
        ) : null}
      </WrapperStyled>
    </WalletLayout>
  );
};

export default function NewSignTransaction() {
  return (
    <Suspense>
      <NewSignTransactionComponent />
    </Suspense>
  );
}
