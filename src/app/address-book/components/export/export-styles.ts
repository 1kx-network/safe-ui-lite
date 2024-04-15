import { styled } from '@mui/system';

export const AddStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(4)};
`
);

export const GridBtnAddStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    justify-content: space-between;
    gap: ${theme.spacing(1)};
    width: 100%;
    margin-top: ${theme.spacing(4)};
`
);

export const styledBtn = {
  width: '50%',
};
