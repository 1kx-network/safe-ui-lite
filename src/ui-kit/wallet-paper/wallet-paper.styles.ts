import { styled } from '@mui/system';

export const PaperStyled = styled('div')(
  ({ theme }) => `
    background: rgba(255, 255, 255, 0.5);
    border-radius: 14px;
    padding: ${theme.spacing(6)};
    width: 100%;
    height: 100%;
`
);
