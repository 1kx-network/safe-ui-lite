'use client';
import * as React from 'react';
import { useWeb3Modal } from '@web3modal/wagmi/react';

import { WalletTypography } from '@/ui-kit';
import { themeMuiBase } from '@/assets/styles/theme-mui';

import { WalletConnectButtonStyled } from './connect-button.styles';

const ConnectButton = () => {
  const { open } = useWeb3Modal();

  const handleOpen = () => {
    open();
  };

  return (
    <WalletConnectButtonStyled onClick={handleOpen}>
      <WalletTypography fontSize={20} color={themeMuiBase.palette.white}>
        Connect wallet
      </WalletTypography>
    </WalletConnectButtonStyled>
  );
};

export default ConnectButton;
