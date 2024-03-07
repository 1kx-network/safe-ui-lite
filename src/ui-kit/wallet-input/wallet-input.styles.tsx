import { styled } from '@mui/system';

const blue = {
  100: '#DAECFF',
  200: '#b6daff',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

export const InputStyled = styled('input')(
  ({ theme }) => `
  font-size: 0.875rem;
  font-weight: 400;
  width: 100%;
  line-height: 1.5;
  padding: ${theme.spacing(2.5)} ${theme.spacing(5)};
  border-radius: ${theme.spacing(7)};
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : theme.palette.white};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : theme.palette.borderColor};
 

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
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

  & .error {
    border-color: ${theme.palette.error};

    & > input {
      color: ${theme.palette.error};
    }
  }

  & .disabled {
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
