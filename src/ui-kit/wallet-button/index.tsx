import * as React from 'react';
import { ButtonStyled } from './wallet-button.styles';

interface IWalletButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export function WalletButton({ onClick, children }: IWalletButtonProps) {
  return <ButtonStyled onClick={onClick}>{children}</ButtonStyled>;
}
