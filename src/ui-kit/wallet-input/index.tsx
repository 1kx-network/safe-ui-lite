'use client';

import * as React from 'react';
import { Box } from '@mui/system';

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
  IconDefaultWalletStyled,
  IconSearchStyled,
} from './wallet-input.styles';

export interface IWalletInputProps {
  placeholder?: string;
  value?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorValue?: string | null;
  disabled?: boolean;
  label?: string;
  endAdornment?: React.ReactNode;
  onClickEndAdornment?: () => void;
  type?: string;
  ref?: React.Ref<HTMLInputElement>;
  style?: React.CSSProperties;
  startAdornment?: boolean;
  isSearch?: boolean;
  contentEditable?: boolean;
  required?: boolean;
}

export const WalletInput = React.forwardRef<HTMLInputElement, IWalletInputProps>((props, _ref) => {
  const {
    onClickEndAdornment,
    error,
    endAdornment,
    label,
    style,
    startAdornment,
    isSearch,
    required,
  } = props;

  const errorStyle = error ? styleErrorInput : {};

  return (
    <WrapperStyled>
      {props.label && (
        <LabelStyled htmlFor={label}>
          <WalletTypography
            fontSize={12}
            fontWeight={400}
            color={themeMuiBase.palette.tetriaryGrey}
          >
            {props.label} {required ? '*' : ''}
          </WalletTypography>
        </LabelStyled>
      )}

      <InputWrapperStyled $styles={errorStyle}>
        {startAdornment && (
          <Box display={'flex'} ml={3} gap={1}>
            <IconDefaultWalletStyled />
          </Box>
        )}

        {isSearch && (
          <Box display={'flex'} ml={3}>
            <IconSearchStyled />
          </Box>
        )}

        <InputStyled
          onChange={props.onChange}
          value={props.value ?? ''}
          $startadornment={startAdornment}
          style={{
            ...style,
            ...errorStyle,
          }}
          contentEditable="plaintext-only"
          id={label}
          ref={_ref}
        />
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
