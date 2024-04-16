import { styled } from '@mui/system';

export const PopupWrapper = styled('div')(
  ({ theme }) => `
    position: absolute;
    top: 56px;
    left: -400px;
    width: 450px;
    height: 350px%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${theme.palette.base};
    z-index: 20;
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    color: rgb(255, 255, 255);
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    box-shadow: none;
    border-radius: 6px;
    background-image: none;
    padding: 32px;
`
);

export const Overlay = styled('div')(
  ({ theme }) => `
   position: fixed;
   top: 0;
   left: 0;
   width: 100vw;
   height: 100vh;
   opacity: 0.6;
   background: ${theme.palette.tetriaryLightGrey};
   z-index: 10;
`
);

export const MainContainer = styled('div')(
  () => `
    box-sizing: border-box;
    margin: 0px;
    flex-direction: row;
    text-align: center;
`
);

export const Title = styled('h5')(
  () => `
  margin: 16px 0px 4px;
  font-size: 16px;
  font-weight: 700;
  font-family: "DM Sans", sans-serif;
  line-height: 1.334;
`
);

export const PasteDescription = styled('p')(
  () => `
  margin: 0px;
  font-size: 14px;
  line-height: 20px;
  font-family: "DM Sans", sans-serif;
  font-weight: 400;
  color: rgb(99, 102, 105);
`
);

export const PasteWrapper = styled('p')(
  () => `
  margin: 0px;
  font-size: 14px;
  line-height: 20px;
  font-family: "DM Sans", sans-serif;
  font-weight: 400;
  color: rgb(99, 102, 105);
`
);

export const ConnectionStringWrapper = styled('div')(
  () => `
  display: inline-flex;
  flex-direction: row;
  jctify-content: center;
  align-items: center;
  position: relative;
  min-width: 0px;
  padding: 0px;
  margin: 0px;
  margin-bottom: 22px;
  border: 0px;
  vertical-align: top;
  width: 100%;

`
);

export const Input = styled('input')(
  () => `
  font: inherit;
  letter-spacing: inherit;
  color: currentcolor;
  border: 0px;
  box-sizing: content-box;
  background: none;
  height: 1.4375em;
  margin: 0px;
  -webkit-tap-highlight-color: transparent;
  display: block;
  min-width: 0px;
  width: 100%;
  animation-name: mui-auto-fill-cancel;
  animation-duration: 10ms;
  padding: 16.5px 0px 16.5px 14px;
`
);

export const ContainedButton = styled('button')(
  () => `
    display: inline-flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    position: relative;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    outline: 0px;
    border: 0px rgb(18, 255, 128);
    margin-left: 12px;
    cursor: pointer;
    user-select: none;
    vertical-align: middle;
    appearance: none;
    text-decoration: none;
    font-family: "DM Sans", sans-serif;
    min-width: 64px;
    transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    color: rgba(0, 0, 0, 0.87);
    background-color: rgb(18, 255, 128);
    box-shadow: rgb(161, 163, 167) 0px 0px 2px;
    border-radius: 6px;
    font-weight: bold;
    line-height: 1.25;
    text-transform: none;
    font-size: 16px;
    padding: 8px 24px;
  `
);

export const HR = styled('hr')(
  () => `
  margin: 0px;
  flex-shrink: 0;
  border-width: 0px 0px thin;
  border-style: solid;
  align-self: stretch;
  height: auto;
  border-color: rgb(48, 48, 51);
`
);

export const Connections = styled('div')(`
  padding: 24px 0 0;
`);

export const NoConnections = styled('div')(`
  margin: 0px;
  font-size: 14px;
  line-height: 20px;
  font-family: "DM Sans", sans-serif;
  font-weight: 400;
  text-align: center;
  color: rgb(99, 102, 105);
`);
