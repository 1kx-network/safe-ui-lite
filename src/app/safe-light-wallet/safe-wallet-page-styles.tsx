import { styled } from '@mui/system';

import { themeMuiBase } from '@/assets/styles/theme-mui';

export const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const styleWalletPaper = {
  height: 'fit-content',
  margin: '14px 0',
};

export const styledButton = {
  padding: themeMuiBase.spacing(3),
  borderWidth: '2px',
  maxWidth: '165px',
};

export const BlockInfoStyled = styled('div')(
  ({ theme }) => `
    margin-bottom: ${theme.spacing(9)};
    gap: 12px;
    display: flex;
    flex-direction: column;
    overflow: scroll;
    max-height: 460px;
    padding: ${theme.spacing(0.25)};
`
);

export const InputWrapperStyled = styled('div')(
  ({ theme }) => `
    gap: ${theme.spacing(2)};
    display: flex;
    justify-content: space-between;
    align-items: end;
    width: 100%;
`
);

export const styledCreateWallet = {
  ...styledButton,
  marginTop: themeMuiBase.spacing(2),
};
