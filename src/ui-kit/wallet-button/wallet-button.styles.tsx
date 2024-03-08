import { styled } from '@mui/system';

import { withTransientProps } from '@/utils/styled.utils';

export const ButtonStyled = styled(
  'button',
  withTransientProps
)<{ variant?: 'contained' | 'outlined' }>(({ variant, theme }) => {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
    fontSize: '16px',
    padding: theme.spacing(3),
    borderRadius: '28px',
    color: variant === 'contained' ? theme.palette.white : theme.palette.black,
    width: '100%',
    maxWidth: '296px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    border: 'none',
    outline: `1px solid ${theme.palette.black}`,
    backgroundColor: variant === 'contained' ? theme.palette.black : theme.palette.lightGrey,
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      backgroundColor: theme.palette.tetriaryDark,
      color: theme.palette.white,
    },
  };
});
