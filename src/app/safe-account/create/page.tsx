'use client';
import React, { useEffect } from 'react';
import { Box } from '@mui/system';
import { useDisconnect, useWeb3ModalAccount } from '@web3modal/ethers/react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';

import { formattedLabel } from '@/utils/foramtters';
import { useNetwork } from '@/hooks/useNetwork';
import routes from '@/app/routes';
import { WalletTypography, WalletPaper, WalletLayout, WalletButton, WalletInput } from '@/ui-kit';
import {
  BoxSafeAccountInfoStyled,
  GridButtonStyled,
  GridContainer,
  StepStyled,
  WrapperStyled,
  styleWalletPaper,
  styledHeaderSafeAccount,
} from '../safe-account.styles';

interface IInputsForm {
  name: string;
  chainId: number;
}

export default function CreatePageAccount() {
  const router = useRouter();
  const { address, chainId } = useWeb3ModalAccount();
  const { disconnect } = useDisconnect();
  const network = useNetwork();
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<IInputsForm>({
    mode: 'onSubmit',
    // resolver: yupResolver(CreateSafeAccountSchema),
  });

  useEffect(() => {
    if (chainId) {
      setValue('chainId', chainId);
    }
  }, [chainId]);

  const networkName = network?.name.toString();

  const onSubmit: SubmitHandler<IInputsForm> = () => {
    router.push(routes.safeAccountOwners);
  };

  const handleClickCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    disconnect();
    router.push(routes.home);
  };

  return (
    <WalletLayout hideSidebar>
      <WrapperStyled style={{ height: 'fit-content' }}>
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

              <Box display="flex" flexDirection="column" mt={3} mb={2.5}>
                <WalletTypography fontSize={12} fontWeight={600}>
                  Name
                </WalletTypography>
              </Box>

              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <WalletInput
                    placeholder="Enter name"
                    {...field}
                    error={!!errors.name}
                    errorValue={errors.name?.message}
                  />
                )}
              />

              <Box display={'flex'} flexDirection={'column'} mt={3} mb={2.5}>
                <WalletTypography fontSize={12} fontWeight={600}>
                  Network ID
                </WalletTypography>
              </Box>

              <Controller
                control={control}
                name="chainId"
                render={({ field }) => (
                  <WalletInput
                    placeholder="Enter chain id"
                    {...field}
                    error={!!errors.chainId}
                    errorValue={errors.chainId?.message}
                  />
                )}
              />

              <Box mt={3}>
                <WalletTypography fontWeight={600}>
                  By continuing, you agree to our terms of use and privacy policy.
                </WalletTypography>
              </Box>

              <GridButtonStyled>
                <WalletButton onClick={handleClickCancel}>Cancel</WalletButton>
                <WalletButton type="submit" variant="contained">
                  Next
                </WalletButton>
              </GridButtonStyled>
            </WalletPaper>
          </form>

          {/* --- */}
          <WalletPaper style={styleWalletPaper}>
            <WalletTypography
              fontSize={17}
              fontWeight={600}
              textAlign="center"
              style={styledHeaderSafeAccount}
            >
              Your Safe Account preview
            </WalletTypography>

            <Box sx={BoxSafeAccountInfoStyled}>
              <WalletTypography fontSize={12} fontWeight={600} lineHeight={'21px'}>
                Wallet
              </WalletTypography>
              {address && (
                <WalletTypography fontSize={17}>
                  {networkName?.substring(0, 3)}:{formattedLabel(String(address))}
                </WalletTypography>
              )}
            </Box>
            <Box sx={BoxSafeAccountInfoStyled}>
              <WalletTypography fontSize={12} fontWeight={600} lineHeight={'21px'}>
                Network
              </WalletTypography>
              <WalletTypography fontSize={17} fontWeight={600} textTransform="capitalize">
                {networkName}
              </WalletTypography>
            </Box>
          </WalletPaper>
        </GridContainer>
      </WrapperStyled>
      {/*  */}
    </WalletLayout>
  );
}
