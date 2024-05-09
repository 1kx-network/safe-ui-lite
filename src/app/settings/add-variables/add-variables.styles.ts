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

export const BodyStyled = styled('div')(
  ({ theme }) => ` 
  display: flex;
    flex-direction: column; 
    gap: ${theme.spacing(2)};
    width: 100%;
`
);

export const BoxChangedStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column; 
    gap: ${theme.spacing(2)};
    width: 100%;
`
);

export const GridButtonStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: ${theme.spacing(5)};
    gap: ${theme.spacing(4)};
  `
);
