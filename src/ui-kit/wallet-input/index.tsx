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
  style?: React.CSSProperties;
  startAdornment?: boolean;
}

export const WalletInput = React.forwardRef<HTMLInputElement, IWalletInputProps>((props, _ref) => {
  const { onClickEndAdornment, error, endAdornment, label, style, startAdornment } = props;

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
            {props.label}
          </WalletTypography>
        </LabelStyled>
      )}

      <InputWrapperStyled $styles={errorStyle}>
        {startAdornment && (
          <Box display={'flex'} ml={3}>
            <IconDefaultWalletStyled />
            <WalletTypography fontSize={14} fontWeight={500}>
              gno:
            </WalletTypography>
          </Box>
        )}

        <InputStyled
          {...props}
          value={props.value ?? ''}
          startAdornment={startAdornment}
          style={{
            ...style,
            ...errorStyle,
          }}
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
