'use client';
import ConnectButton from './connect-button';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { MainContainerStyled } from './home-page.styles';
import { WalletTypography } from '@/ui-kit/wallet-typography';

export default function Home() {
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  console.log({ address, chainId, isConnected });
  return (
    <MainContainerStyled>
      <WalletTypography component="h1" fontSize={40}>
        Logo
      </WalletTypography>
      <ConnectButton />
      {isConnected && <WalletTypography>connected address:{address}</WalletTypography>}
    </MainContainerStyled>
  );
}
