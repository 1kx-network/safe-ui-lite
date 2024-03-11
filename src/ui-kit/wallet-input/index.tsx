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
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorValue?: string;
  disabled?: boolean;
  label: string;
  endAdornment?: React.ReactNode;
  onClickEndAdornment?: () => void;
}

export function WalletInput(props: IWalletInputProps) {
  const { onClickEndAdornment, error, endAdornment, label } = props;

  const errorStyle = error ? styleErrorInput : {};

  return (
    <WrapperStyled>
      <LabelStyled htmlFor={label}>
        <WalletTypography fontSize={12} fontWeight={600}>
          {props.label}
        </WalletTypography>
      </LabelStyled>

      <InputWrapperStyled>
        <InputStyled {...props} style={errorStyle} id={label} />
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
}
