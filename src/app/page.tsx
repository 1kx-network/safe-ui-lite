'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';

import { WalletTypography } from '@/ui-kit/wallet-typography';
import ConnectButton from '@/common/connect-button';
import { WalletLayout } from '@/ui-kit';

import { ImageStyled, MainContainerStyled } from './home-page.styles';
import routes from './routes';

export default function Home() {
  const router = useRouter();
  const { isConnected } = useWeb3ModalAccount();

  useEffect(() => {
    if (isConnected) router.push(routes.safeAccountList);
  }, [isConnected, router]);

  return (
    <WalletLayout hideSidebar>
      <MainContainerStyled>
        <WalletTypography component="h1" fontSize={36} fontWeight={700} fontFamily="Inter">
          What it is?
        </WalletTypography>
        <ImageStyled />
        <ConnectButton />
      </MainContainerStyled>
    </WalletLayout>
  );
}
