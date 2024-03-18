'use client';
import { Box } from '@mui/system';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { themeMuiBase } from '@/assets/styles/theme-mui';
import {
  WalletButton,
  WalletInput,
  WalletLayout,
  WalletPaper,
  WalletSelect,
  WalletTypography,
} from '@/ui-kit';

import ConfirmIcon from '@/assets/svg/confirm-trx.svg';
import {
  AmountSelectStyled,
  ConfirmedWaitStyled,
  ExecuteIconStyled,
  GridBtnStyled,
  ItemProccessingStyled,
  NonceBoxStyled,
  ProccessingBoxStyled,
  StatusLineStyled,
  styledAlignCenter,
  styledBoxTokens,
  styledBoxTrx,
  styledBtxMax,
  styledInput,
  styledPaper,
  BodyStyled,
  WrapperStyled,
} from './new-transaction.styles';
import TokensIcon from '@/assets/svg/tokens.svg';
import TrxIcon from '@/assets/svg/trx-status.svg';

const nonceCount = 1;
const isConfirmed = false;
const isExecute = false;

interface IInputsForm {
  amount: string;
  address: string;
}

export default function NewTransaction() {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<IInputsForm>({
    mode: 'onSubmit',
    defaultValues: {
      amount: '0.00',
    },
  });

  const onSubmit: SubmitHandler<IInputsForm> = () => {
    console.log('_submit_');
  };

  return (
    <WalletLayout>
      <WrapperStyled>
        <WalletTypography fontSize={17} fontWeight={600}>
          New Transaction
        </WalletTypography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <BodyStyled>
            <WalletPaper style={styledPaper} id={'send-tokens-body'}>
              <Box sx={styledBoxTokens}>
                <Box sx={styledAlignCenter} gap={themeMuiBase.spacing(2)}>
                  <TokensIcon />
                  <WalletTypography fontSize={17} fontWeight={600}>
                    Send Tokens
                  </WalletTypography>
                </Box>

                <Box sx={styledAlignCenter} gap={themeMuiBase.spacing(3.5)}>
                  <WalletTypography fontSize={17} fontWeight={600}>
                    Nonce #
                  </WalletTypography>
                  <NonceBoxStyled>{nonceCount}</NonceBoxStyled>
                </Box>
              </Box>

              <WalletTypography fontSize={17} fontWeight={600}>
                Recipient address or ENS
              </WalletTypography>
              <Controller
                control={control}
                name="amount"
                render={({ field }) => <WalletSelect {...field} placeholder={'gno:'} />}
              />

              <WalletTypography fontSize={17} fontWeight={600}>
                Amount
              </WalletTypography>
              <GridBtnStyled>
                <Controller
                  control={control}
                  name="amount"
                  render={({ field }) => (
                    <Box width={'100%'}>
                      <WalletInput
                        {...field}
                        style={styledInput}
                        error={!!errors.amount}
                        errorValue={errors.amount?.message}
                        endAdornment={
                          <WalletButton styles={styledBtxMax} variant="contained">
                            MAX
                          </WalletButton>
                        }
                      />
                    </Box>
                  )}
                />
                <AmountSelectStyled>
                  <WalletSelect placeholder={'xDai'} />
                </AmountSelectStyled>
              </GridBtnStyled>
              <WalletButton variant="contained">Next</WalletButton>
            </WalletPaper>

            {/*  */}
            <WalletPaper style={styledPaper} id={'trx-tokens-body'}>
              <Box sx={styledBoxTrx}>
                <TrxIcon />
                <WalletTypography fontSize={17} fontWeight={600}>
                  Transaction Status
                </WalletTypography>
              </Box>

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
          </BodyStyled>
        </form>
      </WrapperStyled>
    </WalletLayout>
  );
}
