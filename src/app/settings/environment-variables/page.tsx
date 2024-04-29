'use client';
import { useRef, useState } from 'react';
import { SingleValue } from 'react-select';
import { Box } from '@mui/system';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { IOptionNetwork } from '@/constants/networks';
import useNetworkStore from '@/stores/networks-store';
import { CustomTabs, customToasty } from '@/components';
import {
  WalletButton,
  WalletInput,
  WalletLayout,
  WalletPaper,
  WalletSelect,
  WalletTypography,
} from '@/ui-kit';
import { settingsMenu } from '../owners-list/fixutres';
import { ChangeNetworkEnvSchema } from '@/utils/validations.utils';
import { networks as networksDefault } from '@/context/networks';
import { addCustomNetworkDB } from '@/db/set-info';
import { formatterIcon } from '@/utils/icon-formatter';

import {
  BodyStyled,
  BoxChangedStyled,
  GridInfoValueStyled,
  WrapperStyled,
  styledBtn,
} from './environment-variables.styles';

interface IChangeNetwork {
  name: string;
  rpc: string;
}

export default function NetworsSettins() {
  const { networks, setNetworksArray, updateNetwork } = useNetworkStore();

  const [network, setNetworkLocal] = useState<IOptionNetwork>();
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
  };

  interface INetworkDB {
    id?: string;
    name: string;
    currency: string;
    explorerUrl: string;
    rpcUrl: string;
    symbol: string;
    decimals: number;
    chainId: number;
  }

  const selectInputRef = useRef();

  const onSubmit: SubmitHandler<IChangeNetwork> = async (data: IChangeNetwork) => {
    if (!network?.chainId) return;
    const defNetwork = networksDefault.find(elem => elem.chainId === network?.chainId);
    if (!defNetwork) return;
    const { explorerUrl, chainId } = defNetwork;
    setIsLoadingChain(true);

    const updateNetworkDB: INetworkDB = {
      chainId: Number(chainId),
      name: data.name,
      currency: data.name,
      explorerUrl: explorerUrl,
      rpcUrl: data.rpc,
      symbol: data.name,
      decimals: 18,
    };

    updateNetwork({
      chainId: Number(chainId),
      label: data.name,
      value: data.name,
      rpc: data.rpc,
      icon: () => formatterIcon(chainId),
    });

    await addCustomNetworkDB(updateNetworkDB);

    setNetworksArray(networks);

    setTimeout(() => setIsLoadingChain(false), 500);
    reset();
    customToasty('Network was changed', 'success');
  };

  return (
    <WalletLayout>
      <WrapperStyled>
        <Box mb={8}>
          <WalletTypography fontSize={22} fontWeight={600} component="h2">
            Settings
          </WalletTypography>
        </Box>

        <CustomTabs tabs={settingsMenu} />
        <WalletPaper style={{ minWidth: '50%', width: '50%' }}>
          <BodyStyled>
            {/*  */}
            <BoxChangedStyled>
              <WalletTypography component="h2" fontWeight={600}>
                Environment variables
              </WalletTypography>

              <WalletTypography fontSize={14} fontWeight={500}>
                You can override some of our default APIs here in case you need to. Proceed at your
                own risk.
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

                  <WalletInput
                    label="Chain Id"
                    placeholder="Chain Id"
                    value={network?.chainId}
                    disabled
                  />
                </GridInfoValueStyled>
                <WalletButton
                  variant="contained"
                  styles={styledBtn}
                  type="submit"
                  disabled={!network}
                >
                  Save
                </WalletButton>
              </form>
            </BoxChangedStyled>
            {/*  */}
          </BodyStyled>
        </WalletPaper>
      </WrapperStyled>
    </WalletLayout>
  );
}
