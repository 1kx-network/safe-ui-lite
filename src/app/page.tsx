'use client';
// import { useWeb3ModalAccount } from '@web3modal/ethers/react';

import { WalletTypography } from '@/ui-kit/wallet-typography';
import ConnectButton from '@/common/connect-button';

import { MainContainerStyled } from './home-page.styles';

export default function Home() {
  // const { address, chainId, isConnected } = useWeb3ModalAccount();

  return (
    <MainContainerStyled>
      <WalletTypography component="h1" fontSize={36} fontWeight={700} fontFamily="Inter">
        What it is?
      </WalletTypography>
      <ConnectButton />
    </MainContainerStyled>
  );
}
