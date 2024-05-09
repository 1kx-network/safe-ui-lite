import { styled } from '@mui/system';

export const WrapperStyled = styled('div')(
  ({ theme }) => `
      display: flex;
      width: 100%;
      height: 100%;
      flex-direction: column; 
      gap: ${theme.spacing(3.5)};
      margin-top: 1.5rem;
  `
);
