export const themeMuiBase = {
  palette: {
    primary: 'green',
    textLight: '#fff',
    textDark: '#020303',
    textDarkLight: '#02030305',
    base: '#1c1c1c',
    white: '#fff',
    dark: '#020303',
    darkLight: '#02030305',
    grey: '#d4d4d4',
    lightSecondary: '#FFFFFF80',
    error: '#FF2E1F',
    borderColor: 'rgba(0, 0, 0, 0.25)',
    blue: '#3399FF',
  },

  spacing: (factor: number) => `${0.25 * factor}rem`,

  fontSize: {
    base: '1rem', // 16px
    small: '0.75rem', // 16px
  },

  radius: {
    base: '0.875rem', // 14px
  },

  border: {
    base: '0.063rem', // 1px
    button: '0.063rem, 0.25rem, 0.25rem, 0.063rem',
  },
};
