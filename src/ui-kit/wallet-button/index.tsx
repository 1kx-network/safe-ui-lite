import * as React from 'react';
import { ButtonStyled } from './wallet-button.styles';

interface IWalletButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  styles?: React.CSSProperties;
}

export function WalletButton({ onClick, children, styles }: IWalletButtonProps) {
  return (
    <ButtonStyled style={styles} onClick={onClick}>
      {children}
    </ButtonStyled>
  );
}
