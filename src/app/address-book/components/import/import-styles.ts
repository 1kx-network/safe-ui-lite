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
`
);

export const styledBtn = {
  width: '50%',
};

export const DragAndDropStyled = styled('div')(
  ({ theme }) => `
  border: 1px dashed ${theme.palette.tetriaryLightGrey};
  background-color: ${theme.palette.hover};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  height: 70px; 
  margin-bottom: ${theme.spacing(3)};
  cursor: pointer;
`
);
