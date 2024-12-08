'use client';
import { useRef, useState } from 'react';
import { SingleValue } from 'react-select';
import { Box } from '@mui/system';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { IOptionNetwork } from '@/constants/networks';
import useNetworkStore from '@/stores/networks-store';
import { customToasty } from '@/components';
import { WalletButton, WalletInput, WalletPaper, WalletSelect, WalletTypography } from '@/ui-kit';
import { ChangeNetworkEnvSchema } from '@/utils/validations.utils';
import { setNetworkDB } from '@/db/set-info';
import { INetworkDB } from '@/db';

import {
  BodyStyled,
  BoxChangedStyled,
  GridInfoValueStyled,
  styledBtn,
} from './environment-variables.styles';

interface IChangeNetwork {
  name: string;
  rpc: string;
  chainId: string;
}

export const NetworksSettings = ({
  isComponent,
  handleSave,
  handleClose,
}: {
  isComponent?: boolean;
  handleSave?: () => void;
  handleClose?: () => void;
}) => {
  const { networks, loadNetworks } = useNetworkStore();

  const [network, setNetworkLocal] = useState<IOptionNetwork | null>(null);
  const [isLoadingChain, setIsLoadingChain] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm<IChangeNetwork>({
    mode: 'onSubmit',
    resolver: yupResolver(ChangeNetworkEnvSchema),
    defaultValues: {
      name: network?.value,
      rpc: network?.rpc,
    },
  });

  const handleChooseNetwork = (elem: SingleValue<IOptionNetwork>) => {
    if (!elem) return;
    reset();
    setNetworkLocal(elem);
    setValue('name', elem.value);
    setValue('rpc', elem.rpc);
    setValue('chainId', String(elem.chainId));
  };

  const selectInputRef = useRef();

  const onSubmit: SubmitHandler<IChangeNetwork> = async (data: IChangeNetwork) => {
    if (!networks || !network?.chainId) return;
    const defNetwork = networks.find(elem => elem.chainId === network?.chainId);

    if (!defNetwork) return;
    const { explorerUrl, chainId } = defNetwork;
    setIsLoadingChain(true);

    const updateNetworkDB: INetworkDB = {
      chainId: Number(data.chainId) || Number(chainId),
      name: data.name,
      currency: data.name,
      explorerUrl: explorerUrl ?? '',
      rpcUrl: data.rpc,
      symbol: data.name,
      decimals: 18,
      rpcOriginal: network.rpcOriginal || network.rpc,
    };

    const newNetwork =
      Number(data.chainId) !== Number(chainId)
        ? {
            value: data.name,
            rpc: data.rpc,
            isNew: true,
            rpcOriginal: network.rpc,
          }
        : {};
    await setNetworkDB({ ...updateNetworkDB, ...newNetwork });
    await loadNetworks();

    setTimeout(() => setIsLoadingChain(false), 500);
    reset();
    customToasty('Network was changed', 'success');
    setNetworkLocal(null);
    handleSave && handleSave();
  };

  return (
    <WalletPaper style={{ minWidth: '50%', width: isComponent ? '100%' : '50%' }}>
      <BodyStyled>
        {/*  */}
        <BoxChangedStyled>
          <WalletTypography component="h2" fontWeight={600}>
            Environment variables
          </WalletTypography>

          <WalletTypography fontSize={14} fontWeight={500}>
            You can override some of our default APIs here in case you need to. Proceed at your own
            risk.
          </WalletTypography>

          <Box width={'50%'}>
            <WalletSelect
              isLoading={isLoadingChain}
              options={networks ?? []}
              onChange={handleChooseNetwork}
              ref={selectInputRef}
            />
          </Box>

          {/*  */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <GridInfoValueStyled>
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
                      disabled={!network}
                    />
                  </Box>
                )}
              />
              <Controller
                control={control}
                name="rpc"
                render={({ field }) => (
                  <WalletInput
                    {...field}
                    label="Rpc"
                    error={!!errors.rpc}
                    errorValue={errors.rpc?.message}
                    disabled={!network}
                  />
                )}
              />

              <Controller
                control={control}
                name="chainId"
                render={({ field }) => (
                  <WalletInput
                    {...field}
                    label="Chain Id"
                    error={!!errors.rpc}
                    errorValue={errors.rpc?.message}
                    disabled={!network}
                  />
                )}
              />
            </GridInfoValueStyled>

            {isComponent ? (
              <Box display={'flex'} alignItems={'center'} gap={3}>
                <WalletButton variant="contained" styles={styledBtn} onClick={handleClose}>
                  Cancel
                </WalletButton>
                <WalletButton
                  variant="contained"
                  styles={styledBtn}
                  type="submit"
                  disabled={!network}
                >
                  Save
                </WalletButton>
              </Box>
            ) : (
              <WalletButton
                variant="contained"
                styles={styledBtn}
                type="submit"
                disabled={!network}
              >
                Save
              </WalletButton>
            )}
          </form>
        </BoxChangedStyled>
        {/*  */}
      </BodyStyled>
    </WalletPaper>
  );
};
