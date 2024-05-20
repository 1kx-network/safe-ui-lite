import { styled } from '@mui/system';

import IconCopy from '@/assets/svg/copy.svg';

export const Wrapper = styled('div')`
  flex-grow: 1;
  padding: 0 16px;
  user-select: text;
`;

export const TxSummaryContainer = styled('div')`
  display: grid;
  grid-template-columns: minmax(100px, 2fr) minmax(100px, 5fr);
  gap: 6px;
  margin-top: 14px;
`;

export const StyledTxTitle = styled('div')`
  font-size: 16px;
  margin: 8px 0;
  font-weight: bold;
  line-height: initial;
`;

export const StyledMethodNameLabel = styled('div')`
  padding-left: 4px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StyledTxValueLabel = styled('div')(() => {
  return `
    max-height: 100%;
    line-break: anywhere;
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
  `;
});

export const IconCopyStyled = styled(IconCopy)(
  ({ theme }) => `
         min-width: 14px;
         width: 14px;
         height: 14px;
         cursor: pointer;
         color: ${theme.palette.grey};
      `
);
