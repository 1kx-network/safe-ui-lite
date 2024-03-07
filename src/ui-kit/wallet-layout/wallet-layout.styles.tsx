import { styled } from '@mui/system';

export const LayoutStyled = styled('main')(
  ({ theme }) => `
      background-color: ${theme.palette.mode === 'dark' ? '#fff' : '#d4d4d4'};
      width: 100vw;
      height: 100vh;
      overfloy: hidden;
      margin: 0;
      position: relative;
  `
);
