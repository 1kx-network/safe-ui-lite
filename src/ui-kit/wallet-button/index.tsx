import * as React from 'react';

import { ButtonStyled } from './wallet-button.styles';

interface IWalletButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  styles?: React.CSSProperties;
  variant?: 'contained' | 'outlined' | 'text';
  type?: string;
  disabled?: boolean;
}

export function WalletButton({ onClick, children, styles, variant, disabled }: IWalletButtonProps) {
  return (
    <ButtonStyled style={styles} onClick={onClick} variant={variant} disabled={disabled}>
      {children}
    </ButtonStyled>
  );
}
