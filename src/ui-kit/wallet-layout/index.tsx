import * as React from 'react';

import { Sidebar } from '@/components';

import { LayoutStyled } from './wallet-layout.styles';

interface IWalletLayoutProps {
  children: React.ReactNode;
  hideSidebar?: boolean;
}

export function WalletLayout({ children, hideSidebar }: IWalletLayoutProps) {
  return (
    <LayoutStyled>
      {!hideSidebar && <Sidebar />}
      {children}
    </LayoutStyled>
  );
}
