'use client';

import { isValidElement, useMemo, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DragStart,
  DragUpdate,
  DropResult,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import { Box } from '@mui/system';

import { ProposedTransaction } from '../../typings/models';
import useModal from '../../hooks/useModal';
import DeleteTransactionModal from '../modals/DeleteTransactionModal';
import DeleteBatchModal from '../modals/DeleteBatchModal';
import EditTransactionModal from '../modals/EditTransactionModal';
import IconDownLoad from '@/assets/svg/import.svg';
import IconTrash from '@/assets/svg/delete.svg';
import Item from '../transaction-batch-item/TransactionBatchListItems';
import VirtualizedList from '../modals/VirtualizedList';
import { getTransactionText } from '../../utils/utils';
import { EditableLabelProps } from '../EditableLabel';
import useNetwork from '../../hooks/useNetwork';
import { WalletTypography } from '@/ui-kit';

import {
  CountTrStyled,
  IconBatchStyled,
  TransactionHeader,
  TransactionList,
  TransactionsBatchWrapper,
} from './transactionsBatchList.styles';

type TransactionsBatchListProps = {
  transactions: ProposedTransaction[];
  showTransactionDetails: boolean;
  showBatchHeader: boolean;
  batchTitle?:
    | string
    | React.ReactElement<EditableLabelProps>
    | React.ReactElement<{ filename: string }>;
  removeTransaction?: (index: number) => void;
  // saveBatch?: (name: string, transactions: ProposedTransaction[]) => void;
  downloadBatch?: (name: string, transactions: ProposedTransaction[]) => void;
  removeAllTransactions?: () => void;
  replaceTransaction?: (newTransaction: ProposedTransaction, index: number) => void;
  reorderTransactions?: (sourceIndex: number, destinationIndex: number) => void;
};

const TRANSACTION_LIST_DROPPABLE_ID = 'Transaction_List';
const DROP_EVENT = 'DROP';

const TransactionsBatchList = ({
  transactions,
  reorderTransactions,
  removeTransaction,
  removeAllTransactions,
  replaceTransaction,
  downloadBatch,
  showTransactionDetails,
  showBatchHeader,
  batchTitle,
}: TransactionsBatchListProps) => {
  const [draggableTxIndexOrigin, setDraggableTxIndexOrigin] = useState<number>();
  const [draggableTxIndexDestination, setDraggableTxIndexDestination] = useState<number>();

  const { networkPrefix, getAddressFromDomain, nativeCurrencySymbol } = useNetwork();

  const onDragStart = ({ source }: DragStart) => {
    setDraggableTxIndexOrigin(source.index);
    setDraggableTxIndexDestination(source.index);
  };

  const onDragUpdate = ({ source, destination }: DragUpdate) => {
    setDraggableTxIndexOrigin(source.index);
    setDraggableTxIndexDestination(destination?.index);
  };

  const onDragEnd = ({ reason, source, destination }: DropResult) => {
    const sourceIndex = source.index;
    const destinationIndex = destination?.index;

    const isDropEvent = reason === DROP_EVENT;
    const hasTxPositionChanged = sourceIndex !== destinationIndex && destinationIndex !== undefined;

    const shouldPerformTxReorder = isDropEvent && hasTxPositionChanged;

    if (shouldPerformTxReorder) {
      reorderTransactions?.(sourceIndex, destinationIndex);
    }

    setDraggableTxIndexOrigin(undefined);
    setDraggableTxIndexDestination(undefined);
  };

  const {
    open: showDeleteBatchModal,
    openModal: openClearTransactions,
    closeModal: closeDeleteBatchModal,
  } = useModal();
  const {
    open: showDeleteTxModal,
    openModal: openDeleteTxModal,
    closeModal: closeDeleteTxModal,
  } = useModal();
  const {
    open: showEditTxModal,
    openModal: openEditTxModal,
    closeModal: closeEditTxModal,
  } = useModal();

  const [txIndexToRemove, setTxIndexToRemove] = useState<string>();
  const [txIndexToEdit, setTxIndexToEdit] = useState<string>();

  const fileName = useMemo(() => {
    if (isValidElement(batchTitle)) {
      if ('filename' in batchTitle.props) {
        return batchTitle.props.filename;
      } else if (batchTitle.props.children) {
        return batchTitle.props.children.toString();
      }

      return 'Untitled';
    }

    return batchTitle || 'Untitled';
  }, [batchTitle]);

  return (
    <>
      <TransactionsBatchWrapper>
        {showBatchHeader && (
          <TransactionHeader>
            <Box display={'flex'} alignItems={'center'}>
              <CountTrStyled>
                <WalletTypography fontSize={14} fontWeight={600} color="#fff">
                  {transactions.length}
                </WalletTypography>
              </CountTrStyled>

              {batchTitle && <WalletTypography>{batchTitle}</WalletTypography>}
            </Box>

            <Box display={'flex'} alignItems={'center'} gap={0.5}>
              {downloadBatch && (
                <IconBatchStyled onClick={() => downloadBatch(fileName, transactions)}>
                  <IconDownLoad width={'18px'} height={'19px'} color="green" />
                </IconBatchStyled>
              )}

              {removeAllTransactions && (
                <IconBatchStyled onClick={openClearTransactions}>
                  <IconTrash width={'18px'} height={'19px'} />
                </IconBatchStyled>
              )}
            </Box>
          </TransactionHeader>
        )}

        {/* Standard Transactions List */}
        {transactions.length <= 20 && (
          <DragDropContext
            onDragStart={onDragStart}
            onDragUpdate={onDragUpdate}
            onDragEnd={onDragEnd}
          >
            <Droppable mode={'standard'} droppableId={TRANSACTION_LIST_DROPPABLE_ID}>
              {(provided: DroppableProvided) => (
                <TransactionList {...provided.droppableProps} ref={provided.innerRef}>
                  {transactions.map((transaction: ProposedTransaction, index: number) => (
                    <Draggable
                      key={transaction.id}
                      index={index}
                      draggableId={transaction.id.toString()}
                      isDragDisabled={!reorderTransactions}
                    >
                      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                        <Item
                          key={transaction.id}
                          transaction={transaction}
                          provided={provided}
                          snapshot={snapshot}
                          isLastTransaction={index === transactions.length - 1}
                          showTransactionDetails={showTransactionDetails}
                          index={index}
                          draggableTxIndexDestination={draggableTxIndexDestination}
                          draggableTxIndexOrigin={draggableTxIndexOrigin}
                          reorderTransactions={reorderTransactions}
                          networkPrefix={networkPrefix}
                          replaceTransaction={replaceTransaction}
                          setTxIndexToEdit={setTxIndexToEdit}
                          openEditTxModal={openEditTxModal}
                          removeTransaction={removeTransaction}
                          setTxIndexToRemove={setTxIndexToRemove}
                          openDeleteTxModal={openDeleteTxModal}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TransactionList>
              )}
            </Droppable>
          </DragDropContext>
        )}

        {/* Virtualized Transaction List */}
        {transactions.length > 20 && (
          <DragDropContext
            onDragStart={onDragStart}
            onDragUpdate={onDragUpdate}
            onDragEnd={onDragEnd}
          >
            <Droppable
              mode={'virtual'}
              droppableId={TRANSACTION_LIST_DROPPABLE_ID}
              renderClone={(
                provided: DraggableProvided,
                snapshot: DraggableStateSnapshot,
                rubric
              ) => (
                <Item
                  key={transactions[rubric.source.index].id}
                  transaction={transactions[rubric.source.index]}
                  provided={provided}
                  snapshot={snapshot}
                  isLastTransaction={rubric.source.index === transactions.length - 1}
                  showTransactionDetails={showTransactionDetails}
                  index={rubric.source.index}
                  draggableTxIndexDestination={draggableTxIndexDestination}
                  draggableTxIndexOrigin={draggableTxIndexOrigin}
                  reorderTransactions={reorderTransactions}
                  networkPrefix={networkPrefix}
                  replaceTransaction={replaceTransaction}
                  setTxIndexToEdit={setTxIndexToEdit}
                  openEditTxModal={openEditTxModal}
                  removeTransaction={removeTransaction}
                  setTxIndexToRemove={setTxIndexToRemove}
                  openDeleteTxModal={openDeleteTxModal}
                />
              )}
            >
              {(provided: DroppableProvided) => (
                <TransactionList {...provided.droppableProps} ref={provided.innerRef}>
                  <VirtualizedList
                    innerRef={provided.innerRef}
                    items={transactions}
                    renderItem={(transaction: any, index: number) => (
                      <Draggable
                        key={transaction.id}
                        index={index}
                        draggableId={transaction.id.toString()}
                        isDragDisabled={!reorderTransactions}
                      >
                        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                          <Item
                            key={transaction.id}
                            transaction={transaction}
                            provided={provided}
                            snapshot={snapshot}
                            isLastTransaction={index === transactions.length - 1}
                            showTransactionDetails={showTransactionDetails}
                            index={index}
                            draggableTxIndexDestination={draggableTxIndexDestination}
                            draggableTxIndexOrigin={draggableTxIndexOrigin}
                            reorderTransactions={reorderTransactions}
                            networkPrefix={networkPrefix}
                            replaceTransaction={replaceTransaction}
                            setTxIndexToEdit={setTxIndexToEdit}
                            openEditTxModal={openEditTxModal}
                            removeTransaction={removeTransaction}
                            setTxIndexToRemove={setTxIndexToRemove}
                            openDeleteTxModal={openDeleteTxModal}
                          />
                        )}
                      </Draggable>
                    )}
                  />
                  {transactions.length <= 20 && provided.placeholder}
                </TransactionList>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </TransactionsBatchWrapper>

      {/* Edit transaction modal */}
      {showEditTxModal && (
        <EditTransactionModal
          isOpen={showEditTxModal}
          txIndex={Number(txIndexToEdit)}
          transaction={transactions[Number(txIndexToEdit)]}
          onSubmit={(updatedTransaction: ProposedTransaction) => {
            closeEditTxModal();
            replaceTransaction?.(updatedTransaction, Number(txIndexToEdit));
          }}
          onDeleteTx={() => {
            closeEditTxModal();
            removeTransaction?.(Number(txIndexToEdit));
          }}
          onClose={closeEditTxModal}
          networkPrefix={networkPrefix}
          getAddressFromDomain={getAddressFromDomain}
          nativeCurrencySymbol={nativeCurrencySymbol}
        />
      )}

      {/* Delete batch modal */}
      {showDeleteBatchModal && removeAllTransactions && (
        <DeleteBatchModal
          isOpen={showDeleteBatchModal && !!removeAllTransactions}
          count={transactions.length}
          onClick={() => {
            closeDeleteBatchModal();
            removeAllTransactions();
          }}
          onClose={closeDeleteBatchModal}
        />
      )}

      {/* Delete a transaction modal */}
      {showDeleteTxModal && (
        <DeleteTransactionModal
          isOpen={showDeleteTxModal}
          txIndex={Number(txIndexToRemove)}
          txDescription={getTransactionText(transactions[Number(txIndexToRemove)]?.description)}
          onClick={() => {
            closeDeleteTxModal();
            removeTransaction?.(Number(txIndexToRemove));
          }}
          onClose={closeDeleteTxModal}
        />
      )}
    </>
  );
};

export default TransactionsBatchList;
