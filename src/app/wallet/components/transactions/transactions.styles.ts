import { styled } from '@mui/system';

import { themeMuiBase } from '@/assets/styles/theme-mui';

export const ItemTransactionStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.spacing(3.5)} 0;
    font-size: 12px;
    margin-bottom: ${theme.spacing(1.875)};
`
);

export const styledPaper = {
  height: 'auto',
  marginTop: themeMuiBase.spacing(3.5),
  maxHeght: '250px',
  overflow: 'auto',
  gap: themeMuiBase.spacing(3),
  padding: themeMuiBase.spacing(6),
};
