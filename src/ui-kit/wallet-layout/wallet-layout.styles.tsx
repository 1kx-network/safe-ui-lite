import { styled } from '@mui/system';

export const LayoutStyled = styled('main')(
  ({ theme }) => `
      background: linear-gradient(143deg, rgba(179,214,255,1) 0%, rgba(255,220,179,0.5480786064425771) 100%, rgba(244,246,253,1) 100%);
      width: 100vw;
      height: 100vh;
      margin: 0;
      position: relative;
      display: flex;
      padding: 0 20px;
      overflow-y: scroll;

      &::-webkit-scrollbar {
        width: 1px !important;
      }
      &::-webkit-scrollbar-thumb {  
        background-color: black !important;
        width: 1px !important;
      }
      &::-webkit-scrollbar-track {
        background-color: transparent !important;
      }
      &::-moz-scrollbar-thumb {
        background-color: ${theme.palette.textDark} !important;
        width: 20px !important;
      }
      &::-moz-scrollbar-track {
        background-color: white !important;
      }
  `
);

export const InfoUserStyled = styled('div')`
  display: inline-block;
  position: absolute;
  right: 0;
  text-align: right;
`;
