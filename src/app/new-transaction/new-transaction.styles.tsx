import { styled } from '@mui/system';

export const NonceBoxStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    align-items: center;
    border: 1px solid ${theme.palette.black};
    border-radius: ${theme.spacing(7)};
    padding: ${theme.spacing(3.5)};
    // margin-left: ${theme.spacing(3.5)};
`
);
