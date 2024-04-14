'use client';

import { useDisconnect, useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers/react';
import { Box } from '@mui/system';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import * as utils from 'ethers';

import { formattedLabel } from '@/utils/foramtters';
import { WalletButton, WalletTypography } from '@/ui-kit';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import IconMenu from '@/assets/svg/arrow-menu.svg';
import { CustomModal, customToasty } from '..';
import routes from '@/app/routes';
import { useSafeSdk } from '@/hooks/useSafeSdk';
import useSafeStore from '@/stores/safe-store';
import useActiveSafeAddress from '@/stores/safe-address-store';
import { formatterIcon } from '@/utils/icon-formatter';
import { useNetwork } from '@/hooks/useNetwork';
import WCIcon from '@/assets/svg/wc.svg';

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
  WCButton,
} from './user-info-bar.styles';
import { WalletConnectPopup } from './wallet-connect-popup';

export const UserInfoBar = () => {
  const { address, chainId } = useWeb3ModalAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const router = useRouter();
  const wrapperRef = useRef(null);
  const { safeSdk } = useSafeStore();
  const { getInfoByAccount } = useSafeSdk();
  const [balance, setBalance] = useState('0');
  const { setClearActiveSafeStore } = useActiveSafeAddress();
  const network = useNetwork();

  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isWCPopupOpen, setIsWCPopupOpen] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isCreateNewAccount, setIsCreateNewAccount] = useState(false);

  const networkName =
    (network?.name || '').toString().charAt(0).toUpperCase() +
    (network?.name || '').toString().slice(1);

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
    } else {
      setIsOpenModal(true);
    }
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

  const toggleWCPopup = () => {
    setIsWCPopupOpen(!isWCPopupOpen);
  };

  return (
    <WrapperStyled ref={wrapperRef}>
      <WCButton onClick={toggleWCPopup}>
        <WCIcon />
      </WCButton>
      <InfoUserStyled onClick={handleClickMenu}>
        {address ? (
          <>
            <Box display={'flex'} alignItems={'center'} gap={1} zIndex={0}>
              {chainId && formatterIcon(chainId, '16px', '16px')}
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
      <WalletConnectPopup isOpen={isWCPopupOpen} toggle={toggleWCPopup} />
    </WrapperStyled>
  );
};
