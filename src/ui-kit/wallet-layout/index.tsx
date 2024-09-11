import * as React from 'react';
import { Box } from '@mui/system';

import { Sidebar, UserInfoBar } from '@/components';
import Loading from '@/assets/svg/loader.svg';
import { Bubble } from '@/components/bubble';

import { LayoutStyled, InfoUserStyled } from './wallet-layout.styles';

interface IWalletLayoutProps {
  children: React.ReactNode;
  hideSidebar?: boolean;
}

export function WalletLayout({ children, hideSidebar }: IWalletLayoutProps) {
  return (
    <LayoutStyled>
      <Bubble top={0} left={0} />
      <Bubble right={-10} bottom={0} opacity={0.25} />
      {!hideSidebar && <Sidebar />}

      {!hideSidebar && (
        <InfoUserStyled>
          <UserInfoBar />
        </InfoUserStyled>
      )}

      <React.Suspense
        fallback={
          <Box sx={{ height: '200px', width: '200px', margin: 'auto' }}>
            <Loading />
          </Box>
        }
      >
        {children}
      </React.Suspense>
    </LayoutStyled>
  );
}
