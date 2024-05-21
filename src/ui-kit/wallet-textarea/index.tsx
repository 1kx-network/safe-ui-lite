'use client';
import * as React from 'react';
import { Box } from '@mui/system';

import { themeMuiBase } from '@/assets/styles/theme-mui';
import { WalletTypography } from '..';

import {
  TextAreaStyled,
  TextAreaErrorStyled,
  WrapperStyled,
  styleErrorTextArea,
  TextAreaWrapperStyled,
  EndAdornmentIconStyled,
  LabelStyled,
  IconSearchStyled,
} from './wallet-textarea.styles';

export interface IWalletTextAreaProps {
  placeholder?: string;
  value?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: boolean;
  errorValue?: string | null;
  disabled?: boolean;
  label?: string;
  endAdornment?: React.ReactNode;
  onClickEndAdornment?: () => void;
  type?: string;
  ref?: React.Ref<HTMLTextAreaElement>;
  style?: React.CSSProperties;
  isSearch?: boolean;
  contentEditable?: boolean;
  multiline?: boolean;
  rows?: number;
}

export const WalletTextArea = React.forwardRef<HTMLTextAreaElement, IWalletTextAreaProps>(
  (props, _ref) => {
    const { onClickEndAdornment, error, endAdornment, label, style, isSearch, multiline, rows } =
      props;

    const errorStyle = error ? styleErrorTextArea : {};

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

        <TextAreaWrapperStyled $styles={errorStyle}>
          {isSearch && (
            <Box display={'flex'} ml={3}>
              <IconSearchStyled />
            </Box>
          )}

          <TextAreaStyled
            onChange={props.onChange}
            value={props.value ?? ''}
            style={{
              resize: 'none',
              maxHeight: '125px',
              ...style,
              ...errorStyle,
            }}
            contentEditable="plaintext-only"
            aria-multiline={multiline}
            rows={rows}
            id={label}
            ref={_ref}
          />
          {endAdornment && (
            <EndAdornmentIconStyled onClick={onClickEndAdornment}>
              {endAdornment}
            </EndAdornmentIconStyled>
          )}
        </TextAreaWrapperStyled>

        {props.error && (
          <TextAreaErrorStyled>
            <WalletTypography fontSize={11} color={themeMuiBase.palette.error}>
              {props.errorValue ?? 'Error'}
            </WalletTypography>
          </TextAreaErrorStyled>
        )}
      </WrapperStyled>
    );
  }
);

WalletTextArea.displayName = 'WalletTextArea';
