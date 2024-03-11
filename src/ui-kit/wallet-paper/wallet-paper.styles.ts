import { styled } from '@mui/system';

import { withTransientProps } from '@/utils/styled.utils';

export const PaperStyled = styled(
  'div',
  withTransientProps
)<{ minWidth?: string }>(({ minWidth = '100%', theme }) => {
  return {
    background: theme.palette.lightGrey,
    borderRadius: '14px',
    padding: theme.spacing(5),
    width: '100%',
    height: '100%',
    minWidth,
    '@media (max-width: 1068px)': {
      minWidth: '100%',
    },
  };
});
