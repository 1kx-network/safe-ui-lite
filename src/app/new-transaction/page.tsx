'use client';
import { Box } from '@mui/system';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { MetaTransactionData } from '@safe-global/safe-core-sdk-types';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { useRouter } from 'next/navigation';
import * as utils from 'ethers';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';

import { NewTransactionSchema } from '@/utils/validations.utils';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import { WalletButton, WalletInput, WalletLayout, WalletPaper, WalletTypography } from '@/ui-kit';
import ConfirmIcon from '@/assets/svg/confirm-trx.svg';
import TokensIcon from '@/assets/svg/tokens.svg';
import TrxIcon from '@/assets/svg/trx-status.svg';
import useSafeStore from '@/stores/safe-store';
import routes from '../routes';
import { useSafeSdk } from '@/hooks/useSafeSdk';
import { useNetwork } from '@/hooks/useNetwork';

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
  BodyStyled,
  WrapperStyled,
  TrxHeaderStyled,
  AlignCenterStyled,
  styledPaper,
  styledBtnNextStep,
  WrapPaperStyled,
  BtnMaxInputStyled,
  CurrentNetworkStyled,
} from './new-transaction.styles';

const nonceCount = 1;
const isConfirmed = false;
const isExecute = false;

interface IInputsForm {
  amount: string;
  address: string;
}

export default function NewTransaction() {
  const { address, chainId } = useWeb3ModalAccount();
  const { safeSdk, setSafeTransaction } = useSafeStore();
  const { createSafe } = useSafeSdk();
  const network = useNetwork();
  const capitalizedNetworkName = network
    ? network?.name.toString().charAt(0).toUpperCase() + network?.name.toString().slice(1)
    : '';

  const safeAddress = localStorage.getItem('safeAddress');
  console.log('_safeAddress', safeAddress);

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
      amount: '',
      address: '',
    },
  });

  const [balanceAcc, setBalanceAcc] = useState('');

  useEffect(() => {
    if (safeSdk) {
      const pendingBalance = async () => {
        const balanceAccount = await safeSdk.getBalance();
        setBalanceAcc(String(balanceAccount));
      };

      pendingBalance();
    } else {
      if (safeAddress) {
        createSafe(safeAddress);
      }
    }
  }, [safeSdk, safeAddress]);

  const onSubmit: SubmitHandler<IInputsForm> = async (data: IInputsForm) => {
    const parseAmount = utils.parseUnits(data.amount, 'ether').toString();

    const safeTransactionData: MetaTransactionData = {
      to: data.address,
      value: parseAmount,
      data: '0x',
    };

    if (!safeSdk || !chainId || !address) return;

    const safeTransaction = await safeSdk.createTransaction({
      transactions: [safeTransactionData],
    });

    setSafeTransaction(safeTransaction);

    const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
    const dataTxHash = JSON.parse(localStorage.getItem('dataTxHash') ?? '{}');

    const updateDataTrxHash = {
      ...dataTxHash,
      [address]: {
        [chainId]: dataTxHash[chainId],
      },
    };

    localStorage.setItem('dataTxHash', JSON.stringify(updateDataTrxHash));

    if (chainId && safeAddress) {
      const queryParams = {
        chainId: String(chainId),
        address: encodeURIComponent(safeAddress),
        amount: data.amount,
        destinationAddress: data.address,
        safeTxHash,
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
    if (safeSdk) {
      setValue('amount', balanceAcc);
    }
  };

  return (
    <WalletLayout>
      <WrapperStyled>
        <WalletTypography fontSize={17} fontWeight={600}>
          New Transaction
        </WalletTypography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <BodyStyled>
            <WrapPaperStyled>
              <WalletPaper style={styledPaper}>
                <HeaderTokensStyled>
                  <AlignCenterStyled sx={{ gap: themeMuiBase.spacing(2) }}>
                    <TokensIcon />
                    <WalletTypography fontSize={17} fontWeight={600}>
                      Send Tokens
                    </WalletTypography>
                  </AlignCenterStyled>

                  <AlignCenterStyled sx={{ gap: themeMuiBase.spacing(2) }}>
                    <WalletTypography fontSize={17} fontWeight={600}>
                      Nonce #
                    </WalletTypography>
                    <NonceBoxStyled>{nonceCount}</NonceBoxStyled>
                  </AlignCenterStyled>
                </HeaderTokensStyled>

                <WalletTypography fontSize={17} fontWeight={600}>
                  Recipient address or ENS
                </WalletTypography>

                <Controller
                  control={control}
                  name="address"
                  render={({ field }) => (
                    <Box width={'100%'}>
                      <WalletInput
                        {...field}
                        placeholder="Address"
                        style={styledInput}
                        error={!!errors.address}
                        errorValue={errors.address?.message}
                      />
                    </Box>
                  )}
                />

                <WalletTypography fontSize={17} fontWeight={600}>
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
                            variant="contained"
                            onClick={handleClickMax}
                          >
                            MAX
                          </WalletButton>
                        </BtnMaxInputStyled>
                      </Box>
                    )}
                  />
                  <AmountSelectStyled>
                    {/* <WalletSelect placeholder={'xDai'} isSearchable={false}  /> */}
                    <CurrentNetworkStyled>
                      <WalletTypography fontWeight={600}>{capitalizedNetworkName}</WalletTypography>
                    </CurrentNetworkStyled>
                  </AmountSelectStyled>
                </GridBtnStyled>
                <WalletButton type="submit" variant="contained" styles={styledBtnNextStep}>
                  Next
                </WalletButton>
              </WalletPaper>
            </WrapPaperStyled>

            {/*  */}
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
                      Confirmed (0 of 2)
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
                {/*  */}
              </WalletPaper>
            </WrapPaperStyled>
          </BodyStyled>
        </form>
      </WrapperStyled>
    </WalletLayout>
  );
}
