import * as React from 'react';

import { ButtonStyled } from './wallet-button.styles';

interface IWalletButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  styles?: React.CSSProperties;
  variant?: 'contained' | 'outlined';
}

export function WalletButton({ onClick, children, styles, variant }: IWalletButtonProps) {
  return (
    <ButtonStyled style={styles} onClick={onClick} variant={variant}>
      {children}
    </ButtonStyled>
  );
}
