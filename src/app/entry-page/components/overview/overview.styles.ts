import OpenInNewIcon from '@/assets/svg/open-in-new.svg';
import CopyIcon from '@/assets/svg/copy.svg';
import { styled } from '@mui/system';
import Link from 'next/link';

export const TotalyBoxStyled = styled('div')(
  ({ theme }) => `
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: ${theme.spacing(3)};
      padding-bottom: ${theme.spacing(3)};
      border-bottom: 1px solid ${theme.palette.tetriaryLightGrey};
      margin-bottom: ${theme.spacing(3)};
  `
);

export const ButtonsGridStyled = styled('div')(
  ({ theme }) => `
      gap: ${theme.spacing(3)};
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-top: ${theme.spacing(3)};
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
     margin: ${theme.spacing(10)} 0 0;
    `
);

export const OwnerLinkStyled = styled('div')(
  ({ theme }) => `
      display: flex;
      align-items: center;
      padding: ${theme.spacing(4.75)} ${theme.spacing(4.5)};
      border-radius: 44px;
      border: 1px solid ${theme.palette.black};
      width: 100%;
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
   disaply: flex;
   align-items: center;
   width: 1.438rem;
   height: 1.313rem;
   cursor: pointer;
`
);
