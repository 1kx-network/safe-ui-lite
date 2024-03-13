import { styled } from '@mui/system';

export const TotalyBoxStyled = styled('div')(
  ({ theme }) => `
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: ${theme.spacing(3)};
      padding-bottom: ${theme.spacing(3)};
      border-bottom: 1px solid ${theme.palette.tetriaryLightGrey};
      margin-bottom: ${theme.spacing(3)};
  `
);

export const ButtonsGridStyled = styled('div')(
  ({ theme }) => `
      gap: ${theme.spacing(3)};
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-top: ${theme.spacing(3)};
      height: 52px;
  `
);
