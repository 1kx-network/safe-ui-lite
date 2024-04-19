'use client';

import {
  useDisconnect,
  useSwitchNetwork,
  useWeb3Modal,
  useWeb3ModalAccount,
} from '@web3modal/ethers/react';
import { Box } from '@mui/system';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import * as utils from 'ethers';
import { v4 as uuid } from 'uuid';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { formattedLabel } from '@/utils/foramtters';
import { WalletButton, WalletInput, WalletTypography } from '@/ui-kit';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import IconMenu from '@/assets/svg/arrow-menu.svg';
import IconPlus from '@/assets/svg/plus.svg';
import IconDefaultAddress from '@/assets/svg/defult-icon-address.svg';
import { CustomModal, customToasty } from '..';
import routes from '@/app/routes';
import { useSafeSdk } from '@/hooks/useSafeSdk';
import useSafeStore from '@/stores/safe-store';
import useActiveSafeAddress from '@/stores/safe-address-store';
import { formatterIcon } from '@/utils/icon-formatter';
import { useNetwork } from '@/hooks/useNetwork';
import { optionsNetwork } from '@/constants/networks';
import { getNetworksDB } from '@/db/get-info';
import { AddNetworkSchema } from '@/utils/validations.utils';
import { addCustomNetworkDB } from '@/db/set-info';
import { TYPE_IMPORT } from '@/constants/types';
import { INetworkDB } from '@/db';
import useNetworkStore from '@/stores/networks-store';
import { networks as defaultNetworks } from '@/context/networks';
import WalletConnectUi from '@/features/walletconnect/components';

import {
  WrapperStyled,
  InfoUserStyled,
  BodyOpenStyled,
  ItemInfoStyled,
  GridButtonStyled,
  IconArrowStyled,
  IconCopyStyled,
  styledBtn,
  styledBtnDisconnect,
  ItemInfoNetworkStyled,
  styledNetworks,
  styledBtnAddNetwork,
} from './user-info-bar.styles';

interface IAddNetwork {
  name: string;
  chainId: string;
  rpc: string;
  symbol: string;
  decimals: string;
  explorerUrl: string;
}

export const UserInfoBar = () => {
  const { address, chainId } = useWeb3ModalAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const router = useRouter();
  const wrapperRef = useRef(null);
  const { safeSdk } = useSafeStore();
  const { getInfoByAccount } = useSafeSdk();
  const network = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { setClearActiveSafeStore } = useActiveSafeAddress();
  const searchParams = useSearchParams();
  const { networks, setNetwork, setNetworksArray } = useNetworkStore();

  const isShareAcc = searchParams.get('import') === TYPE_IMPORT.SHARE_ACC;

  const [balance, setBalance] = useState('0');
  // const [options, setOptions] = useState<IOptionNetwork[]>(networks);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isOpenNetworkMenu, setIsOpenNetworkMenu] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenNetworkModal, setIsOpenNetworkModal] = useState(false);
  const [isCreateNewAccount, setIsCreateNewAccount] = useState(false);
  const [errorNewNetwork, setErrorNewNetwork] = useState<string | null>(null);
  const [networksDBState, setNetworksDB] = useState<INetworkDB[]>([]);

  const networkName =
    (network?.name || '').toString().charAt(0).toUpperCase() +
    (network?.name || '').toString().slice(1);

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<IAddNetwork>({
    mode: 'onSubmit',
    resolver: yupResolver(AddNetworkSchema),
  });

  useEffect(() => {
    if (isShareAcc) {
      (async () => {
        const fetchedNetworks = await getNetworksDB();
        setNetworksDB(fetchedNetworks);
      })();
    }
  }, [isShareAcc, defaultNetworks]);

  // useEffect(() => {
  //   (async () => {
  //     const networksDB = await getNetworksDB();
  //     const updateNetwork: IOptionNetwork[] = networksDB.map(elem => ({
  //       id: elem.id,
  //       name: elem.name,
  //       currency: elem.currency,
  //       explorerUrl: elem.explorerUrl,
  //       rpcUrl: elem.rpcUrl,
  //       symbol: elem.symbol,
  //       decimals: elem.decimals,
  //       chainId: elem.chainId,
  //       label: elem.name,
  //       value: elem.name,
  //       rpc: elem.rpcUrl,
  //       icon: () => formatterIcon(elem.chainId ?? 0),
  //     }));

  //     const networksArrayDB =[...optionsNetwork, ...updateNetwork].filter(elem => elem.chainId)

  //     setNetworksArray([...optionsNetwork, ...updateNetwork]);
  //   })();
  // }, [networks, networksDB]);

  useEffect(() => {
    (async () => {
      const networksDB = await getNetworksDB();

      const updateNetwork = networksDB.map(elem => ({
        ...elem,
        label: elem.name,
        value: elem.name,
        rpc: elem.rpcUrl,
        icon: () => formatterIcon(elem.chainId ?? 0),
      }));

      const updatedArray = optionsNetwork.map(
        option => updateNetwork.find(network => network.chainId === option.chainId) || option
      );

      const networkArray = [
        ...updatedArray,
        ...updateNetwork.filter(network => !updatedArray.some(n => n.chainId === network.chainId)),
      ];
      console.log(networkArray);

      setNetworksArray(networkArray);
    })();
  }, [defaultNetworks, networksDBState]);

  useEffect(() => {
    (async () => {
      if (address && safeSdk) {
        const dataInfo = await getInfoByAccount(safeSdk);
        if (dataInfo) {
          setBalance(dataInfo.balanceAccount.toString());
        }
      }
    })();
  }, [address, safeSdk]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !(wrapperRef.current as Node).contains(event.target as Node)) {
        setIsOpenMenu(false);
        setIsOpenNetworkMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      customToasty('Address was copy', 'success');
    }
  };

  const handleClickMenu = () => {
    if (address) {
      setIsOpenMenu(!isOpenMenu);
      setIsOpenNetworkMenu(false);
    } else {
      setIsOpenModal(true);
    }
  };

  const handleClickNetworkMenu = () => {
    setIsOpenNetworkMenu(!isOpenMenu);
    setIsOpenMenu(false);
  };

  useEffect(() => {
    if (address) {
      Cookies.set('addressUser', address);
      setIsOpenModal(false);
      setIsCreateNewAccount(false);
    } else {
      Cookies.remove('addressUser');
    }

    if (isCreateNewAccount && address) router.push(routes.safeAccountCreate);
  }, [address, isCreateNewAccount]);

  const handleConnect = async () => {
    setIsCreateNewAccount(true);
    open();
  };

  const handleConnectExisting = async () => {
    open();
  };

  const handleDisconnect = async () => {
    await disconnect();
    Cookies.remove('addressUser');
    setIsOpenMenu(false);
    localStorage.removeItem('safeAddress');
    setClearActiveSafeStore();
    router.push(routes.home);
  };

  const handleAddNetwork = async () => {
    reset();
    setIsOpenMenu(false);
    setIsOpenNetworkMenu(false);

    setIsOpenNetworkModal(true);
  };

  // const { walletProvider } = useWeb3ModalProvider();

  const handleChangeNetwork = async (chainId: number) => {
    await switchNetwork(chainId).finally(() => {
      setIsOpenNetworkMenu(false);
      setIsOpenNetworkModal(false);
    });
  };

  // const network = networks.find(elem => elem.chainId === chainId);
  // if (!network) return;
  // try {
  //   // Пытаемся переключиться на указанный RPC
  //   await walletProvider
  //     .request({
  //       method: 'wallet_switchToNetwork',
  //       params: [
  //         {
  //           chainId: network.rpcUrl,
  //           chainName: 'Custom Network',
  //           rpcUrl: network.rpcUrl,
  //           chainId: `0x${(await walletProvider.request({ method: 'net_version' })).toString(16)}`,
  //         },
  //       ],
  //     })
  //     .catch(err => console.log(err));
  //   console.log('Switched to RPC:', network.rpcUrl);
  // } catch (error) {
  //   // Если сеть не найдена, добавляем её
  //   if (error.code === 4902) {
  //     console.log('Network not added, adding now...');

  // try {
  //   await walletProvider.request({
  //     method: 'wallet_addEthereumChain',
  //     params: {
  //       chainId: network.rpcUrl,
  //       chainName: 'Custom Network',
  //       nativeCurrency: {
  //         name: 'Custom',
  //         symbol: 'CST',
  //         decimals: 18,
  //       },
  //       rpcUrls: [network.rpcUrl],
  //       blockExplorerUrls: ['https://explorer.example.com'], // Замените на ваш URL блокчейн-эксплорера
  //     },
  //   });
  //   console.log('Added and switched to RPC:', network.rpcUrl);
  // } catch (addError) {
  //   console.error('Failed to add network:', addError);
  // }
  //   } else {
  //     console.error('Failed to switch network:', error);
  //   }
  // }

  //   console.log('_rpcUrl_', network?.rpcUrl);

  //   try {
  //     await walletProvider.request({
  //       method: 'wallet_switchEthereumChain',
  //       params: [{ chainId: network?.rpcUrl }],
  //     });
  //     console.log('Switched to RPC:', network?.rpcUrl);
  //   } catch (error) {
  //     console.error('Failed to switch network:', error);
  //   }
  // };

  const onSubmit: SubmitHandler<IAddNetwork> = async (data: IAddNetwork) => {
    const { name, rpc, symbol, decimals, explorerUrl, chainId } = data;

    if (networks && networks.some(option => option.rpc === rpc)) {
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

    setErrorNewNetwork(null);
    setNetwork(newNetwork);

    await addCustomNetworkDB(objNetworkDB);
    setIsOpenNetworkModal(false);
    customToasty('Network was add', 'success');
  };

  return (
    <WrapperStyled ref={wrapperRef}>
      <WalletConnectUi />

      <InfoUserStyled onClick={handleClickMenu}>
        {address ? (
          <>
            <Box display={'flex'} alignItems={'center'} gap={1.5} zIndex={0}>
              <IconDefaultAddress width="16px" height="16px" />
              <WalletTypography
                fontSize={12}
                fontWeight={400}
                color={themeMuiBase.palette.grey}
                style={{ pointerEvents: 'none' }}
              >
                {formattedLabel(address, 5, 9)}
              </WalletTypography>
            </Box>

            <IconArrowStyled isOpen={isOpenMenu}>
              <IconMenu />
            </IconArrowStyled>
          </>
        ) : (
          <WalletTypography
            fontSize={14}
            fontWeight={400}
            textAlign="center"
            style={{ width: '100%' }}
            color={themeMuiBase.palette.grey}
          >
            Create accont
          </WalletTypography>
        )}
      </InfoUserStyled>

      {chainId && (
        <InfoUserStyled sx={{ width: '150px' }} onClick={handleClickNetworkMenu}>
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            width={'100%'}
            style={{ pointerEvents: 'none' }}
          >
            <Box display={'flex'} alignItems={'center'} gap={2}>
              {chainId && formatterIcon(chainId, '16px', '16px')}
              <WalletTypography
                fontSize={14}
                fontWeight={400}
                color={themeMuiBase.palette.grey}
                style={{ pointerEvents: 'none' }}
              >
                {networkName}
              </WalletTypography>
            </Box>
            <IconArrowStyled isOpen={isOpenNetworkMenu}>
              <IconMenu />
            </IconArrowStyled>
          </Box>

          {isOpenNetworkMenu && !isOpenNetworkModal && (
            <BodyOpenStyled isOpen={true} sx={styledNetworks}>
              <Box display={'flex'} flexDirection={'column'} gap={1}>
                {networks &&
                  networks.map(elem => (
                    <ItemInfoNetworkStyled
                      onClick={() => handleChangeNetwork(elem.chainId)}
                      key={elem.chainId}
                    >
                      {formatterIcon(elem.chainId, '16px', '16px')}
                      <WalletTypography
                        fontSize={14}
                        color={themeMuiBase.palette.grey}
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {elem.value}
                      </WalletTypography>
                    </ItemInfoNetworkStyled>
                  ))}
              </Box>

              <WalletButton variant="text" styles={styledBtnAddNetwork} onClick={handleAddNetwork}>
                <IconPlus width="18px" height="18px" color={themeMuiBase.palette.success} />
                Add network
              </WalletButton>
            </BodyOpenStyled>
          )}
        </InfoUserStyled>
      )}

      <BodyOpenStyled isOpen={isOpenMenu}>
        <ItemInfoStyled noBorder>
          <WalletTypography fontSize={12} color={themeMuiBase.palette.grey}>
            {address && formattedLabel(address, 6, 9)}
          </WalletTypography>
          <IconCopyStyled onClick={handleCopyAddress} />
        </ItemInfoStyled>
        <ItemInfoStyled>
          <WalletTypography fontSize={12} color={themeMuiBase.palette.grey}>
            Wallet
          </WalletTypography>
          <WalletTypography fontSize={12} color={themeMuiBase.palette.white}>
            MetaMask
          </WalletTypography>
        </ItemInfoStyled>
        <ItemInfoStyled>
          <WalletTypography fontSize={12} color={themeMuiBase.palette.grey}>
            Network
          </WalletTypography>
          <Box display={'flex'} alignItems={'center'} gap={1}>
            {chainId && formatterIcon(chainId, '16px', '16px')}
            <WalletTypography fontSize={12} color={themeMuiBase.palette.white}>
              {networkName}
            </WalletTypography>
          </Box>
        </ItemInfoStyled>
        <ItemInfoStyled>
          <WalletTypography fontSize={12} color={themeMuiBase.palette.grey}>
            Balance
          </WalletTypography>
          <WalletTypography fontSize={12} color={themeMuiBase.palette.white}>
            {utils.formatEther(balance)} ETH
          </WalletTypography>
        </ItemInfoStyled>

        <GridButtonStyled>
          <WalletButton variant="outlined" styles={styledBtn} onClick={() => open()}>
            Switch Wallet
          </WalletButton>
          <WalletButton variant="text" styles={styledBtnDisconnect} onClick={handleDisconnect}>
            Disconnect
          </WalletButton>
        </GridButtonStyled>
      </BodyOpenStyled>

      <CustomModal
        title=""
        isOpen={isOpenModal}
        closeModal={() => setIsOpenModal(false)}
        styles={{
          minWidth: '360px',
          maxWidth: '560px',
        }}
      >
        <Box
          display={'flex'}
          justifyContent={'center'}
          flexDirection={'column'}
          gap={4}
          alignItems={'center'}
        >
          <WalletTypography fontSize={22} fontWeight={600} textAlign={'center'}>
            Get started
          </WalletTypography>
          <WalletTypography
            fontSize={14}
            fontWeight={400}
            color={themeMuiBase.palette.tetriaryGrey}
            textAlign={'center'}
          >
            The most trusted decentralized custody protocol and collective asset management platform
          </WalletTypography>
          <WalletButton variant="contained" onClick={handleConnectExisting}>
            + Add Existing Account
          </WalletButton>

          <WalletButton variant="contained" onClick={handleConnect}>
            Create Account
          </WalletButton>
        </Box>
      </CustomModal>

      <CustomModal
        title=""
        isOpen={isOpenNetworkModal}
        closeModal={() => setIsOpenNetworkModal(false)}
        styles={{
          minWidth: '360px',
          maxWidth: '560px',
        }}
      >
        <WalletTypography fontSize={18} fontWeight={500}>
          Add new network
        </WalletTypography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display={'flex'} width="100%" gap={4} mt={2}>
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
          <Box display={'flex'} gap={4} mt={8} mb={4}>
            <WalletButton onClick={() => reset()} variant="outlined">
              Cancel
            </WalletButton>
            <WalletButton type="submit" variant="contained">
              <IconPlus color={themeMuiBase.palette.success} width="21px" height="21px" />
              Add network
            </WalletButton>
          </Box>
        </form>

        <WalletTypography fontWeight={400} fontSize={14} color={themeMuiBase.palette.error}>
          {errorNewNetwork}
        </WalletTypography>
      </CustomModal>
    </WrapperStyled>
  );
};
