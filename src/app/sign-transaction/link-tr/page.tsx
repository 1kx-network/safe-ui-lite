'use client';

import { ChangeEvent, Suspense, useCallback, useEffect, useState } from 'react';
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
import Safe from '@safe-global/protocol-kit';

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
import useActiveSafeAddress from '@/stores/safe-address-store';
import TrBuildComponent, { IBatchTr, RawTr } from '../tr-builder';
import { parseSearchParams } from '@/utils/helpers';
import IconDefaultAddress from '@/assets/svg/defult-icon-address.svg';
import { optionsNetwork } from '@/constants/networks';
import { WarningBoxStyled } from '../sing-transaction.styles';

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
  WrapperAddressBookInputStyled,
  AddressBookInputStyled,
} from './link-tr.styles';

interface IForm {
  safeAddress: string | null;
  nonce: string | null;
  destinationAddress: string | null;
  destinationName: string | null;
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
  destinationName: string | null;
  newThreshold: string | null;
  tokenType: string | null;
  amount: string | null;
  nonce: string | null;
  calldata: string | null;
  signaturesFromQueryArgs: string[] | null;
  signersFromQueryArgs: string[] | null;
  userNetworkTrx: any;
  batchTr?: IBatchTr[] | null;
  rawTr?: RawTr[] | undefined;
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
  signaturesFromQueryArgs: null,
  signersFromQueryArgs: null,
  userNetworkTrx: null,
  batchTr: null,
  rawTr: undefined,
  destinationName: null,
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
      destinationName: searchParams.get('destinationName'),
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
      batchTr: searchParams.get('batchTr'),
    };
  } catch (error) {
    console.error('Error parsing URL:', error);
    customToasty('Error parsing URL');
    return null;
  }
};

const NewSignTransactionComponent = () => {
  const [valueLink, setValueLink] = useState('');
  const [chainIdUrl, setChainIdUrl] = useState<string | null>('0');
  const [typeTrx, setTypeTrx] = useState<keyof ITypeSignTrx | null>(null);
  const [signedCount, setSignedCount] = useState(0);
  const [queryParams, setQueryParams] = useState<IQueryParams | null>(null);

  const { createSdkInstance, getInfoByAccount } = useSafeSdk();
  const { address, chainId } = useWeb3ModalAccount();
  const { safeSdk, setSafeTransaction } = useSafeStore();
  const { switchNetwork } = useSwitchNetwork();
  const { walletProvider } = useWeb3ModalProvider();

  const { threshold, setThreshold, status, setStatus } = useSignStore();

  const { handleSubmit, control, reset, formState } = useForm<IForm>({
    mode: 'onSubmit',
  });

  const [dataQuery, setDataQuery] = useState<IDataQuery>(defaultDataQuery);
  const [ownerList, setOwnerList] = useState<string[] | null>();

  const { setBalanceAccount, setIsLoading } = useActiveSafeAddress();

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
  }, [status]);

  const handleChangeLink = async (value: string) => {
    if (value) {
      try {
        let queryParams: IQueryParams | null = parseParamsFromString(value);

        if (!queryParams) {
          const searchParams = new URLSearchParams(value);

          queryParams = {
            safeAddress: searchParams.get('address'),
            chainIdUrl: searchParams.get('chainId'),
            amount: searchParams.get('amount'),
            destinationAddress: searchParams.get('destinationAddress'),
            destinationName: searchParams.get('destinationName'),
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
            batchTr: searchParams.get('batchTr'),
          };
        }

        const parseRawTr: IBatchTr[] | null = queryParams.batchTr
          ? parseSearchParams(queryParams.batchTr)
          : null;
        const rawTr = parseRawTr ? parseRawTr.map(elem => elem.rawTr) : undefined;

        setQueryParams(queryParams);

        const signatures = queryParams.signatures ? queryParams.signatures.split(',') : [];
        const signers = queryParams.signers ? queryParams.signers.split(',') : [];
        setDataQuery({
          safeTxHash: queryParams.safeTxHash ?? '',
          safeAddress: queryParams.safeAddress ?? '',
          address: queryParams.destinationAddress,
          destinationName: queryParams.destinationName ?? null,
          newThreshold: queryParams.newThreshold,
          tokenType: queryParams.tokenType,
          amount: queryParams.amount,
          nonce: queryParams.nonce,
          calldata: queryParams.calldata,
          signaturesFromQueryArgs: signatures,
          signersFromQueryArgs: signers,
          userNetworkTrx: queryParams.userNetworkTrx
            ? JSON.parse(queryParams.userNetworkTrx)
            : queryParams.userNetworkTrx,
          batchTr: parseRawTr,
          rawTr: rawTr,
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
        signatures: dataQuery.signaturesFromQueryArgs,
        signers: dataQuery.signersFromQueryArgs,
      })
        .filter(([, value]) => value !== null && value !== undefined && value !== '')
        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
        .join('&');

      const newQueryLink = `${window.location.origin}${routes.signTransaction}?${queryParamsString}`;

      setNewQueryLink(queryParamsString);
      setNewUrlLink(newQueryLink);
    }
  }, [queryParams, dataQuery.signaturesFromQueryArgs, dataQuery.signersFromQueryArgs]);

  useEffect(() => {
    if (dataQuery.safeAddress) {
      (async () => {
        if (!safeFromDb && dataQuery.safeAddress !== '') {
          await setDataDB(dataQuery.safeAddress, {
            address: dataQuery.safeAddress,
            transactions: [],
          });
        }

        await createSdkInstance(dataQuery.safeAddress)
          .then(async (safe: Safe | undefined | null) => {
            if (safe) {
              const threshold = await safe.getThreshold();
              const ownersList = await safe.getOwners();

              setOwnerList(ownersList);
              setThreshold(threshold);
            }
          })
          .catch(error => console.error(`<--${error}-->`));
      })();
    }
  }, [address, dataQuery.safeAddress]);

  const onSubmit: SubmitHandler<any> = () => {};

  const addNetworkForUserSign = async () => {
    if (!dataQuery.userNetworkTrx) return;
    const userNetwork = dataQuery.userNetworkTrx as INetworkDB;
    const rpc = userNetwork.rpcUrl ?? userNetwork.publicRpcUri?.value;
    const existingNetwork = networks.find(network => network.rpcUrl === rpc);

    const decimalChainId = ethers.toBeHex(userNetwork.chainId);

    if (!existingNetwork) {
      await setNetworkDB(userNetwork);

      if (dataQuery.safeAddress && dataQuery.safeAddress !== '') {
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
          rpcUrls: [rpc],
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
    if (
      transaction &&
      transaction.signatures.length > (dataQuery.signaturesFromQueryArgs?.length ?? 0)
    ) {
      const { signatures, signers } = multySign.getSignaturesFromDbMulty();
      setDataQuery(prev => ({
        ...prev,
        signatures,
        signers,
      }));
    }
  }, [transaction, dataQuery.signaturesFromQueryArgs]);

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

  useEffect(() => {
    if (transaction && transaction.signatures) {
      if (signedCount !== transaction.signatures.length) {
        setSignedCount(transaction.signatures.length);
      }
    }
  }, [transaction, address]);

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

  const recipientAddress =
    TYPE_SIGN_TRX.ADD_OWNER !== typeTrx &&
    TYPE_SIGN_TRX.REMOVE_OWNER !== typeTrx &&
    TYPE_SIGN_TRX.TR_BUILD !== typeTrx;

  const userNetworkInfo = dataQuery.userNetworkTrx;
  const isCustomRpc =
    dataQuery.userNetworkTrx &&
    !optionsNetwork.some(elem => elem.rpc === dataQuery.userNetworkTrx.rpcUrl);

  return (
    <WalletLayout>
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
                          <ItemInfoStyled>{field.value ?? 1}</ItemInfoStyled>
                        </Box>
                      )}
                    />
                  </Box>

                  {recipientAddress && (
                    <Controller
                      control={control}
                      name="destinationAddress"
                      render={({ field }) => (
                        <Box width={'100%'}>
                          <ItemInfoLabelStyled>Recipient Address</ItemInfoLabelStyled>

                          {!formState.defaultValues?.destinationName ? (
                            <ItemInfoStyled>{field.value}</ItemInfoStyled>
                          ) : (
                            <WrapperAddressBookInputStyled>
                              <IconDefaultAddress width="25px" height="25px" />
                              <AddressBookInputStyled>
                                <WalletTypography component="p" fontSize={14}>
                                  {formState.defaultValues?.destinationName}
                                </WalletTypography>

                                <WalletTypography component="p" fontSize={14}>
                                  {field.value}
                                </WalletTypography>
                              </AddressBookInputStyled>
                            </WrapperAddressBookInputStyled>
                          )}
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
                              {(userNetworkInfo.chainId || field.value) &&
                                formatterIcon(userNetworkInfo.chainId || field.value)}
                              {userNetworkInfo.currency ?? field.value}
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
                              {userNetworkInfo.chainId &&
                                formatterIcon(
                                  userNetworkInfo.chainId ? +userNetworkInfo.chainId : 0
                                )}
                              {userNetworkInfo.name ?? field.value}
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
                          <Box display={'flex'} flexDirection={'column'} width="25%">
                            <ItemInfoLabelStyled>Network</ItemInfoLabelStyled>
                            <ItemInfoStyled>
                              {userNetworkInfo?.chainId &&
                                formatterIcon(
                                  userNetworkInfo.chainId ? +userNetworkInfo.chainId : 0
                                )}
                              {userNetworkInfo.name ?? field.value}
                            </ItemInfoStyled>
                          </Box>
                        )}
                      />
                    </Box>
                  )}

                  {TYPE_SIGN_TRX.TR_BUILD === typeTrx && (
                    <TrBuildComponent batchTrProps={dataQuery.batchTr} />
                  )}

                  <Box width={'60%'} display={'flex'} flexDirection={'column'}>
                    {transaction?.signatures.length && (
                      <ItemInfoLabelStyled>Signers</ItemInfoLabelStyled>
                    )}
                    <SignersBoxStyled>
                      {transaction?.signatures ? (
                        transaction?.signatures.map(elem => (
                          <ItemInfoStyled key={elem.signer}>{elem.signer}</ItemInfoStyled>
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
          {isCustomRpc && dataQuery.userNetworkTrx && (
            <WarningBoxStyled style={{ marginTop: '1rem' }}>
              <Box display={'flex'} alignItems={'center'} gap={1}>
                <IconWarning color={themeMuiBase.palette.warning} />
                <WalletTypography fontWeight={500}>You are using custom Safe RPC</WalletTypography>
              </Box>
              <WalletTypography fontSize={14} fontWeight={500} style={{ paddingLeft: '26px' }}>
                Safe RPC: {dataQuery.userNetworkTrx.rpcUrl}
              </WalletTypography>
            </WarningBoxStyled>
          )}
        </WalletPaper>

        {dataQuery.signaturesFromQueryArgs && dataQuery.signaturesFromQueryArgs?.length > 0 ? (
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
