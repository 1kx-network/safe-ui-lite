import * as React from 'react';
import { ButtonStyled } from './button.styles';

interface IWalletButtonProps {
  children: React.ReactNode;
  onClick: () => void;
}
export default function WalletButton({ children, onClick }: IWalletButtonProps) {
  return <ButtonStyled onClick={onClick}>{children}</ButtonStyled>;
}
