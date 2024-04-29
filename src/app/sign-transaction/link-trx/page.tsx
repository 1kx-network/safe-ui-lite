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
import { useRouter } from 'next/navigation';
import { useLiveQuery } from 'dexie-react-hooks';
import { SafeTransaction } from '@safe-global/safe-core-sdk-types';
import Link from 'next/link';

import { themeMuiBase } from '@/assets/styles/theme-mui';
import { ITypeSignTrx, TYPE_SIGN_TRX } from '@/constants/type-sign';
import { formatterIcon } from '@/utils/icon-formatter';
import { formattedLabel, formattedName } from '@/utils/foramtters';
import useSignStore from '@/stores/sign-store';
import { useSafeSdk } from '@/hooks/useSafeSdk';
import useSafeStore from '@/stores/safe-store';
import { INetworkDB, db } from '@/db';
import { ICheckAndSwitchNetwork } from '@/hooks/useMultySign';
import { customToasty } from '@/components';
import { returnTransactionObj } from '@/utils/new-trx-functionals';
import { addCustomNetworkDB, setDataDB } from '@/db/set-info';
import { networks } from '@/context/networks';
import { IQueryParams } from '@/constants/interfaces';
import routes from '@/app/routes';
import { WalletButton, WalletInput, WalletLayout, WalletPaper, WalletTypography } from '@/ui-kit';
import OpenInNewIcon from '@/assets/svg/open-in-new.svg';
import CopyIcon from '@/assets/svg/copy.svg';

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
} from './link-trx.styles';

interface IForm {
  safeAddress: string | null;
  nonceUrl: string | null;
  destinationAddress: string | null;
  amount: string | null;
  tokenType: string | null;
  signers: string | null;
  chainIdUrl: string | null;
  networkName: string | null;
  newThreshold: string | null;
}

interface IDataQuery {
  safeTxHash: string | null;
  safeAddress: string | null;
  address: string | null;
  newThreshold: string | null;
  tokenType: string | null;
  amount: string | null;
  nonce: string | null;
  signatures: string | null;
  signers: string | null;
  userNetworkTrxUrl: string | null;
}

const defaultDataQuery: IDataQuery = {
  safeTxHash: null,
  safeAddress: null,
  address: null,
  newThreshold: null,
  tokenType: null,
  amount: null,
  nonce: null,
  signatures: null,
  signers: null,
  userNetworkTrxUrl: null,
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
      nonceUrl: searchParams.get('nonce'),
      userNetworkTrxUrl: searchParams.get('userNetworkTrx'), // JSON.parse
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
  const [chainIdUrl, setChainIdUrl] = useState<string | number | null>(0);
  const [typeTrx, setTypeTrx] = useState<keyof ITypeSignTrx | null>(null);
  const [signedCount, setSignedCount] = useState(0);
  const [queryParams, setuQeryParams] = useState<IQueryParams | null>(null);

  const { createTrancationERC20, createSdkInstance } = useSafeSdk();
  const { address, chainId } = useWeb3ModalAccount();
  const { safeTransaction, safeSdk, setSafeTransaction } = useSafeStore();
  const { switchNetwork } = useSwitchNetwork();
  const router = useRouter();
  const { walletProvider } = useWeb3ModalProvider();

  const { threshold, setThreshold, status, setStatus } = useSignStore();

  const { handleSubmit, control, reset } = useForm<IForm>({
    mode: 'onSubmit',
  });

  const [conditionMulty, setConditionMulty] = useState(false);
  const [dataQuery, setDataQuery] = useState<IDataQuery>(defaultDataQuery);
  const [ownerList, setOwnerList] = useState<string[] | null>();
  const { REMOVE_OWNER, ADD_OWNER, SEND_TOKEN, CHANGE_THRESHOLD } = TYPE_SIGN_TRX;

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
            nonceUrl: searchParams.get('nonce'),
            userNetworkTrxUrl: searchParams.get('userNetworkTrx'), // JSON.parse
            signatures: searchParams.get('signatures'),
            signers: searchParams.get('signers'),
            typeSignTrx: searchParams.get('typeSignTrx') as keyof ITypeSignTrx | null,
          };
        }

        setuQeryParams(queryParams);
        createSdkInstance(queryParams.safeAddress);

        setDataQuery({
          safeTxHash: queryParams.safeTxHash,
          safeAddress: queryParams.safeAddress,
          address: queryParams.destinationAddress,
          newThreshold: queryParams.newThreshold,
          tokenType: queryParams.tokenType,
          amount: queryParams.amount,
          nonce: queryParams.nonceUrl,
          signatures: queryParams.signatures,
          signers: queryParams.signers,
          userNetworkTrxUrl: queryParams.userNetworkTrxUrl,
        });

        setChainIdUrl(Number(queryParams.chainIdUrl));
        setTypeTrx(queryParams.typeSignTrx);
        setConditionMulty(!queryParams.safeAddress || !queryParams.safeTxHash);

        if (queryParams.userNetworkTrxUrl) (async () => await addNetworkForUserSign())();

        reset(queryParams);
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
        const threshold = await safeSdk.getThreshold();
        const ownersList = await safeSdk.getOwners();

        setOwnerList(ownersList);
        setThreshold(threshold);
      })();
    } else {
      createSdkInstance(dataQuery.safeAddress);
    }
  }, [safeSdk, address]);

  const onSubmit: SubmitHandler<any> = () => {};

  const addNetworkForUserSign = async () => {
    if (!dataQuery.userNetworkTrxUrl) return;
    const userNetwork = JSON.parse(dataQuery.userNetworkTrxUrl) as INetworkDB;
    const existingNetwork = networks.find(network => network.rpcUrl === userNetwork.rpcUrl);

    const decimalChainId = ethers.toBeHex(userNetwork.chainId);

    if (!existingNetwork) {
      await addCustomNetworkDB(userNetwork);

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
      if (signedCount !== dataQuery.signatures.split(',').length) {
        setSignedCount(dataQuery.signatures.split(',').length);
      }

      if (status !== 'signed' && dataQuery.signers.split(',').some(signer => signer === address)) {
        setStatus('signed');
      } else {
        setStatus('');
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

  const switchNetworkMulty = async (props: ICheckAndSwitchNetwork) => {
    if (conditionMulty) return;
    const { chainIdUrl, chainId, switchNetwork, open } = props;
    const shouldSwitchNetwork = chainIdUrl && +chainIdUrl !== chainId;
    const isNewNetwork = !chainId && chainIdUrl;

    if (shouldSwitchNetwork) {
      switchNetwork(+chainIdUrl);
    } else if (isNewNetwork) {
      open();
      switchNetwork(+chainIdUrl);
    }
    getOwners();
  };

  const getOwners = async () => {
    if (conditionMulty) return;
    if (!safeSdk) return;

    const threshold = await safeSdk.getThreshold();
    setThreshold(threshold);
    setStatus('');
  };

  const trxResponseByType = async () => {
    if (!safeSdk || !dataQuery.address) return null;

    let resTrx: SafeTransaction | null = null;

    switch (typeTrx) {
      case ADD_OWNER:
        resTrx = await safeSdk.createAddOwnerTx({
          ownerAddress: dataQuery.address,
        });
        break;

      case REMOVE_OWNER:
        resTrx = await safeSdk.createRemoveOwnerTx({
          ownerAddress: dataQuery.address,
          threshold: dataQuery.newThreshold ? +dataQuery.newThreshold : 1,
        });
        break;

      case CHANGE_THRESHOLD:
        resTrx = await safeSdk.createChangeThresholdTx(
          dataQuery.newThreshold ? +dataQuery.newThreshold : 1
        );
        break;

      default:
        break;
    }

    return resTrx;
  };

  useEffect(() => {
    switchNetworkMulty({ chainIdUrl: String(chainIdUrl), chainId, switchNetwork, open });

    if (conditionMulty) return;

    const conditionForCreateTrx =
      dataQuery.amount && dataQuery.address && !safeTransaction && safeSdk && dataQuery.safeAddress;
    const pendingCreateTrxData = async () => {
      if (!safeSdk || !conditionForCreateTrx) return;
      if (typeTrx === SEND_TOKEN) {
        if (
          !chainId ||
          !safeSdk ||
          !dataQuery.tokenType ||
          !transaction ||
          !dataQuery.address ||
          !dataQuery.amount
        )
          return null;
        const data = transaction.calldata;
        const objTrx = await returnTransactionObj(
          dataQuery.address,
          dataQuery.amount,
          dataQuery.tokenType,
          chainId,
          data,
          createTrancationERC20
        );

        if (!objTrx) return;
        const safeTransaction = await safeSdk.createTransaction({
          transactions: [objTrx],
          options: {
            nonce: dataQuery.nonce ? +dataQuery.nonce : 0,
          },
        });

        setSafeTransaction(safeTransaction);
        return;
      }

      const resTransaction = await trxResponseByType();
      if (!resTransaction) return;
      setSafeTransaction(resTransaction);
    };

    pendingCreateTrxData();
  }, [safeSdk, conditionMulty, chainId]);

  const getSignaturesFromDbMulty = useCallback(() => {
    return (
      transaction?.signatures.reduce(
        (acc: { signatures: string[]; signers: string[] }, sig) => {
          acc.signatures.push(sig.data);
          acc.signers.push(sig.signer);
          return acc;
        },
        { signatures: [], signers: [] }
      ) ?? { signatures: [], signers: [] }
    );
  }, [transaction, chainId, address]);

  const getSignaturesMulty = useCallback(() => {
    const signatures = dataQuery.signatures ? dataQuery.signatures.split(',') : [];
    const signers = dataQuery.signers ? dataQuery.signers.split(',') : [];

    if (transaction) {
      const { signatures: signaturesFromDb, signers: signersFromDb } = getSignaturesFromDbMulty();
      signersFromDb.map((s, idx) => {
        if (!signers.includes(s)) {
          signers.push(s);
          signatures.push(signaturesFromDb[idx]);
        }
      });
    }

    return { signatures, signers };
  }, [transaction, chainId, address, dataQuery.signatures, dataQuery.signers]);

  const saveSignaturesMulty = useCallback(
    (signatures: string[], signers: string[]) => {
      if (conditionMulty) return;

      if (signatures.length === 0 || signatures[0] === '') {
        return;
      }

      const uniqueSignatures = Array.from(new Set(signatures));
      const uniqueSigners = Array.from(new Set(signers));

      const encodedSignatures = uniqueSignatures.map(sig => encodeURIComponent(sig)).join(',');
      const encodedSigners = uniqueSigners.map(sig => encodeURIComponent(sig)).join(',');

      setDataQuery(prev => ({
        ...prev,
        signatures: encodedSignatures,
        signers: encodedSigners,
      }));

      if (transaction) {
        const { signers: signersFromDb } = getSignaturesFromDbMulty();
        if (transaction.signatures.length !== signers.length) {
          db.transactions.where({ hash: transaction.hash }).modify(trx => {
            signers.map((s, idx) => {
              if (!signersFromDb.includes(s)) {
                trx.signatures.push({ data: signatures[idx], signer: signers[idx] });
              }
            });
          });
        }
      }
    },
    [router, transaction, chainId, dataQuery, address]
  );

  const signTransactionMulty = useCallback(async () => {
    if (status === 'signed') {
      customToasty('This wallet has already signed', 'error');
      return;
    }

    if (conditionMulty) return;
    if (!safeSdk || !safeTransaction) return;

    try {
      const signedTransaction = await safeSdk.signTransaction(safeTransaction);
      setSafeTransaction(signedTransaction);

      const { signatures, signers } = getSignaturesMulty();
      const signaturess = Array.from(signedTransaction.signatures.values());

      const dataSignatures = signaturess.map(elem => elem.data);
      const dataSigners = signaturess.map(elem => elem.signer);

      saveSignaturesMulty([...signatures, ...dataSignatures], [...signers, ...dataSigners]);
      customToasty('This wallet signed successfully', 'success');
    } catch (error: any) {
      if (error.code === 'ACTION_REJECTED') {
        customToasty('Something went wrong with sign!', 'error');
        return;
      }

      const message = (error as { message: string }).message;
      if (message) {
        customToasty(message, 'error');
      }
      console.error(message);
    }
  }, [safeSdk, safeTransaction, chainId, address, status, dataQuery]);

  const executeMulty = async () => {
    try {
      if (conditionMulty) return;

      setStatus('loading');

      if (!safeSdk || !safeTransaction || !dataQuery.signatures || !dataQuery.signers) return;
      dataQuery.signatures.split(',').map((sig: string, idx: number) =>
        safeTransaction.addSignature({
          data: sig,
          isContractSignature: false,
          signer: dataQuery.signers ? dataQuery.signers.split(',')[idx] : '',
          staticPart: () => sig,
          dynamicPart: () => '',
        })
      );
      const txResponse = await safeSdk.executeTransaction(safeTransaction);
      await txResponse.transactionResponse?.wait();

      setStatus('success');
      customToasty('Execute success', 'success');
    } catch (error) {
      if ((error as { message: string }).message.includes('-32603')) {
        customToasty('Transaction has already been executed', 'error');
        return error;
      }
      customToasty('Something error with execute', 'error');
      setStatus('');

      return error;
    }
  };

  //
  const handleTransaction = useCallback(async () => {
    if (!safeSdk || !safeTransaction) return;
    if (status === 'success') return;

    if (ownerList && ownerList.find(elem => elem === String(address))) {
      signedCount === threshold ? await executeMulty() : await signTransactionMulty();
    } else {
      customToasty(
        'Transactions can only be signed by Safe owners. Please change your account',
        'error'
      );
    }
  }, [address, ownerList, safeSdk, safeTransaction]);

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
                      name="nonceUrl"
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
                        dataQuery.signers
                          .split(',')
                          .map(elem => <ItemInfoStyled key={elem}>{elem}</ItemInfoStyled>)
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
                <WalletButton
                  loading={status === 'loading'}
                  variant="contained"
                  onClick={handleTransaction}
                >
                  {buttonText}
                </WalletButton>
              </Box>
            </>
          )}
        </WalletPaper>

        {dataQuery.signatures?.length && (
          <WalletPaper style={{ marginTop: themeMuiBase.spacing(3) }}>
            <Box display={'flex'} flexDirection={'column'} gap={5}>
              <Box>
                <WalletTypography fontWeight={500}>Url params with information</WalletTypography>
                <Box display={'flex'} alignItems={'center'} gap={3} mt={3}>
                  <SingInfoStyled>{formattedLabel(`?${newUrlLink}`, 27, 40)}</SingInfoStyled>

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
                  <SingInfoStyled>{formattedLabel(`?${newQueryLink}`, 27, 40)}</SingInfoStyled>
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
        )}
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
