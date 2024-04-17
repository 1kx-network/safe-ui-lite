import { styled } from '@mui/system';

export const WrapperStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    align-items: center;
    justify-content: space-between;
    fontSize: 14px;
    width: 100%;
    border-radius: 1.75rem;
    height: 44px;
    padding: 0 18px;
    border: 1px solid ${theme.palette.tetriaryLightGrey};
    background-color: ${theme.palette.white};
    cursor: progress;
`
);
