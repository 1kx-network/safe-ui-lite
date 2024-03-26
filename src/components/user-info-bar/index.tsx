'use client';

import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers/react';
import { Box } from '@mui/system';
import { useEffect, useRef, useState } from 'react';

import { formattedLabel } from '@/utils/foramtters';
import { WalletButton, WalletTypography } from '@/ui-kit';
import IconDefaultAdd from '@/assets/svg/defult-icon-address.svg';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import IconMenu from '@/assets/svg/arrow-menu.svg';
import { CustomModal } from '..';

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
} from './user-info-bar.styles';

export const UserInfoBar = () => {
  const { address } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();

  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const wrapperRef = useRef(null);

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
    if (address) navigator.clipboard.writeText(address);
  };

  const handleClickMenu = () => {
    if (address) {
      setIsOpenMenu(!isOpenMenu);
    } else {
      setIsOpenModal(true);
    }
  };

  const handleConnect = async () => {
    try {
      await open();
      setIsOpenModal(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <WrapperStyled ref={wrapperRef}>
      <InfoUserStyled onClick={handleClickMenu}>
        {address ? (
          <>
            <Box display={'flex'} alignItems={'center'} gap={1} zIndex={0}>
              <IconDefaultAdd />
              <WalletTypography
                fontSize={12}
                fontWeight={400}
                color={themeMuiBase.palette.grey}
                style={{ pointerEvents: 'none' }}
              >
                <WalletTypography fontSize={12} color={themeMuiBase.palette.white}>
                  gno:{' '}
                </WalletTypography>
                {formattedLabel(address, 6, 4)}
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
            color={themeMuiBase.palette.white}
          >
            Create accont
          </WalletTypography>
        )}
      </InfoUserStyled>

      <BodyOpenStyled isOpen={isOpenMenu}>
        <ItemInfoStyled noBorder>
          <WalletTypography fontSize={12} color={themeMuiBase.palette.grey}>
            {address && formattedLabel(address, 6, 4)}
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
            Balance
          </WalletTypography>
          <WalletTypography fontSize={12} color={themeMuiBase.palette.white}>
            12.00 USD
          </WalletTypography>
        </ItemInfoStyled>

        <GridButtonStyled>
          <WalletButton variant="outlined" styles={styledBtn}>
            Switch Wallet
          </WalletButton>
          <WalletButton variant="text" styles={styledBtnDisconnect}>
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
          <WalletButton variant="contained" onClick={handleConnect}>
            Create Account
          </WalletButton>
        </Box>
      </CustomModal>
    </WrapperStyled>
  );
};
