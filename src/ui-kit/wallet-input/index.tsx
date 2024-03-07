import * as React from 'react';
import { InputProps } from '@mui/base';

import { WalletTypography } from '..';

import { InputStyled, InputErrorStyled, WrapperStyled } from './wallet-input.styles';

export function WalletInput(props: InputProps & { errorValue?: string }) {
  return (
    <WrapperStyled>
      <InputStyled {...props}></InputStyled>

      {props.error && (
        <InputErrorStyled>
          <WalletTypography fontSize={11} color="#FF2E1F">
            {props.errorValue ?? 'Error'}
          </WalletTypography>
        </InputErrorStyled>
      )}
    </WrapperStyled>
  );
}
