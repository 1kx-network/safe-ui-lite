import * as React from 'react';

import IconLoader from '@/assets/svg/loader.svg';

import { ButtonStyled } from './wallet-button.styles';

interface IWalletButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onMouseOver?: () => void;
  onMouseLeave?: () => void;
  children: React.ReactNode;
  styles?: React.CSSProperties;
  variant?: 'contained' | 'outlined' | 'text';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
}

export function WalletButton({
  onClick,
  onMouseOver,
  onMouseLeave,
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
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      variant={variant}
      disabled={disabled || loading === true}
      loading={loading}
    >
      {loading ? <IconLoader /> : children}
    </ButtonStyled>
  );
}
