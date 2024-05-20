import { styled } from '@mui/system';

export const TransactionsBatchWrapper = styled('div')`
  width: 100%;
  user-select: none;
`;

export const TransactionHeader = styled('div')`
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const TransactionCounterDot = styled('div')`
  height: 24px;
  width: 24px;
  min-width: 24px;
  background-color: #566976;
`;

export const TransactionsTitle = styled('div')`
  flex-grow: 1;
  margin-left: 14px;
  min-width: 0;

  font-size: 16px;
  line-height: normal;
  display: flex;
  align-items: center;
`;

export const StyledHeaderIconButton = styled('div')`
  border-radius: 4px;
  background-color: white;
  margin-left: 8px;
`;

export const TransactionList = styled('ol')`
  list-style: none;
  padding: 0;
`;

export const CountTrStyled = styled('div')(
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
    margin-right:${theme.spacing(3)};
`
);

export const IconBatchStyled = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 31px;
  height: 31px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    border: 1px solid #00000021;
  }
`;
