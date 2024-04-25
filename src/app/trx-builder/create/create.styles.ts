import { styled } from '@mui/system';

export const WrapperStyled = styled('div')(
  ({ theme }) => `
  margin-top: 4rem;
`
);

export const GridStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: ${theme.spacing(3)};
`
);
