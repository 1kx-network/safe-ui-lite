'use client';

import {
  useDisconnect,
  useSwitchNetwork,
  useWalletInfo,
  useWeb3Modal,
  useWeb3ModalAccount,
} from '@web3modal/ethers/react';
import { Box } from '@mui/system';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import * as utils from 'ethers';
import Link from 'next/link';

import { formattedLabel } from '@/utils/formatters';
import { WalletButton, WalletTypography } from '@/ui-kit';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import IconMenu from '@/assets/svg/arrow-menu.svg';
import { customToasty } from '..';
import routes from '@/app/routes';
import { useSafeSdk } from '@/hooks/useSafeSdk';
import useSafeStore from '@/stores/safe-store';
import useActiveSafeAddress from '@/stores/safe-address-store';
import { formatterIcon } from '@/utils/icon-formatter';
import { IOptionNetwork, optionsNetwork } from '@/constants/networks';
import { getNetworksDB } from '@/db/get-info';
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
  styledBtnDisconnect,
  ImgWalletStyled,
  styledNetworks,
  ItemInfoNetworkStyled,
} from './user-info-bar.styles';

export const UserInfoBar = () => {
  const { address, chainId } = useWeb3ModalAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const router = useRouter();
  const wrapperRef = useRef(null);
  const { safeSdk } = useSafeStore();
  const { getInfoByAccount } = useSafeSdk();
  const { walletInfo } = useWalletInfo();

  const { switchNetwork } = useSwitchNetwork();
  const { setClearActiveSafeStore, safeAddress } = useActiveSafeAddress();
  const searchParams = useMemo(() => {
    if (typeof window !== 'undefined') return new URLSearchParams(window.location.search);
    return { get: () => null };
  }, [router]);

  const { networks, chosenNetwork, setNetworksArray, setChosenNetwork } = useNetworkStore();

  const isShareAcc = searchParams.get('import') === TYPE_IMPORT.SHARE_ACC;
  const [balance, setBalance] = useState('0');

  const [isOpenNetworkMenu, setIsOpenNetworkMenu] = useState(false);
  const [isOpenNetworkModal, setIsOpenNetworkModal] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isCreateNewAccount, setIsCreateNewAccount] = useState(false);
  const [networksDBState, setNetworksDB] = useState<INetworkDB[]>([]);

  useEffect(() => {
    if (chainId) {
      if (chosenNetwork?.chainId) {
        const chosenNetworkDef = networks && networks.find(elem => elem.chainId === chainId);

        if (!chosenNetworkDef?.chainId) return;
        setChosenNetwork(chosenNetworkDef);
      }
    }
  }, [chainId]);

  useEffect(() => {
    if (isShareAcc) {
      (async () => {
        const fetchedNetworks = await getNetworksDB();
        setNetworksDB(fetchedNetworks);
      })();
    }
  }, [isShareAcc, defaultNetworks]);

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
      open();
    }
  };

  const handleClickNetworkMenu = () => {
    setIsOpenNetworkMenu(!isOpenMenu);
    setIsOpenMenu(false);
  };

  useEffect(() => {
    if (safeAddress) {
      Cookies.set('safeAddress', safeAddress);
    } else {
      Cookies.remove('safeAddress');
    }

    if (address) {
      Cookies.set('addressUser', address);
      setIsCreateNewAccount(false);
    } else {
      Cookies.remove('addressUser');
    }

    if (isCreateNewAccount && address) router.push(routes.safeAccountCreate);
  }, [address, isCreateNewAccount, safeAddress]);

  const handleDisconnect = async () => {
    await disconnect();
    Cookies.remove('addressUser');
    Cookies.remove('safeAddress');
    setIsOpenMenu(false);
    localStorage.removeItem('safeAddress');
    setClearActiveSafeStore();
    router.push(routes.home);
  };

  // const handleChangeNetwork = async (elem: IOptionNetwork) => {
  //   await switchNetwork(elem.chainId)
  //     .then(() => setChosenNetwork(elem))
  //     .finally(() => {
  //       setIsOpenNetworkMenu(false);
  //       setIsOpenNetworkModal(false);
  //     });
  // };

  const handleChangeNetwork = async (elem: IOptionNetwork) => {
    try {
      await switchNetwork(elem.chainId);
      setChosenNetwork(elem);
    } catch (error: any) {
      if (
        error.code === 4902 &&
        typeof window !== 'undefined' &&
        typeof window.ethereum !== 'undefined'
      ) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${Number(elem.chainId).toString(16)}`,
                chainName: elem.name,
                rpcUrls: [elem.rpc],
                nativeCurrency: {
                  name: elem.name,
                  symbol: elem.name,
                  // decimals: elem.decimals,
                },
                blockExplorerUrls: [elem.explorerUrl],
              },
            ],
          });
        } catch (addError) {
          console.error('Error add a new network:', addError);
        }
      } else {
        console.error('Error when you try change network:', error);
      }
    } finally {
      setIsOpenNetworkMenu(false);
      setIsOpenNetworkModal(false);
    }
  };

  return (
    <WrapperStyled ref={wrapperRef}>
      <WalletConnectUi />

      <InfoUserStyled onClick={handleClickMenu}>
        {address ? (
          <>
            <Box display={'flex'} alignItems={'center'} gap={1.5} zIndex={0}>
              {formatterIcon(chainId ?? 0, '16px', '16px')}
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
            Connect wallet
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
            <Box display={'flex'} alignItems={'center'} gap={2} overflow={'hidden'}>
              {chainId && formatterIcon(chainId, '16px', '16px')}
              <WalletTypography
                fontSize={14}
                fontWeight={400}
                color={themeMuiBase.palette.grey}
                style={{
                  pointerEvents: 'none',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                {chosenNetwork?.value}
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
                      onClick={() => handleChangeNetwork(elem)}
                      key={elem.chainId + elem.rpc}
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
            </BodyOpenStyled>
          )}
        </InfoUserStyled>
      )}

      <BodyOpenStyled isOpen={isOpenMenu}>
        <ItemInfoStyled noBorder>
          <WalletTypography fontSize={12} color={themeMuiBase.palette.grey}>
            {address && formattedLabel(address, 15, 15)}
          </WalletTypography>
          <IconCopyStyled onClick={handleCopyAddress} />
        </ItemInfoStyled>

        <ItemInfoStyled>
          <WalletTypography fontSize={12} color={themeMuiBase.palette.grey}>
            Wallet
          </WalletTypography>
          <Box display={'flex'} alignItems={'center'} gap={1}>
            {walletInfo && walletInfo.icon ? (
              <ImgWalletStyled src={walletInfo?.icon} alt="avatar" width={16} height={16} />
            ) : (
              formatterIcon(0, '16px', '16px')
            )}
            <WalletTypography fontSize={12} color={themeMuiBase.palette.white}>
              {walletInfo?.name ?? 'Uknown'}
            </WalletTypography>
          </Box>
        </ItemInfoStyled>

        <ItemInfoStyled>
          <WalletTypography fontSize={12} color={themeMuiBase.palette.grey}>
            Network
          </WalletTypography>
          <Box display={'flex'} alignItems={'center'} gap={1} overflow={'hidden'}>
            {chainId && formatterIcon(chainId, '16px', '16px')}
            <WalletTypography
              fontSize={12}
              color={themeMuiBase.palette.white}
              style={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {chosenNetwork?.value}
            </WalletTypography>
          </Box>
        </ItemInfoStyled>

        <ItemInfoStyled>
          <WalletTypography
            fontSize={12}
            color={themeMuiBase.palette.grey}
            style={{ whiteSpace: 'nowrap' }}
          >
            Safe RPC
          </WalletTypography>
          <Link href={chosenNetwork?.rpc ?? '/'} target="_black">
            <Box
              display={'flex'}
              alignItems={'left'}
              width={'100%'}
              sx={{ overflowWrap: 'break-word' }}
            >
              <WalletTypography
                fontSize={12}
                color={themeMuiBase.palette.white}
                style={{ width: '100%' }}
              >
                {chosenNetwork?.rpc ?? ''}
              </WalletTypography>
            </Box>
          </Link>
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
          <WalletButton variant="text" styles={styledBtnDisconnect} onClick={handleDisconnect}>
            Disconnect
          </WalletButton>
        </GridButtonStyled>
      </BodyOpenStyled>
    </WrapperStyled>
  );
};
