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
  value?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorValue?: string;
  disabled?: boolean;
  type?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}

export const WalletInput = React.forwardRef<HTMLInputElement, IWalletInputProps>((props, ref) => {
  const errorStyle = props.error ? styleErrorInput : {};
  return (
    <WrapperStyled>
      <InputStyled {...props} ref={ref} style={errorStyle}></InputStyled>

      {props.error && (
        <InputErrorStyled>
          <WalletTypography fontSize={11} color={themeMuiBase.palette.error}>
            {props.errorValue ?? 'Error'}
          </WalletTypography>
        </InputErrorStyled>
      )}
    </WrapperStyled>
  );
});

WalletInput.displayName = 'WalletInput';
