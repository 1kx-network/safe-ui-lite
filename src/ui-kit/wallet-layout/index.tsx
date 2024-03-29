import * as React from 'react';

import { Sidebar, UserInfoBar } from '@/components';

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
      {children}
    </LayoutStyled>
  );
}
