import * as React from 'react';

import { ButtonStyled } from './wallet-button.styles';

interface IWalletButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: React.ReactNode;
  styles?: React.CSSProperties;
  variant?: 'contained' | 'outlined' | 'text';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function WalletButton({
  onClick,
  children,
  styles,
  variant,
  disabled,
  type,
}: IWalletButtonProps) {
  return (
    <ButtonStyled
      type={type}
      style={styles}
      onClick={onClick}
      variant={variant}
      disabled={disabled}
    >
      {children}
    </ButtonStyled>
  );
}
