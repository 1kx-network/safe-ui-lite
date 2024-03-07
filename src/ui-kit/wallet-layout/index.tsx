import * as React from 'react';
import { LayoutStyled } from './wallet-layout.styles';
import { Sidebar } from '@/components';

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
