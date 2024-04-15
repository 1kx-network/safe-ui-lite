import { styled } from '@mui/system';
import Link from 'next/link';

import IconCopy from '@/assets/svg/copy.svg';
import OpenInNewIcon from '@/assets/svg/open-in-new.svg';

export const WrapperTable = styled('div')(
  () => `
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    overflow: hidden;
`
);

export const HeaderGridStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    align-items: center;
    border-bottom: 1px solid ${theme.palette.grey};
    padding: 0 ${theme.spacing(6)};
    `
);

export const ItemsInfoTable = styled('div')(
  ({ theme }) => `
    display: flex;
    align-items: center;
    padding: ${theme.spacing(1)};
    gap: ${theme.spacing(3)};
    width: 100%;
`
);

export const TableInfoStyled = styled('div')(
  () => `
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  max-height: 500px;
`
);

export const TableStringItemStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    aling-items: center;
    justify-content: space-between;
    gap: ${theme.spacing(1)};
    border-bottom: 1px solid ${theme.palette.grey};
    transition: 0.3s ease all;
    padding-right: ${theme.spacing(2)}; 

    &:last-child: {
        border-bottom: 1px solid transparent;
    }
`
);

export const IconCopyStyled = styled(IconCopy)(
  ({ theme }) => `
       min-width: 14px;
       width: 14px;
       height: 14px;
       cursor: pointer;
       color: ${theme.palette.grey};
    `
);

export const LinkOpenInNewIconStyled = styled(Link)(
  () => `
     disaply: flex;
     align-items: center;
     width: 14px;
     height: 14px;
     cursor: pointer;
  `
);

export const OpenInNewIconStyled = styled(OpenInNewIcon)(
  () => `
     width: 15px;
     height: 15px;
  `
);

export const BoxIconActionStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  align-items: center;
  border-radius: 50%;
  padding: ${theme.spacing(1)};
  transition: 0.3s ease all;
  cursor: pointer;

  &:hover {
    background-color: ${theme.palette.hover};
  }
`
);

export const styledBtn = {
  fontSize: '14px',
  height: '28px',
  maxWidth: '60px',
};
