import * as React from 'react';

import IconLoader from '@/assets/svg/loader.svg';
import { ButtonStyled } from './wallet-button.styles';

interface IWalletButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: React.ReactNode;
  styles?: React.CSSProperties;
  variant?: 'contained' | 'outlined' | 'text';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
}

export function WalletButton({
  onClick,
  children,
  styles,
  variant,
  disabled,
  type,
  loading,
}: IWalletButtonProps) {
  return (
    <ButtonStyled
      type={type}
      style={styles}
      onClick={onClick}
      variant={variant}
      disabled={disabled || loading}
      loading={loading}
    >
      {loading ? <IconLoader /> : children}
    </ButtonStyled>
  );
}
