import { styled } from '@mui/system';

export const LayoutStyled = styled('main')(
  ({ theme }) => `
      background: rgb(30, 35, 39);
      width: 100vw;
      height: 100vh;
      margin: 0;
      position: relative;
      display: flex;
      flex-direction: column;
      overflow-y: hidden;
      justify-content: space-between;
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
  margin-top: 1.5rem;
  display: flex;
  right: 0;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
