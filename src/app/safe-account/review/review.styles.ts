import { styled } from '@mui/system';
import Link from 'next/link';

import OpenInNewIcon from '@/assets/svg/open-in-new.svg';
import CopyIcon from '@/assets/svg/copy.svg';

export const ItemInfoStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.spacing(2)};
    padding: ${theme.spacing(3.75)} 0;
    min-height: 3.25rem;
    border-bottom: 1px solid ${theme.palette.tetriaryLightGrey};
`
);

export const OwnerListStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(5)};
  overflow: scroll;
  max-height: 300px;
  width: 80%;
  align-items: end;
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
