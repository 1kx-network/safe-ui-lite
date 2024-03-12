import * as React from 'react';

import { themeMuiBase } from '@/assets/styles/theme-mui';
import { WalletTypography } from '..';

import {
  InputStyled,
  InputErrorStyled,
  WrapperStyled,
  styleErrorInput,
  InputWrapperStyled,
  EndAdornmentIconStyled,
  LabelStyled,
} from './wallet-input.styles';

interface IWalletInputProps {
  placeholder?: string;
  value?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorValue?: string;
  disabled?: boolean;
  label?: string;
  endAdornment?: React.ReactNode;
  onClickEndAdornment?: () => void;
  type?: string;
  ref?: React.Ref<HTMLInputElement>;
}

export const WalletInput = React.forwardRef<HTMLInputElement, IWalletInputProps>((props, _ref) => {
  const { onClickEndAdornment, error, endAdornment, label } = props;

  const errorStyle = error ? styleErrorInput : {};

  return (
    <WrapperStyled>
      <LabelStyled htmlFor={label}>
        <WalletTypography fontSize={12} fontWeight={600}>
          {props.label}
        </WalletTypography>
      </LabelStyled>

      <InputWrapperStyled $styles={errorStyle}>
        <InputStyled {...props} value={props.value ?? ''} style={errorStyle} id={label} ref={_ref} />
        {endAdornment && (
          <EndAdornmentIconStyled onClick={onClickEndAdornment}>
            {endAdornment}
          </EndAdornmentIconStyled>
        )}
      </InputWrapperStyled>

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
