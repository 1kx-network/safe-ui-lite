import { styled } from '@mui/system';

export const WrapperStyled = styled('div')(
  ({ theme }) => `
    gap: ${theme.spacing(7)};
    display: flex;
    align-items: center;
    margin: ${theme.spacing(7)} 0;
`
);

export const ItemMenuStyled = styled('div')<{ isSearch?: boolean }>(
  ({ theme, isSearch }) => `
    display: flex;
    align-items: center;
    height: 44px;
    border-radius: ${theme.spacing(7)};
    width: 33%;
    max-width: ${!isSearch ? '186px' : '300px'};
    min-width: 80px;
`
);

export const ItemFilterStyled = styled('div')(
  () => `
    display: flex;
    aling-items: center;
    width: 33%;
    max-width: 33%;
    min-width: 80px;
`
);

export const styledBtn = {
  width: '33%',
  maxWidth: '100px',
  minWidth: '50px',
  color: 'rgba(255, 255, 255, 0.87)',
};
