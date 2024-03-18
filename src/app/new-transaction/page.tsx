'use client';
import { Box } from '@mui/system';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { MetaTransactionData } from '@safe-global/safe-core-sdk-types';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { useRouter } from 'next/navigation';
import * as utils from 'ethers';
import { yupResolver } from '@hookform/resolvers/yup';
import dynamic from 'next/dynamic';
import { themeMuiBase } from '@/assets/styles/theme-mui';

import {
  WalletButton,
  WalletInput,
  WalletLayout,
  WalletPaper,
  WalletSelect as WalletSelectUi,
  WalletTypography,
} from '@/ui-kit';

import ConfirmIcon from '@/assets/svg/confirm-trx.svg';
import TokensIcon from '@/assets/svg/tokens.svg';
import TrxIcon from '@/assets/svg/trx-status.svg';
import useSafeStore from '@/stores/safe-store';
import routes from '../routes';
import { NewTransactionSchema } from '@/utils/validations.utils';

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
} from './new-transaction.styles';

const WalletSelect = dynamic(
  () => import('@/ui-kit/wallet-select/index').then(module => module.WalletSelect),
  {
    ssr: false,
    loading: () => <WalletSelectUi />,
  }
);

const nonceCount = 1;
const isConfirmed = false;
const isExecute = false;

interface IInputsForm {
  amount: string;
  address: string;
}

export default function NewTransaction() {
  const { address } = useWeb3ModalAccount();
  const { safeSdk, setSafeTransaction } = useSafeStore();
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<IInputsForm>({
    mode: 'onSubmit',
    resolver: yupResolver(NewTransactionSchema),
    defaultValues: {
      amount: '0.00',
      address: '0x6dB182cD4303A5C5803A0e099f7440f8448A159B',
    },
  });

  const onSubmit: SubmitHandler<IInputsForm> = async (data: IInputsForm) => {
    const parseAmount = utils.parseUnits(data.amount, 'ether');

    const safeTransactionData: MetaTransactionData = {
      to: data.address,
      value: String(parseAmount),
      data: String(address),
    };
    if (!safeSdk) return;

    const safeTransaction = await safeSdk.createTransaction({
      transactions: [safeTransactionData],
    });

    setSafeTransaction(safeTransaction);
    router.push(routes.signTransaction);
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
                {/* <Controller
                  control={control}
                  name="address"
                  render={({ field }) => (
                    <WalletSelect
                      options={addresses}
                      isSearchable
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                    />
                  )}
                /> */}

                <Controller
                  control={control}
                  name="address"
                  render={({ field }) => (
                    <Box width={'100%'}>
                      <WalletInput
                        {...field}
                        style={styledInput}
                        error={!!errors.amount}
                        errorValue={errors.amount?.message}
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
                          style={styledInput}
                          error={!!errors.amount}
                          errorValue={errors.amount?.message}
                        />
                        <BtnMaxInputStyled>
                          <WalletButton styles={styledBtxMax} variant="contained">
                            MAX
                          </WalletButton>
                        </BtnMaxInputStyled>
                      </Box>
                    )}
                  />
                  <AmountSelectStyled>
                    <WalletSelect placeholder={'xDai'} isSearchable={false} />
                  </AmountSelectStyled>
                </GridBtnStyled>
                <WalletButton variant="contained" styles={styledBtnNextStep}>
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

                  <ItemProccessingStyled>
                    {isConfirmed ? <ConfirmIcon /> : <ConfirmedWaitStyled>+</ConfirmedWaitStyled>}
                    <WalletTypography fontSize={17} fontWeight={600}>
                      Confirmed (0 of 1)
                    </WalletTypography>
                  </ItemProccessingStyled>

                  <StatusLineStyled />
                  <ItemProccessingStyled>
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
