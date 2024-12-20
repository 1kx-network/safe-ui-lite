'use client';
import { Box } from '@mui/system';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { useRouter } from 'next/navigation';
import * as utils from 'ethers';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useState } from 'react';
import { SingleValue } from 'react-select';

import { WalletButton, WalletInput, WalletPaper, WalletSelect, WalletTypography } from '@/ui-kit';
import { NewTransactionSchema } from '@/utils/validations.utils';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import ConfirmIcon from '@/assets/svg/confirm-trx.svg';
import TokensIcon from '@/assets/svg/tokens.svg';
import TrxIcon from '@/assets/svg/trx-status.svg';
import useSafeStore from '@/stores/safe-store';
import routes from '../../../routes';
import { useSafeSdk } from '@/hooks/useSafeSdk';
import { IOptions } from '../../../wallet/fixtures';
import { NATIVE_TOKENS, TOKENS_ERC20 } from '@/constants/tokens';
import { returnTransactionObj } from '@/utils/new-trx-functionals';
import { TYPE_SIGN_TRX } from '@/constants/type-sign';
import useNetworkStore from '@/stores/networks-store';
import { formatterIcon } from '@/utils/icon-formatter';
import IconDefaultAddress from '@/assets/svg/defult-icon-address.svg';
import { SearchAddress } from '../search-address-input';
import { getAddressBook } from '@/db/get-info';
import useAddressBookStore from '@/stores/address-book-store';

import { options } from './fixutres';
import {
  AmountSelectStyled,
  ConfirmedWaitStyled,
  ExecuteIconStyled,
  GridBtnStyled,
  ItemProccessingStyled,
  NonceBoxStyled,
  ProccessingBoxStyled,
  StatusLineStyled,
  HeaderTokensStyled,
  styledBtxMax,
  styledInput,
  TrxHeaderStyled,
  AlignCenterStyled,
  styledPaper,
  styledBtnNextStep,
  WrapPaperStyled,
  BtnMaxInputStyled,
  BodyStyled,
  WrapperAddressBookInputStyled,
  AddressBookInputStyled,
} from './send-tokens.styles';

const isConfirmed = false;
const isExecute = false;

interface IInputsForm {
  amount: string;
  address: string;
  calldata: string;
}

interface IAddFromBook {
  name?: string;
  address: string;
}

export const SendTokens = () => {
  const { chosenNetwork } = useNetworkStore();
  const { address, chainId } = useWeb3ModalAccount();
  const { safeSdk } = useSafeStore();
  const { createSafe, getTokenERC20Balance, createTrancationERC20 } = useSafeSdk();
  const { setAddressBookArray } = useAddressBookStore();

  const safeAddress: string | null =
    typeof window !== 'undefined' ? localStorage.getItem('safeAddress') : null;

  const router = useRouter();

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<IInputsForm>({
    mode: 'onSubmit',
    resolver: yupResolver(NewTransactionSchema),
    defaultValues: {
      amount: '0',
      address: '',
      calldata: '0x',
    },
  });

  const [nonce, setNonce] = useState('1');
  const [thresholders, setThresholders] = useState(0);
  const [tokenType, setTokenType] = useState<string>(NATIVE_TOKENS.ETH);
  const [balanceAcc, setBalanceAcc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addFromBook, setAddFromBook] = useState<IAddFromBook | null>(null);

  useEffect(() => {
    (async () => {
      const addressBook = await getAddressBook();
      const searchParams = window.location.search;
      const recipientAddress = searchParams.match(/recipientAddress=([^&]*)/);

      if (recipientAddress && recipientAddress[1]) {
        if (addressBook.length) {
          const findAddress = addressBook.find(elem => elem.address === recipientAddress[1]);
          const valueAddress = findAddress?.address ?? recipientAddress[1];

          findAddress && setAddFromBook(findAddress);
          setValue('address', valueAddress);
        } else {
          setValue('address', recipientAddress[1]);
        }
      }

      setAddressBookArray(addressBook);
    })();
  }, [safeAddress]);

  useEffect(() => {
    if (safeSdk) {
      const pendingBalance = async () => {
        const balanceAccount = await safeSdk.getBalance();
        const nonce = await safeSdk.getNonce();
        const thresholders = await safeSdk.getThreshold();
        const parceBalance = utils.formatEther(String(balanceAccount));

        setThresholders(thresholders);
        setNonce(String(nonce));
        setBalanceAcc(parceBalance);
      };

      pendingBalance();
    } else {
      if (safeAddress) {
        createSafe(safeAddress);
      }
    }
  }, [safeSdk, safeAddress]);

  const handleChangeToken = async (elem: SingleValue<IOptions>) => {
    if (!chainId || !safeSdk || !elem) return;
    const { label } = elem;

    if (label === NATIVE_TOKENS.ETH) {
      const dataAcc = await safeSdk.getBalance();
      if (!dataAcc) return;
      const parceBalance = utils.formatEther(String(dataAcc));
      setBalanceAcc(parceBalance);
      setTokenType(NATIVE_TOKENS.ETH);
    }
    if (label === TOKENS_ERC20[label]) {
      const balanceERC20 = await getTokenERC20Balance(TOKENS_ERC20[label], chainId);
      const parceBalance = utils.formatUnits(String(balanceERC20), 6);

      setBalanceAcc(parceBalance);
      setTokenType(TOKENS_ERC20[label]);
    }
  };

  const onSubmit: SubmitHandler<IInputsForm> = async (data: IInputsForm) => {
    if (!safeSdk || !chainId || !address) return;

    // const networkUserInfo = networks.find(elem => elem.chainId === chainId);
    const transactionObj = await returnTransactionObj(
      data.address,
      data.amount,
      tokenType,
      chainId,
      data.calldata,
      createTrancationERC20
    );

    if (!transactionObj) return;

    const safeTransaction = await safeSdk.createTransaction({
      transactions: [transactionObj],
    });

    const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);

    if (chainId && safeAddress) {
      const queryParams = {
        chainId: String(chainId),
        address: encodeURIComponent(safeAddress),
        amount: data.amount,
        destinationAddress: data.address,
        ...(addFromBook && { destinationName: addFromBook.name }),
        tokenType,
        safeTxHash,
        nonce: nonce,
        typeSignTrx: TYPE_SIGN_TRX.SEND_TOKEN,
        calldata: data.calldata,
        userNetworkTrx: JSON.stringify({
          name: chosenNetwork?.value ?? '',
          chainId: chosenNetwork?.chainId ?? '',
          rpcUrl: chosenNetwork?.rpc ?? '',
          explorerUrl: chosenNetwork?.explorerUrl ?? '',
          currency: chosenNetwork?.currency ?? '',
        }),
      };

      const queryString = new URLSearchParams(queryParams).toString();
      router.push(`${routes.signTransaction}?${queryString}`);
    }
  };

  const handleChangeAmount = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: React.ChangeEvent<HTMLInputElement>) => void
  ) => {
    const value = event.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      onChange(event);
    }
  };

  const handleClickMax = async () => {
    setValue('amount', balanceAcc);
  };

  const handleChangeNonce = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newValue = value.replace(/\D/g, '');
    setNonce(newValue);
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  }, [chainId]);

  const tokenOptions = options.map(opt => ({
    ...opt,
    icon: () => <opt.icon />,
  }));

  const selectOp = useCallback(
    () => (
      <WalletSelect
        isLoading={isLoading}
        options={tokenOptions}
        defaultValue={{
          id: 0,
          value: chosenNetwork?.value ?? '',
          label: chosenNetwork?.label ?? '',
          icon: () => formatterIcon(chosenNetwork?.chainId ?? 0, '18px', '18px'),
        }}
        isSearchable={false}
        onChange={handleChangeToken}
      />
    ),
    [chosenNetwork, isLoading]
  );

  const handleSearchAddress = (name: string, address: string) => {
    setAddFromBook({ name, address });
    setValue('address', address);
  };

  const handleClickAddressBoookInput = () => {
    setAddFromBook(null);
    setValue('address', '');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BodyStyled>
        <WrapPaperStyled>
          <WalletPaper style={styledPaper}>
            <HeaderTokensStyled>
              <AlignCenterStyled>
                <TokensIcon />
                <WalletTypography fontSize={17} fontWeight={600}>
                  Send Tokens
                </WalletTypography>
              </AlignCenterStyled>

              <AlignCenterStyled>
                <WalletTypography fontSize={17} fontWeight={600} style={{ whiteSpace: 'nowrap' }}>
                  Nonce #
                </WalletTypography>
                <WalletInput style={NonceBoxStyled} value={nonce} onChange={handleChangeNonce} />
              </AlignCenterStyled>
            </HeaderTokensStyled>

            <WalletTypography fontWeight={400} color={themeMuiBase.palette.tetriaryGrey}>
              Recipient address or ENS
            </WalletTypography>

            <Controller
              control={control}
              name="address"
              render={({ field }) => (
                <Box width={'100%'} position={'relative'} height={'43px'}>
                  {!addFromBook ? (
                    <WalletInput
                      {...field}
                      placeholder="Address"
                      style={styledInput}
                      error={!!errors.address}
                      errorValue={errors.address?.message}
                    />
                  ) : (
                    <WrapperAddressBookInputStyled onClick={handleClickAddressBoookInput}>
                      <IconDefaultAddress width="25px" height="25px" />

                      <AddressBookInputStyled>
                        <WalletTypography component="p" fontSize={14}>
                          {addFromBook.name ?? 'Name is undefined'}
                        </WalletTypography>

                        <WalletTypography component="p" fontSize={14}>
                          {addFromBook.address}
                        </WalletTypography>
                      </AddressBookInputStyled>
                    </WrapperAddressBookInputStyled>
                  )}

                  <SearchAddress value={field.value} setAddressBook={handleSearchAddress} />
                </Box>
              )}
            />

            <WalletTypography fontWeight={400} color={themeMuiBase.palette.tetriaryGrey}>
              Amount
            </WalletTypography>
            <GridBtnStyled>
              <Controller
                control={control}
                name="amount"
                render={({ field }) => (
                  <Box width={'100%'} position={'relative'}>
                    <WalletInput
                      {...field}
                      placeholder="0"
                      onChange={e => handleChangeAmount(e, field.onChange)}
                      style={styledInput}
                      error={!!errors.amount}
                      errorValue={errors.amount?.message}
                    />
                    <BtnMaxInputStyled>
                      <WalletButton
                        styles={styledBtxMax}
                        variant="text"
                        type="button"
                        onClick={handleClickMax}
                      >
                        MAX
                      </WalletButton>
                    </BtnMaxInputStyled>
                  </Box>
                )}
              />
              <AmountSelectStyled>{selectOp()}</AmountSelectStyled>
            </GridBtnStyled>
            <WalletTypography fontWeight={400} color={themeMuiBase.palette.tetriaryGrey}>
              Calldata
            </WalletTypography>
            <GridBtnStyled>
              <Controller
                control={control}
                name="calldata"
                render={({ field }) => (
                  <Box width={'100%'} position={'relative'}>
                    <WalletInput
                      {...field}
                      placeholder="0x"
                      style={{ ...styledInput }}
                      error={!!errors.calldata}
                      errorValue={errors.calldata?.message}
                    />
                  </Box>
                )}
              />
            </GridBtnStyled>
            <WalletButton type="submit" variant="contained" styles={styledBtnNextStep}>
              Next
            </WalletButton>
          </WalletPaper>
        </WrapPaperStyled>

        <WrapPaperStyled>
          <WalletPaper style={styledPaper}>
            <TrxHeaderStyled>
              <TrxIcon />
              <WalletTypography fontSize={17} fontWeight={600}>
                Transaction Status
              </WalletTypography>
            </TrxHeaderStyled>

            <ProccessingBoxStyled>
              <ItemProccessingStyled>
                <ConfirmIcon />
                <WalletTypography fontSize={17} fontWeight={600}>
                  Create
                </WalletTypography>
              </ItemProccessingStyled>

              <StatusLineStyled />

              <ItemProccessingStyled sx={{ opacity: 0.2 }}>
                {isConfirmed ? <ConfirmIcon /> : <ConfirmedWaitStyled>+</ConfirmedWaitStyled>}
                <WalletTypography fontSize={17} fontWeight={600}>
                  Confirmed (0 of {thresholders})
                </WalletTypography>
              </ItemProccessingStyled>

              <StatusLineStyled />
              <ItemProccessingStyled sx={{ opacity: 0.2 }}>
                {isExecute ? <ConfirmIcon /> : <ExecuteIconStyled />}
                <WalletTypography fontSize={17} fontWeight={600}>
                  Execute
                </WalletTypography>
              </ItemProccessingStyled>
            </ProccessingBoxStyled>
          </WalletPaper>
        </WrapPaperStyled>
      </BodyStyled>
    </form>
  );
};
