import { styled } from '@mui/system';

export const styledPaper = {
  height: 'auto',
};

export const TokenItemStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.spacing(3)} 0;
    border-bottom: 1px solid ${theme.palette.tetriaryLightGrey};

    &:last-child  {
      border-bottom: none;
    }
`
);

export const TokenListStyled = styled('div')(
  ({ theme }) => `
  margin-top: ${theme.spacing(3)};
  max-height: 550px;
  overflow: scroll;
`
);

export const IconStyled = styled('div')(
  ({ theme }) => `
  border-radius: 50%;
  margin-right: ${theme.spacing(3)};
  width: 34px;
  height: 34px;
  `
);
