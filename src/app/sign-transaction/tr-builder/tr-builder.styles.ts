import { styled } from '@mui/system';
import { CSSProperties } from 'react';
import { AccordionItemButton } from 'react-accessible-accordion';

export const WrapperStyled = styled('div')`
  margin: auto;
  width: 600px;
  max-height: 380px;
  overflow-y: scroll;
`;

export const AccordionItemButtonStyled = styled(AccordionItemButton)(
  ({ theme }) => `
display: flex;
align-items: center;
gap: 6px;
background-color: white;
height: 55px;
border-radius: ${theme.spacing(3)};
padding: ${theme.spacing(3)};
cursor: pointer;
position: relative;
z-index: 2;

&::before {
  content: '';
  height: 6px;
  width: 6px;
  margin-right: ${theme.spacing(3)};
  border-bottom: 1px solid currentColor;
  border-right: 1px solid currentColor;
  transform: rotate(-45deg);
}

&[aria-expanded='true']::before,
&[aria-selected='true']::before {
  transform: rotate(45deg);
}
`
);

export const BoxTxPositionStyled = styled('div')`
  height: 55px;
  display: flex;
  align-items: center;
`;

export const TransactionListItem = styled('li')(
  ({ theme }) => `
  display: flex;
  margin-bottom: ${theme.spacing(2)};
  gap: ${theme.spacing(2)};
`
);

export const TxPositionStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${theme.palette.base};
    border-radius: 50%;
    color: ${theme.palette.textLight};
    height: 21px;
    width: 21px;
    min-width: 21px;
`
);

export const styledItemPanel = {
  background: 'rgba(246, 247, 253, 0.95)',
  borderRadius: '0 0 12px 12px',
  marginTop: '-8px',
};

export const styledText: CSSProperties = {
  wordWrap: 'break-word',
  overflow: 'scroll',
};
