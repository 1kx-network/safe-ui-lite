import * as React from 'react';
import { Box } from '@mui/system';

import { Sidebar, UserInfoBar } from '@/components';
import Loading from '@/assets/svg/loader.svg';

import { LayoutStyled, InfoUserStyled } from './wallet-layout.styles';

interface IWalletLayoutProps {
  children: React.ReactNode;
  hideSidebar?: boolean;
}

export function WalletLayout({ children, hideSidebar }: IWalletLayoutProps) {
  return (
    <LayoutStyled>
      {!hideSidebar && <Sidebar />}

      {!hideSidebar && (
        <InfoUserStyled>
          <UserInfoBar />
        </InfoUserStyled>
      )}

      <React.Suspense
        fallback={
          <Box sx={{ height: '150px', width: '150px', margin: 'auto' }}>
            <Loading />
          </Box>
        }
      >
        {children}
      </React.Suspense>
    </LayoutStyled>
  );
}
