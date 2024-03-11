'use client';
import { Box } from '@mui/system';
import { useDisconnect } from '@web3modal/ethers/react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';

import { WalletTypography, WalletPaper, WalletLayout, WalletButton, WalletInput } from '@/ui-kit';

import {
  GridContainer,
  GridButtonStyled,
  WrapperStyled,
  styleWalletPaper,
  StepStyled,
} from './save-account.styles';

interface IInputsForm {
  devotedInput: string;
  chainId: string;
}

interface ICreatePageAccount {
  address: string;
  network: string;
}

export default function CreatePageAccount({
  address = 'gno:0x98BB81B...5D2e443',
  network = 'Polygon',
}: ICreatePageAccount) {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<IInputsForm>();

  const onSubmit: SubmitHandler<IInputsForm> = data => {
    console.log(data);
  };

  const { disconnect } = useDisconnect();

  const handleClickCancel = () => {
    disconnect();
  };

  return (
    <WalletLayout hideSidebar>
      <WrapperStyled>
        <WalletTypography className="safe-account_main-header" fontSize={22} fontWeight={600}>
          Create new Safe Account
        </WalletTypography>

        <GridContainer>
          <form onSubmit={handleSubmit(onSubmit)}>
            <WalletPaper style={styleWalletPaper} minWidth="653px">
              <Box display="flex" alignItems="center">
                <StepStyled>
                  <WalletTypography fontSize={18} fontWeight={600} color="#fff">
                    1
                  </WalletTypography>
                </StepStyled>
                <WalletTypography component="h2" fontSize={22} fontWeight={600}>
                  Select network and name of your Safe Account
                </WalletTypography>
              </Box>

              <Box display="flex" flexDirection="column" mt={1.5}>
                <WalletTypography fontSize={12} fontWeight={600}>
                  Name
                </WalletTypography>
              </Box>

              <Controller
                control={control}
                name="devotedInput"
                rules={{
                  required: 'It is a required field',
                }}
                render={({ field }) => (
                  <WalletInput
                    placeholder="Enter name"
                    {...field}
                    error={!!errors.devotedInput}
                    errorValue={errors.devotedInput?.message}
                  />
                )}
              />

              <Box display={'flex'} flexDirection={'column'} mt={1.5}>
                <WalletTypography fontSize={12} fontWeight={600}>
                  Network ID
                </WalletTypography>
              </Box>

              <Controller
                control={control}
                name="chainId"
                rules={{
                  required: 'It is a required field',
                }}
                render={({ field }) => (
                  <WalletInput
                    placeholder="Enter chain id"
                    {...field}
                    error={!!errors.chainId}
                    errorValue={errors.chainId?.message}
                  />
                )}
              />

              <Box mt={1.5}>
                <WalletTypography fontWeight={600}>
                  By continuing, you agree to our terms of use and privacy policy.
                </WalletTypography>
              </Box>

              <GridButtonStyled>
                <WalletButton type="cancel" onClick={handleClickCancel}>
                  Cancel
                </WalletButton>
                <WalletButton type="submit" onClick={() => {}} variant="contained">
                  Next
                </WalletButton>
              </GridButtonStyled>
            </WalletPaper>
          </form>

          {/* --- */}
          <WalletPaper style={styleWalletPaper}>
            <WalletTypography fontSize={22} fontWeight={600}>
              Your Safe Account preview
            </WalletTypography>

            <Box display="flex" justifyContent={'space-between'} mt={1.5}>
              <WalletTypography fontSize={12} fontWeight={600}>
                Wallet
              </WalletTypography>
              <WalletTypography fontSize={17}>{address}</WalletTypography>
            </Box>

            <Box display="flex" justifyContent={'space-between'} mt={1.5}>
              <WalletTypography fontSize={12} fontWeight={600}>
                Network
              </WalletTypography>
              <WalletTypography fontSize={17} fontWeight={600}>
                {network}
              </WalletTypography>
            </Box>
          </WalletPaper>
        </GridContainer>
      </WrapperStyled>
      {/*  */}
    </WalletLayout>
  );
}
