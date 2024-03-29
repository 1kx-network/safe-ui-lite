import { styled } from '@mui/system';

export const WrapperStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(3)};
`
);

export const HeaderWrapperStyled = styled('div')(
  () => `
  display: flex;
  justify-content: center;
`
);

export const BodyTableStyled = styled('div')(
  () => `
    display: flex;
    height: 100%;
    overflow-y: scroll;
    width: 100%;
`
);

export const ItemWrapperStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    width: 100%;
    aling-items: center;
    gap: ${theme.spacing(2)};
  `
);

export const ItemInfoStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  justify-content: center;
  padding: ${theme.spacing(3.5)} 0; 
  border-bottom: 1px solid ${theme.palette.tetriaryLightGrey};
`
);
