import * as React from 'react';
import { LayoutStyled } from './wallet-layout.styles';
import { Sidebar } from '@/components';

interface IWalletButtonProps {
  children: React.ReactNode;
}

export function WalletLayout({ children }: IWalletButtonProps) {
  return (
    <LayoutStyled>
      <Sidebar />
      {children}
    </LayoutStyled>
  );
}
