'use client';

import { memo } from 'react';
import { Box } from '@mui/system';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

import { getTransactionText } from '../../utils/utils';
import { WalletTypography } from '@/ui-kit';
import { formattedLabel } from '@/utils/foramtters';
import { ProposedTransaction } from '../../typings/models';
import TransactionDetailsItem from '../TransactionDetailsItem/TransactionDetailsItem';
import IconEdit from '@/assets/svg/edit.svg';
import IconTrash from '@/assets/svg/delete.svg';

import {
  AccordionItemButtonStyled,
  BoxTxPositionStyled,
  TransactionListItem,
  TxPositionStyled,
  styledItemPanel,
} from './transaction-batch.styles';

const UNKNOWN_POSITION_LABEL = '?';

type TransactionProps = {
  transaction: ProposedTransaction;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  isLastTransaction: boolean;
  showTransactionDetails: boolean;
  index: number;
  draggableTxIndexDestination: number | undefined;
  draggableTxIndexOrigin: number | undefined;
  reorderTransactions?: (sourceIndex: number, destinationIndex: number) => void;
  networkPrefix: string | undefined;
  replaceTransaction?: (newTransaction: ProposedTransaction, index: number) => void;
  setTxIndexToEdit: (index: string) => void;
  openEditTxModal: () => void;
  removeTransaction?: (index: number) => void;
  setTxIndexToRemove: (index: string) => void;
  openDeleteTxModal: () => void;
};

const TransactionBatchListItem = memo(
  ({
    transaction,
    provided,
    snapshot,
    // isLastTransaction,
    showTransactionDetails,
    index,
    draggableTxIndexDestination,
    draggableTxIndexOrigin,
    // reorderTransactions,
    // networkPrefix,
    replaceTransaction,
    setTxIndexToEdit,
    openEditTxModal,
    removeTransaction,
    setTxIndexToRemove,
    openDeleteTxModal,
  }: TransactionProps) => {
    const { description } = transaction;
    const { to } = description;

    const transactionDescription = getTransactionText(description);

    const isThisTxBeingDragging = snapshot.isDragging;
    // const showArrowAdornment = !isLastTransaction && !isThisTxBeingDragging;

    const displayedTxPosition = getDisplayedTxPosition(
      index,
      isThisTxBeingDragging,
      draggableTxIndexDestination,
      draggableTxIndexOrigin
    );

    return (
      <TransactionListItem ref={provided.innerRef} {...provided.draggableProps}>
        <BoxTxPositionStyled>
          <TxPositionStyled>
            <WalletTypography fontSize={14} fontWeight={600} color="#fff">
              {displayedTxPosition}
            </WalletTypography>
          </TxPositionStyled>
        </BoxTxPositionStyled>

        <Accordion allowZeroExpanded style={{ width: '100%', borderRadius: '12px' }}>
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButtonStyled>
                <Box display={'flex'} justifyContent={'space-between'} gap={3} width={'100%'}>
                  <Box display={'flex'} gap={5}>
                    <WalletTypography fontSize={14}>{formattedLabel(to)}</WalletTypography>
                    <WalletTypography fontSize={14}>{transactionDescription}</WalletTypography>
                  </Box>

                  <Box display={'flex'} gap={3}>
                    {replaceTransaction && (
                      <Box
                        onClick={event => {
                          event.stopPropagation();
                          setTxIndexToEdit(String(index));
                          openEditTxModal();
                        }}
                        sx={{ width: '18px', height: '19px' }}
                      >
                        <IconEdit />
                      </Box>
                    )}

                    {removeTransaction && (
                      <Box
                        onClick={event => {
                          event.stopPropagation();
                          setTxIndexToRemove(String(index));
                          openDeleteTxModal();
                        }}
                        sx={{ width: '18px', height: '19px' }}
                      >
                        {' '}
                        <IconTrash />
                      </Box>
                    )}

                    {showTransactionDetails && (
                      <Box sx={{ width: '18px', height: '19px' }}>
                        <IconEdit />
                      </Box>
                    )}
                  </Box>
                </Box>
              </AccordionItemButtonStyled>
            </AccordionItemHeading>
            <AccordionItemPanel style={styledItemPanel}>
              <TransactionDetailsItem transaction={transaction} />
            </AccordionItemPanel>
          </AccordionItem>
        </Accordion>
      </TransactionListItem>
    );
  }
);

const getDisplayedTxPosition = (
  index: number,
  isDraggingThisTx: boolean,
  draggableTxIndexDestination?: number,
  draggableTxIndexOrigin?: number
): string => {
  if (isDraggingThisTx) {
    const isAwayFromDroppableZone = draggableTxIndexDestination === undefined;
    return isAwayFromDroppableZone
      ? UNKNOWN_POSITION_LABEL
      : String(draggableTxIndexDestination + 1);
  }

  if (index < Number(draggableTxIndexOrigin)) {
    return index >= Number(draggableTxIndexDestination) ? `${index + 2}` : `${index + 1}`;
  }

  if (index > Number(draggableTxIndexOrigin)) {
    return index > Number(draggableTxIndexDestination) ? `${index + 1}` : `${index}`;
  }

  return `${index + 1}`;
};

export default TransactionBatchListItem;
