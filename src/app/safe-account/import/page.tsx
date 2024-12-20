'use client';
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/system';
import { useSwitchNetwork, useWeb3ModalAccount } from '@web3modal/ethers/react';
import { useRouter } from 'next/navigation';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { v4 as uuid } from 'uuid';

import routes from '@/app/routes';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import {
  WalletTypography,
  WalletPaper,
  WalletLayout,
  WalletButton,
  WalletInput,
  WalletSelect,
} from '@/ui-kit';
import {
  GridButtonStyled,
  GridContainer,
  WarningCreateAccounStyled,
  WrapperStyled,
  styleWalletPaper,
  styledBtnSwitchNetwork,
  styledCustomNetworkBtn,
} from '../safe-account.styles';
import { IOptionNetwork } from '@/constants/networks';
import { AccountInfo } from '../components/account-info/account-info';
import { formatterIcon } from '@/utils/icon-formatter';
import IconInfo from '@/assets/svg/infoIcon.svg';
import IconPlus from '@/assets/svg/plus.svg';
import { AddNetworkSchema } from '@/utils/validations.utils';
import { setNetworkDB } from '@/db/set-info';
import { customToasty } from '@/components';
import useActiveSafeAddress from '@/stores/safe-address-store';
import { useSafeSdk } from '@/hooks/useSafeSdk';
import useNetworkStore from '@/stores/networks-store';
import { NetworksSettings } from '@/app/settings/environment-variables';
import { updateSafeAccounts } from '@/utils/formatters';

interface IAddNetwork {
  name: string;
  chainId: string;
  rpc: string;
  explorerUrl: string;
}

export default function CreatePageAccount() {
  const [options, setOptions] = useState<IOptionNetwork[]>([]);
  const [valueAcc, setValueAcc] = useState('');
  const [errorNewNetwork, setErrorNewNetwork] = useState<string | null>(null);
  const [isChangeVariables, setIsChangeVariables] = useState(false);
  const [isLoadingSelect, setIsLoadingSelect] = useState(false);
  const [isAddNewNetwork, setIsAddNewNetwork] = useState(false);

  const { networks, setNetwork, chosenNetwork, setChosenNetwork } = useNetworkStore();
  const router = useRouter();
  const { address } = useWeb3ModalAccount();
  const { setIsLoading, isLoading, safeAddress } = useActiveSafeAddress();
  const { createSafe } = useSafeSdk();
  const { switchNetwork } = useSwitchNetwork();
  const { chainId } = useWeb3ModalAccount();
  const handleUpdateOptions = async (isFirstTime?: boolean) => {
    setIsLoadingSelect(true);
    setOptions(prevOptions => {
      const defaultNetworks = networks ?? [];
      const activeNetworks = isFirstTime ? defaultNetworks : prevOptions;
      setChosenNetwork(activeNetworks[0]);

      return activeNetworks;
    });

    setTimeout(() => setIsLoadingSelect(false), 300);
  };

  useEffect(() => {
    (async () => {
      if (!chosenNetwork) return;
      if (chainId !== chosenNetwork.chainId) {
        const network = options.find(network => network.chainId === chainId) ?? null;
        setChosenNetwork(network);
      }
    })();
  }, [options]);

  useEffect(() => {
    (async () => {
      await handleUpdateOptions(true);
    })();
  }, [networks]);

  const handleClickCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    router.push(routes.home);
  };

  const [errorValueAcc, setErrorValueAcc] = useState<string | null>(null);

  const handleNext = async () => {
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;

    if (addressRegex.test(valueAcc)) {
      setErrorValueAcc(null);

      setIsLoading(true);
      const safeSdkLocal = await createSafe(valueAcc);

      if (!safeSdkLocal) {
        console.error('<-- Error width address -->');
      }

      const localList = localStorage.getItem('createdSafes')
        ? localStorage.getItem('createdSafes')
        : null;

      updateSafeAccounts(chainId ?? options[0].chainId, [String(address)], valueAcc, localList);

      customToasty('Address was added', 'success');
      setIsLoading(false);
      router.push(routes.home);

      if (safeAddress) {
        await createSafe(safeAddress);
      }

      if (!safeSdkLocal) {
        customToasty('Please check the correctness of the address', 'error');
      }
      setIsLoading(false);
    } else {
      setErrorValueAcc('Account address must be correct');
    }
  };

  const handleSwitchNetwork = async () => {
    if (!chosenNetwork) return;
    await switchNetwork(chosenNetwork.chainId);
  };

  const handleSetValueAcc = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValueAcc(value);
  };

  const condNetwork = chosenNetwork && chainId !== chosenNetwork.chainId;

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
    if (options.find(elem => elem.rpc === rpc)) {
      setErrorNewNetwork('This RPC was added');
      customToasty('Error with adding a new network', 'error');
      return;
    }

    const newNetwork = {
      label: name,
      value: name,
      rpc: rpc,
      chainId: +chainId,
      currency: name,
    };

    const objNetworkDB = {
      ...newNetwork,
      id: uuid(),
      name,
      currency: name,
      explorerUrl,
      rpcUrl: rpc,
      symbol: name,
      decimals: 18,
    };

    setOptions(prevOptions => {
      return [...prevOptions, { ...newNetwork, icon: () => formatterIcon(newNetwork.chainId) }];
    });

    setNetwork(objNetworkDB);
    await setNetworkDB(objNetworkDB);
    setIsAddNewNetwork(false);
    customToasty('Network was add', 'success');
  };

  const handleCancelAddNetwork = () => {
    setIsAddNewNetwork(false);
    reset();
  };

  const handleChangeNetwork = async () => {
    setIsChangeVariables(false);
    await handleUpdateOptions();
  };

  const walletSelect = useMemo(
    () => (
      <WalletSelect
        isLoading={isLoadingSelect}
        options={options}
        defaultValue={chosenNetwork ?? options[0]}
        onChange={(newValue: IOptionNetwork | null | undefined) =>
          newValue && setChosenNetwork(newValue)
        }
      />
    ),
    [isLoadingSelect, options]
  );

  return (
    <WalletLayout hideSidebar>
      <WrapperStyled style={{ height: 'fit-content' }}>
        <WalletTypography className="safe-account_main-header" fontSize={22} fontWeight={600}>
          Add Safe Account
        </WalletTypography>

        <GridContainer>
          <Box display={'flex'} flexDirection={'column'} gap={4}>
            <WalletPaper style={styleWalletPaper} minWidth="653px">
              <Box display="flex" alignItems="center">
                <WalletTypography component="h2" fontSize={18} fontWeight={600}>
                  Select network and enter of address import account
                </WalletTypography>
              </Box>

              <Box display="flex" gap={themeMuiBase.spacing(3)}>
                <WalletInput
                  label="Safe address"
                  placeholder="Enter account address"
                  value={valueAcc}
                  onChange={handleSetValueAcc}
                  error={!!errorValueAcc}
                  errorValue={errorValueAcc}
                />

                <Box minWidth={'177px'} display={'flex'} alignItems={'end'}>
                  {walletSelect}
                </Box>
              </Box>
              <Box display={'flex'} flexDirection={'column'} mt={2}>
                <WalletButton
                  onClick={() => {
                    setIsAddNewNetwork(true);
                    setIsChangeVariables(false);
                  }}
                  variant="text"
                  styles={styledCustomNetworkBtn}
                >
                  <IconPlus color={themeMuiBase.palette.success} width="21px" height="21px" /> Add
                  custom network
                </WalletButton>
                <WalletButton
                  onClick={() => {
                    setIsAddNewNetwork(false);
                    setIsChangeVariables(true);
                  }}
                  variant="text"
                  styles={styledCustomNetworkBtn}
                >
                  <IconPlus color={themeMuiBase.palette.success} width="21px" height="21px" />{' '}
                  Change network variables
                </WalletButton>
              </Box>

              <WalletTypography fontWeight={500} fontSize={14}>
                By continuing, you agree to our terms of use and privacy policy.
              </WalletTypography>

              {condNetwork && (
                <WarningCreateAccounStyled>
                  <Box
                    display={'flex'}
                    sx={{ height: '100%', width: '44px', color: themeMuiBase.palette.error }}
                  >
                    <IconInfo />
                  </Box>
                  <Box display={'flex'} flexDirection={'column'} gap={2}>
                    <WalletTypography fontWeight={500}>Change your wallet network</WalletTypography>
                    <WalletTypography fontSize={14} fontWeight={400}>
                      Change your wallet network You are trying to create an account on{' '}
                      {chosenNetwork.label}. Make sure that your wallet is set to the same network.
                    </WalletTypography>
                    <WalletButton
                      variant="outlined"
                      styles={styledBtnSwitchNetwork}
                      onClick={handleSwitchNetwork}
                    >
                      Switch to{' '}
                      <Box display={'flex'} minWidth={'18px'}>
                        {formatterIcon(chosenNetwork.chainId, '18px', '18px')}
                      </Box>
                      {chosenNetwork.label}
                    </WalletButton>
                  </Box>
                </WarningCreateAccounStyled>
              )}

              <GridButtonStyled>
                <WalletButton onClick={handleClickCancel} variant="outlined">
                  Cancel
                </WalletButton>
                <WalletButton
                  onClick={handleNext}
                  variant="contained"
                  loading={isLoading}
                  disabled={!!condNetwork || !valueAcc.length}
                >
                  Next
                </WalletButton>
              </GridButtonStyled>
            </WalletPaper>

            {isAddNewNetwork && (
              <WalletPaper>
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
                    <WalletButton onClick={handleCancelAddNetwork} variant="outlined">
                      Cancel
                    </WalletButton>
                    <WalletButton type="submit" variant="contained">
                      <IconPlus color={themeMuiBase.palette.success} width="21px" height="21px" />
                      Add network
                    </WalletButton>
                  </GridButtonStyled>
                </form>
                <Box mt={4}>
                  <WalletTypography
                    fontWeight={400}
                    fontSize={14}
                    color={themeMuiBase.palette.error}
                  >
                    {errorNewNetwork}
                  </WalletTypography>
                </Box>
              </WalletPaper>
            )}

            {isChangeVariables && (
              <NetworksSettings
                isComponent
                handleSave={handleChangeNetwork}
                handleClose={() => setIsChangeVariables(false)}
              />
            )}
          </Box>

          {/* --- */}
          <AccountInfo account={address} chosenNetwork={chosenNetwork} />
        </GridContainer>
      </WrapperStyled>
      {/*  */}
    </WalletLayout>
  );
}
