import * as React from 'react';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import { WalletTypography } from '..';

import {
  InputStyled,
  InputErrorStyled,
  WrapperStyled,
  styleErrorInput,
} from './wallet-input.styles';

interface IWalletInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorValue?: string;
  disabled?: boolean;
}

export function WalletInput(props: IWalletInputProps) {
  const errorStyle = props.error ? styleErrorInput : {};
  return (
    <WrapperStyled>
      <InputStyled {...props} style={errorStyle}></InputStyled>

      {props.error && (
        <InputErrorStyled>
          <WalletTypography fontSize={11} color={themeMuiBase.palette.error}>
            {props.errorValue ?? 'Error'}
          </WalletTypography>
        </InputErrorStyled>
      )}
    </WrapperStyled>
  );
}
