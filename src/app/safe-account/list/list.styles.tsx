import { styled } from '@mui/system';

export const MainContainerStyled = styled('main')(
  () => `
  margin: auto;
  width: 100%;
  max-width: 650px;
  `
);

export const HeaderStyled = styled('div')(
  ({ theme }) => `
display: flex;
align-items: center;
justify-content: space-between;
margin-bottom: ${theme.spacing(3.5)};
`
);
