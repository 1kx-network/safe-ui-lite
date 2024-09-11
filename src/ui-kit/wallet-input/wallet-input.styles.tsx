import { styled } from '@mui/system';

import IconDefault from '@/assets/svg/defult-icon-address.svg';
import IconSearch from '@/assets/svg/search.svg';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import { withTransientProps } from '@/utils/styled.utils';

export const InputWrapperStyled = styled(
  'div',
  withTransientProps
)<{ $styles?: React.CSSProperties }>(({ theme, $styles }) => {
  return {
    width: '100%',
    display: 'flex',
    alignItems: 'center',

    border: `1px solid ${theme.palette.borderColor}`,
    borderRadius: theme.spacing(7),
    background: 'rgba(0,0,0, 0.4)',
    color: 'white',
    ...$styles,
  };
});

export const EndAdornmentIconStyled = styled('button')(
  ({ theme }) => `
      display: flex;
      padding: ${theme.spacing(0)} ${theme.spacing(3)};
      border: none;
      background: none;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease-in-out,
      '&:hover': {
        backgroundColor: ${theme.palette.tetriaryDark},
      },
`
);

export const LabelStyled = styled(
  'label',
  withTransientProps
)<{ htmlFor?: string }>(({ theme }) => {
  return {
    display: 'flex',
    paddingLeft: theme.spacing(2),
    margin: `${theme.spacing(2)} 0`,
    cursor: 'pointer',
  };
});

export const InputStyled = styled(
  'input',
  withTransientProps
)<{ $startadornment?: boolean; isSearch?: boolean }>(({ theme, $startadornment, isSearch }) => {
  const customPadding = $startadornment
    ? `${theme.spacing(2.5)} 0 ${theme.spacing(2.5)} ${theme.spacing(0.75)}`
    : `${theme.spacing(2.5)} ${theme.spacing(5)}`;

  return `
    font-size: 0.875rem;
    font-weight: 400;
    width: 100%;
    line-height: 1.5;
    padding:  ${customPadding};
    padding-left: ${isSearch || $startadornment ? theme.spacing(1) : theme.spacing(5)};
    color: white; // Change text color to white
    border: none;
    border-radius: ${theme.spacing(2)};
    background: transparent;
    text-overflow: ellipsis;
  
    &::placeholder {
      color: rgba(255, 255, 255, 0.5); // Change placeholder color to semi-transparent white
    }
  
    &:hover {
      border-color: ${theme.palette.blue};
    }
  
    &:focus {
      border-color: ${theme.palette.blue};
    }
  
    &:focus-visible, & > input > &:focus-visible {
      outline: 0;
    }
  
    & > input {
      border: none;
      outline: none;
      padding: 0;
      margin: 0;
      width: 100%;
      text-overflow: ellipsis;
    }
  
    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
  
      & > input {
        cursor: not-allowed;
      }
  
      &:hover {
        border-color: ${theme.palette.borderColor};
      }
    
      &:focus {
        border-color: ${theme.palette.borderColor};
      }
    }
  `;
});

export const WrapperStyled = styled('div')`
  position: relative;
  width: 100%;
`;

export const InputErrorStyled = styled('div')(
  ({ theme }) => `
  position: absolute;
  bottom: -${theme.spacing(4)};
  left: ${theme.spacing(5)};
  color: ${theme.palette.error}
`
);

export const styleErrorInput = {
  borderColor: themeMuiBase.palette.error,
  color: themeMuiBase.palette.error,
  backgroundColor: themeMuiBase.palette.lighError,

  '& > input': {
    color: themeMuiBase.palette.error,
  },
};

export const BoxAddressInfoStyled = styled('div')`
  display: flex;
`;

export const IconDefaultWalletStyled = styled(IconDefault)(
  () => `
width: 1.25rem;
height: 1.25rem;
`
);

export const IconSearchStyled = styled(IconSearch)``;
