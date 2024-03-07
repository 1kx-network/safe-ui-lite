import { styled } from '@mui/system';

export const LayoutStyled = styled('main')(
  ({ theme }) => `
      background: linear-gradient(143deg, rgba(179,214,255,1) 0%, rgba(255,220,179,0.5480786064425771) 100%, rgba(244,246,253,1) 100%);
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      margin: 0;
      position: relative;
      display: flex;
      padding: 20px;
  `
);
