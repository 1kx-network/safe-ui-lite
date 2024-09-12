import { styled } from '@mui/system';
import Link from 'next/link';

import OpenInNewIcon from '@/assets/svg/open-in-new.svg';
import CopyIcon from '@/assets/svg/copy.svg';

const commonStyles = `
  color: rgb(255, 255, 255);
  font-family: Roboto, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  box-sizing: border-box;
  margin: 16px 0px 0px;
  min-width: 0px;
  position: relative;
  border: 0.5px solid rgba(122, 199, 240, 0.4);
  border-radius: 25px;
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.2);
  display: block;
  margin-top: 32px;
  box-shadow: rgba(41, 49, 71, 0.1) 0px 8px 16px;
`;

export const TotalyBoxStyled = styled('div')(
  ({ theme }) => `
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid ${theme.palette.tetriaryLightGrey};
      padding-bottom: ${theme.spacing(4)};
      margin-bottom: ${theme.spacing(4)};
  `
);

export const ButtonsGridStyled = styled('div')(
  ({ theme }) => `
      margin: ${theme.spacing(4)} 0;
      display: flex;
      justify-content: space-between;
      gap: ${theme.spacing(3)};
      height: 52px;
  `
);

export const customStyleModal = {
  minWidth: '360px',
  maxWidth: '560px',
};

export const BoxOwnerLinkStyled = styled('div')(
  ({ theme }) => `
     display: flex;
     gap: ${theme.spacing(3)};
     align-items: center;
     margin: 2.5rem 0px 0px;
    `
);

export const OwnerLinkStyled = styled('div')(
  ({ theme }) => `
      display: flex;
      align-items: center;
      padding: ${theme.spacing(4.75)} ${theme.spacing(4.5)};
      border-radius: 44px;
      border: 1px solid ${theme.palette.black};
      `
);

export const CopyIconStyled = styled(CopyIcon)(
  () => `
   width: 1.25rem;
   height: 1.313rem;
   cursor: pointer;
`
);
export const OpenInNewIconStyled = styled(OpenInNewIcon)(
  () => `
   width: 1.25rem;
   height: 1.313rem;
`
);

export const LinkOpenInNewIconStyled = styled(Link)(
  () => `
   display: flex;
   align-items: center;
   width: 1.438rem;
   height: 1.313rem;
   cursor: pointer;
`
);
