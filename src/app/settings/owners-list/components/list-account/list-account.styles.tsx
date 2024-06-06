import { styled } from '@mui/system';

export const WalletListStyled = styled('div')(
  ({ theme }) => `
display: flex;
flex-direction: column;
height: 100%;
max-height: 400px;
-ms-overflow-style: none;
scrollbar-width: none;
margin-top: ${theme.spacing(3)};
`
);

export const ItemStyled = styled('div')(
  ({ theme }) => `
display: flex;
align-items: center;
justify-content: space-between;
border-bottom: 1px solid ${theme.palette.tetriaryLightGrey};

&:last-child {
  border-bottom: none;
}
`
);

export const ItemInfoStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  gap: ${theme.spacing(3)};
  padding: ${theme.spacing(3)};
  align-items: center;
`
);

export const IconBox = styled('div')(
  ({ theme }) => `
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${theme.palette.tetriaryLightGrey};
  min-width: 1.938rem;
  width: 1.938rem;
  height: 1.938rem;
  border-radius: 50%;
`
);
