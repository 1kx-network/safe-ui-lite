import { styled } from '@mui/system';

import { themeMuiBase } from '@/assets/styles/theme-mui';

export const WrapperStyled = styled('div')`
  width: 100%;
  height: 100%;
`;

export const HeaderListStyled = styled('div')<{ smallType?: boolean }>(
  ({ theme, smallType }) => `
    display: flex;
    align-items: center;
    justify-content: ${smallType ? 'flex-start' : 'space-between'};
    gap: ${theme.spacing(8)};
    width: 100%;
    padding: 0 ${theme.spacing(6)};
    margin-bottom: ${theme.spacing(4)};
    padding-left: ${smallType ? 0 : theme.spacing(6)}; 

    & > h3 {
      width: 33%;
      max-width: 33%;
      min-width: 80px;
    }

    & > h3:nth-of-type(2) {
      width: ${smallType ? '67%' : '33%'};
      max-width: ${smallType ? '67%' : '33%'};
      text-align: ${smallType ? 'left' : 'center'};
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

export const styledPaperSmallType: React.CSSProperties = {
  ...styledPaper,
  maxHeight: '300px',
  padding: 0,
};
