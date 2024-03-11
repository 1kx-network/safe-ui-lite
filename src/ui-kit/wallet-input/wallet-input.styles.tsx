import { themeMuiBase } from '@/assets/styles/theme-mui';
import { styled } from '@mui/system';

export const InputStyled = styled('input')(
  ({ theme }) => `
  font-size: 0.875rem;
  font-weight: 400;
  width: 100%;
  line-height: 1.5;
  padding: ${theme.spacing(2.5)} ${theme.spacing(5)};
  border-radius: ${theme.spacing(7)};
  color: ${theme.palette.textDark};
  background: ${theme.palette.white};
  border: 1px solid ${theme.palette.borderColor};

  &::placeholder {
    color: ${theme.palette.textDark};
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
  }

  &:disabled {
    cursor: not-allowed;

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
`
);

export const WrapperStyled = styled('div')`
  position: relative;
`;

export const InputErrorStyled = styled('div')(
  ({ theme }) => `
  position: absolute;
  bottom: -${theme.spacing(5)};
  left: 0;
  color: ${theme.palette.error}
`
);

export const styleErrorInput = {
  borderColor: themeMuiBase.palette.error,
  color: themeMuiBase.palette.error,

  '& > input': {
    color: themeMuiBase.palette.error,
  },
};
