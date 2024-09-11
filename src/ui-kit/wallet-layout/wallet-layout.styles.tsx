import { styled } from '@mui/system';

export const LayoutStyled = styled('main')(
  ({ theme }) => `
      background: rgb(30, 35, 39);
      width: 100vw;
      height: 100vh;
      margin: 0;
      position: relative;
      display: flex;
      padding: 0 20px;
      // overflow-y: scroll;
      overflow-y: hidden;

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
  top: 1.5rem;
  display: inline-block;
  position: absolute;
  right: 0;
  text-align: right;
`;
