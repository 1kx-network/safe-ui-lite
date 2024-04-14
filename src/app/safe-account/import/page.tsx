'use client';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { useSwitchNetwork, useWeb3ModalAccount } from '@web3modal/ethers/react';
import { useRouter } from 'next/navigation';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { v4 as uuid } from 'uuid';

import { useNetwork } from '@/hooks/useNetwork';
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
import { IOptionNetwork, optionsNetwork, safeNetworksObj } from '@/constants/networks';
import { AccountInfo } from '../components/account-info/account-info';
import { formatterIcon } from '@/utils/icon-formatter';
import IconInfo from '@/assets/svg/infoIcon.svg';
import IconPlus from '@/assets/svg/plus.svg';
import { AddNetworkSchema } from '@/utils/validations.utils';
import { addCustomNetworkDB } from '@/db/set-info';
import { getNetworksDB } from '@/db/get-info';
import { customToasty } from '@/components';
import useActiveSafeAddress from '@/stores/safe-address-store';
import { useSafeSdk } from '@/hooks/useSafeSdk';

interface IAddNetwork {
  name: string;
  chainId: string;
  rpc: string;
  symbol: string;
  decimals: string;
  explorerUrl: string;
}

export default function CreatePageAccount() {
  const [options, setOptions] = useState<IOptionNetwork[]>(optionsNetwork);
  const [chooseOpt, setChooseOpt] = useState(optionsNetwork[0]);
  const [valueAcc, setValueAcc] = useState('');
  const [chooseNetwork, setChooseNetwork] = useState<IOptionNetwork>(optionsNetwork[0]);
  const [errorNewNetwork, setErrorNewNetwork] = useState<string | null>(null);

  const router = useRouter();
  const { address } = useWeb3ModalAccount();
  const network = useNetwork();

  const { setIsLoading, safeAddress } = useActiveSafeAddress();
  const { createSafe } = useSafeSdk();

  const networkName = network?.name.toString();
  const chainId = Number(network?.chainId);

  useEffect(() => {
    (async () => {
      const networksDB = await getNetworksDB();
      const updateNetwork = networksDB.map(elem => ({
        label: elem.name,
        value: elem.name,
        rpc: elem.rpcUrl,
        icon: () => formatterIcon(0),
        ...elem,
      }));

      setOptions(prevOptions => {
        const uniqueNetworks = updateNetwork.filter(
          network => !prevOptions.some(option => option.rpc === network.rpcUrl)
        );
        return [...prevOptions, ...uniqueNetworks];
      });
    })();
  }, []);

  useEffect(() => {
    if (chainId) {
      const updatedOption = options.find(option => option.chainId === +chainId);
      if (updatedOption) {
        setChooseOpt(updatedOption);
      }
    }
  }, [chainId]);

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
        console.log('Error width address');
      }
      const isOwner = await safeSdkLocal?.isOwner(valueAcc);

      if (isOwner) {
        const localList = localStorage.getItem('createdSafes')
          ? localStorage.getItem('createdSafes')
          : null;
        const localListParsed = localList ? JSON.parse(localList) : safeNetworksObj;
        const updateLocalList =
          chainId && localListParsed[String(chainId)] === undefined
            ? {
                ...localListParsed,
                [chainId]: [],
              }
            : localList;
        updateLocalList[chainId ?? 1].push(valueAcc);
        localStorage.setItem('createdSafes', JSON.stringify(updateLocalList));
        localStorage.setItem('safeAddress', valueAcc);

        customToasty('Address was added', 'success');
        setIsLoading(false);
        router.push(routes.home);
        return;
      }

      if (safeAddress) {
        await createSafe(safeAddress);
      }

      customToasty(
        'Please check the correctness of the address or check that you are the owner this account',
        'error',
        {
          duration: 5000,
        }
      );
      setIsLoading(false);
    } else {
      setErrorValueAcc('Account address must be correct');
    }
  };

  const handleChooseNetwork = async (chooseNetwork: IOptionNetwork) => {
    setChooseNetwork(chooseNetwork);
  };

  const { switchNetwork } = useSwitchNetwork();

  const handleSwitchNetwork = async () => {
    if (!chooseNetwork.chainId) return;
    await switchNetwork(chooseNetwork.chainId);
  };

  const handleSetValueAcc = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValueAcc(value);
  };

  const condNetwork = chooseNetwork && chainId !== chooseNetwork.chainId;

  const [isAddNewNetwork, setIsAddNewNetwork] = useState(false);

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
    const { name, rpc, symbol, decimals, explorerUrl, chainId } = data;
    if (options.find(({ rpc }) => rpc === rpc)) {
      setErrorNewNetwork('This RPC was added');
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
      id: uuid(),
      name,
      currency: name,
      explorerUrl,
      rpcUrl: rpc,
      symbol: symbol,
      decimals: +decimals,
    };

    setOptions(prevOptions => {
      return [...prevOptions, { ...newNetwork, icon: () => formatterIcon(0) }];
    });

    await addCustomNetworkDB(objNetworkDB);
    setIsAddNewNetwork(false);
    customToasty('Network was add', 'success');
  };

  const handleCancelAddNetwork = () => {
    setIsAddNewNetwork(false);
    reset();
  };

  return (
    <WalletLayout hideSidebar>
      <WrapperStyled style={{ height: 'fit-content' }}>
        <WalletTypography className="safe-account_main-header" fontSize={22} fontWeight={600}>
          Import Safe Account
        </WalletTypography>

        <GridContainer>
          <Box display={'flex'} flexDirection={'column'} gap={4}>
            <WalletPaper style={styleWalletPaper} minWidth="653px">
              <Box display="flex" alignItems="center">
                {/* <StepStyled>
                  <WalletTypography fontSize={18} fontWeight={600} color="#fff">
                    1
                  </WalletTypography>
                </StepStyled> */}
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
                  <WalletSelect
                    options={options}
                    defaultValue={chooseOpt}
                    onChange={(newValue: IOptionNetwork | null | undefined) =>
                      newValue && handleChooseNetwork(newValue)
                    }
                  />
                </Box>
              </Box>
              <Box display={'flex'} flexDirection={'row-reverse'}>
                <WalletButton
                  onClick={() => setIsAddNewNetwork(true)}
                  variant="text"
                  styles={styledCustomNetworkBtn}
                >
                  <IconPlus color={themeMuiBase.palette.success} width="21px" height="21px" /> Add
                  custom network
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
                      {chooseNetwork.label}. Make sure that your wallet is set to the same network.
                    </WalletTypography>
                    <WalletButton
                      variant="outlined"
                      styles={styledBtnSwitchNetwork}
                      onClick={handleSwitchNetwork}
                    >
                      Switch to{' '}
                      <Box display={'flex'} minWidth={'18px'}>
                        {formatterIcon(chooseNetwork.chainId, '18px', '18px')}
                      </Box>
                      {chooseNetwork.label}
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
                    </Box>
                    <Box display={'flex'} flexDirection={'column'} gap={1} width="50%">
                      <Controller
                        control={control}
                        name="symbol"
                        render={({ field }) => (
                          <Box width={'100%'}>
                            <WalletInput
                              {...field}
                              label="Symbol"
                              error={!!errors.symbol}
                              errorValue={errors.symbol?.message}
                            />
                          </Box>
                        )}
                      />

                      <Controller
                        control={control}
                        name="decimals"
                        render={({ field }) => (
                          <Box width={'100%'}>
                            <WalletInput
                              {...field}
                              label="Decimals"
                              error={!!errors.decimals}
                              errorValue={errors.decimals?.message}
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
          </Box>

          {/* --- */}
          <AccountInfo account={address} networkName={networkName} chainId={chainId} />
        </GridContainer>
      </WrapperStyled>
      {/*  */}
    </WalletLayout>
  );
}
