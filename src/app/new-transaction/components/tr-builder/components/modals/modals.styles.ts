import { styled } from '@mui/system';

export const StyledModalBodyWrapper = styled('div')`
  position: relative;
  padding: 24px;
  max-width: 450px;
`;

export const StyledModalDot = styled('div')`
  height: 24px;
  width: 24px;
  min-width: 24px;
  background-color: #566976;

  position: absolute;
  top: 22px;
`;

export const StyledModalText = styled('div')`
  text-indent: 30px;
`;

export const StyledModalButtonsWrapper = styled('div')`
  margin-top: 24px;
`;

export const CountStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${theme.palette.base};
    border-radius: 50%;
    color: ${theme.palette.textLight};
    height: 28px;
    width: 28px;
    min-width: 28px;
    margin-right:${theme.spacing(3)};
`
);
