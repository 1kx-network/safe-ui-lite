import { styled } from '@mui/system';

import { themeMuiBase } from '@/assets/styles/theme-mui';

export const AccountPreviewItemstyled = styled('div')<{ noBorder?: boolean }>(
  ({ theme, noBorder }) => `
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid ${noBorder ? 'transparent' : theme.palette.tetriaryLightGrey};
    padding: ${theme.spacing(5.375)} 0;
    height: 3.813rem;
    gap: ${theme.spacing(3)};
  
    &:last-child {
      padding-bottom: 0;
      height: 2.938rem;
    }
  `
);

export const styleWalletPaper: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: 'fit-content',
  gap: themeMuiBase.spacing(1.625),
};
