import { styled } from '@mui/system';

export const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const styleWalletPaper = {
  height: 'fit-content',
  margin: '14px 0',
};

export const GridButtonStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  gap: ${theme.spacing(2.5)}

`
);
