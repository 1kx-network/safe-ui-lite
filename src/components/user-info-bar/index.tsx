import { Box } from '@mui/system';
import { useEffect, useRef, useState } from 'react';

import { formattedLabel } from '@/utils/foramtters';
import { WalletButton, WalletTypography } from '@/ui-kit';
import IconDefaultAdd from '@/assets/svg/defult-icon-address.svg';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import IconMenu from '@/assets/svg/arrow-menu.svg';

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

const address = '0x159a07c50646A90654a67FD105dec87bdB11ca9B';

export const UserInfoBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !(wrapperRef.current as Node).contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
  };

  const handleClickMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <WrapperStyled ref={wrapperRef}>
      <InfoUserStyled onClick={handleClickMenu}>
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

        <IconArrowStyled isOpen={isOpen}>
          <IconMenu />
        </IconArrowStyled>
      </InfoUserStyled>

      <BodyOpenStyled isOpen={isOpen}>
        <ItemInfoStyled noBorder>
          <WalletTypography fontSize={12} color={themeMuiBase.palette.grey}>
            {formattedLabel(address, 6, 4)}
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
    </WrapperStyled>
  );
};
