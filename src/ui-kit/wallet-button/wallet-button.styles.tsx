import { styled } from '@mui/system';

import { withTransientProps } from '@/utils/styled.utils';

export const ButtonStyled = styled(
  'button',
  withTransientProps
)<{
  variant?: 'contained' | 'outlined' | 'text';
  $styles?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
}>(({ variant, theme, $styles }) => {
  const bgColors: {
    [key: string]: string;
  } = {
    contained: theme.palette.black,
    outlined: theme.palette.lightGrey,
    text: 'transparent',
  };
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
    outline: variant === 'outlined' ? `1px solid ${theme.palette.black}` : 'none',
    backgroundColor: bgColors[variant ?? 0],
    transition: 'all 0.3s ease-in-out',
    ...$styles,
    '&:hover': {
      backgroundColor: variant !== 'text' ? theme.palette.tetriaryDark : 'transparent',
      color: variant !== 'text' ? theme.palette.white : theme.palette.tetriaryDark,
      textDecoration: variant === 'text' ? 'underline' : 'none',
    },

    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',

      '&:hover': {
        backgroundColor: variant === 'contained' ? theme.palette.black : theme.palette.lightGrey,
        color: variant === 'contained' ? theme.palette.white : theme.palette.black,
      },
    },
  };
});
