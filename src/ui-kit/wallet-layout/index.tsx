import * as React from 'react';
import { LayoutStyled } from './wallet-layout.styles';

interface IWalletButtonProps {
  children: React.ReactNode;
}

export function WalletLayout({ children }: IWalletButtonProps) {
  return <LayoutStyled>{children}</LayoutStyled>;
}
