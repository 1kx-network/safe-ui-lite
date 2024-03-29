import { styled } from '@mui/system';

import { themeMuiBase } from '@/assets/styles/theme-mui';

export const WrapperStyled = styled('div')`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding-top: ${themeMuiBase.spacing(7)};
  max-width: 1114px;
  min-height: 100vh;

  @media (max-width: 1068px) {
    padding: 4rem 2rem 0 2rem;
  }

  & > .safe-account_main-header {
    margin-bottom: ${themeMuiBase.spacing(3)};

    @media (max-width: 1068px) {
      text-align: center;
    }
  }
`;

export const GridContainer = styled('div')`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 14px;
  justify-content: center;

  @media (min-width: 1068px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const styleWalletPaper: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: 'fit-content',
};

export const StepStyled = styled('div')(
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

export const GridButtonStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${theme.spacing(5)};
`
);

export const PreviewSectionStyled = styled('div')`
  /* max-height: 608px;
  overflow-y: auto; */
`;

export const AccountPreviewItemstyled = styled('div')<{ noBorder?: boolean }>(
  ({ theme, noBorder }) => `
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${noBorder ? 'transparent' : theme.palette.tetriaryLightGrey};
  padding: ${theme.spacing(4.5)} 0;

  &:last-child {
    padding-bottom: 0;
  }
`
);
