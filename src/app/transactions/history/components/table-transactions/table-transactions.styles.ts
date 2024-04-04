import { styled } from '@mui/system';

import { themeMuiBase } from '@/assets/styles/theme-mui';

export const WrapperStyled = styled('div')`
  width: 100%;
  height: 100%;
`;

export const HeaderListStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    aling-items: center;
    justify-content: space-between;
    gap: ${theme.spacing(8)};
    width: 100%;
    padding: 0 ${theme.spacing(6)};
    margin-bottom: ${theme.spacing(4)};

    & > h3 {
      width: 33%;
      max-width: 33%;
      min-width: 80px;
    }
`
);

export const styledPaper: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '70vh',
  width: '100%',
  overflow: 'scroll',
  gap: themeMuiBase.spacing(1),
};
