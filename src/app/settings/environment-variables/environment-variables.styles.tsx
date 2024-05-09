import { styled } from '@mui/system';

import { themeMuiBase } from '@/assets/styles/theme-mui';

export const BodyStyled = styled('div')(
  ({ theme }) => ` 
    display: flex;
    width: 100%;
    gap: ${theme.spacing(2)};
    justify-content: space-between;
`
);

export const BoxChangedStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column; 
    gap: ${theme.spacing(2)};
`
);

export const GridInfoValueStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column; 
    gap: ${theme.spacing(2)};
    margin-top: ${theme.spacing(4)};
`
);

export const styledBtn = {
  width: '120px',
  marginTop: themeMuiBase.spacing(4),
};
