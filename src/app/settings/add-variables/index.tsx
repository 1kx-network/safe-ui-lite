'use client';
import { useState } from 'react';
import { Box } from '@mui/system';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import useNetworkStore from '@/stores/networks-store';
import { customToasty } from '@/components';
import { WalletButton, WalletInput, WalletPaper, WalletTypography } from '@/ui-kit';
import { AddNetworkSchema } from '@/utils/validations.utils';
import { setNetworkDB } from '@/db/set-info';
import IconPlus from '@/assets/svg/plus.svg';
import { themeMuiBase } from '@/assets/styles/theme-mui';

import { BodyStyled, GridButtonStyled } from './add-variables.styles';

interface IAddNetwork {
  name: string;
  chainId: string;
  rpc: string;
  explorerUrl: string;
}

export const AddVariables = ({
  isComponent,
  handleSave,
  handleClose,
}: {
  isComponent?: boolean;
  handleSave?: () => void;
  handleClose?: () => void;
}) => {
  const { networks, loadNetworks } = useNetworkStore();
  const [errorNewNetwork, setErrorNewNetwork] = useState<null | string>(null);

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<IAddNetwork>({
    mode: 'onSubmit',
    resolver: yupResolver(AddNetworkSchema),
  });

  const onSubmit: SubmitHandler<IAddNetwork> = async (data: IAddNetwork) => {
    const { name, rpc, explorerUrl, chainId } = data;

    if (networks && networks.find(elem => elem.rpc === rpc)) {
      setErrorNewNetwork('This RPC was added!');
      customToasty('Error with adding a new network', 'error');
      return;
    }

    const newNetwork = {
      label: name,
      value: name,
      rpc: rpc,
      chainId: +chainId,
    };

    const objNetworkDB = {
      ...newNetwork,
      name,
      currency: name,
      explorerUrl,
      rpcUrl: rpc,
      symbol: name,
      decimals: 18,
      isNew: true,
      rpcOriginal: rpc,
    };

    await setNetworkDB(objNetworkDB);
    loadNetworks();
    customToasty('Network was add!', 'success');
    handleSave && handleSave();
    handleReset();
  };

  const handleReset = () => {
    handleClose && handleClose();
    reset();
    setErrorNewNetwork(null);
  };

  return (
    <WalletPaper style={{ minWidth: '50%', width: isComponent ? '100%' : '50%' }}>
      <BodyStyled>
        {/*  */}
        <WalletTypography component="h2" fontWeight={600}>
          Add a new variables
        </WalletTypography>

        <WalletTypography fontSize={14} fontWeight={500}>
          Here you can add a new network. Proceed at your own risk.
        </WalletTypography>

        {/*  */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display={'flex'} width="100%" gap={4}>
            <Box display={'flex'} flexDirection={'column'} gap={1} width="50%">
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Box width={'100%'}>
                    <WalletInput
                      {...field}
                      label="Name"
                      error={!!errors.name}
                      errorValue={errors.name?.message}
                    />
                  </Box>
                )}
              />

              <Controller
                control={control}
                name="chainId"
                render={({ field }) => (
                  <Box width={'100%'}>
                    <WalletInput
                      {...field}
                      label="Chain ID"
                      error={!!errors.chainId}
                      errorValue={errors.chainId?.message}
                    />
                  </Box>
                )}
              />
            </Box>
            <Box display={'flex'} flexDirection={'column'} gap={1} width="50%">
              <Controller
                control={control}
                name="rpc"
                render={({ field }) => (
                  <Box width={'100%'}>
                    <WalletInput
                      {...field}
                      label="RPC URL"
                      error={!!errors.rpc}
                      errorValue={errors.rpc?.message}
                    />
                  </Box>
                )}
              />

              <Controller
                control={control}
                name="explorerUrl"
                render={({ field }) => (
                  <Box width={'100%'}>
                    <WalletInput
                      {...field}
                      label="Explorer url"
                      error={!!errors.explorerUrl}
                      errorValue={errors.explorerUrl?.message}
                    />
                  </Box>
                )}
              />
            </Box>
          </Box>

          <GridButtonStyled>
            <WalletButton onClick={handleReset} variant="outlined">
              Cancel
            </WalletButton>
            <WalletButton type="submit" variant="contained">
              <IconPlus color={themeMuiBase.palette.success} width="21px" height="21px" />
              Add network
            </WalletButton>
          </GridButtonStyled>
        </form>
        <Box mt={4}>
          <WalletTypography fontWeight={400} fontSize={14} color={themeMuiBase.palette.error}>
            {errorNewNetwork}
          </WalletTypography>
        </Box>
        {/*  */}
      </BodyStyled>
    </WalletPaper>
  );

  // if (isComponent) {
  //   return <AddNetworkVariables />;
  // }

  // return (
  //   <WalletLayout>
  //     <WrapperStyled>
  //       <Box mb={8}>
  //         <WalletTypography fontSize={22} fontWeight={600} component="h2">
  //           Settings
  //         </WalletTypography>
  //       </Box>

  //       <CustomTabs tabs={settingsMenu} />
  //       <AddNetworkVariables />
  //     </WrapperStyled>
  //   </WalletLayout>
  // );
};
