export const themeMuiBase = {
  palette: {
    black: '#000',
    textDark: '#020303',
    lightGrey: '#f6f7fd',
    textDarkLight: '#02030305',
    base: '#1c1c1c',
    white: '#fff',
    grey: '#d4d4d4',
    lightSecondary: '#FFFFFF80',
    error: '#FF2E1F',
    borderColor: '#0000003f',
    blue: '#3399FF',
    tetriaryDark: '#2E3338',
    lighError: '#ff2e1f01',
    tetriaryLightGrey: '#D9D9D9', // border
    tetriaryGrey: '#777F88', // label text
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
