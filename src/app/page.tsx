'use client';

import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';

import { WalletTypography } from '@/ui-kit/wallet-typography';
import ConnectButton from '@/common/connect-button';
import { WalletLayout } from '@/ui-kit';

import { ImageStyled, MainContainerStyled } from './home-page.styles';
import routes from './routes';

export default function Home() {
  const { isConnected } = useAccount();
  const router = useRouter();
  useEffect(() => {
    if (isConnected) router.push(routes.safeAccountCreate);
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
