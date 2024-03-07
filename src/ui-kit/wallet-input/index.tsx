import * as React from 'react';
import { InputProps } from '@mui/base';
import { InputStyled } from './wallet-input.styles';

export function WalletInput(props: InputProps) {
  return <InputStyled {...props} />;
}
