import { styled } from '@mui/system';

export const PaperStyled = styled('div')(
  ({ theme }) => `
    background-color: ${theme.palette.white};
    border: 1px solid ${theme.palette.base};
    border-radius: 14px;
`
);
