import { useState } from 'react';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';

import { WalletButton } from '@/ui-kit';
import CreateNewBatchCard from '../create-batch/CreateBatch';
import TransactionsBatchList from '../TransactionsBatchList/transactionsBatchList';
import useTransactionStore from '../../store/tr-context-store';
import useTransactionLibrary from '../../hooks/transactionLibrary';
import useModal from '../../hooks/useModal';
import WrongChainBatchModal from '../modals/WrongChainBatchModal';
import useSafeStore from '@/stores/safe-store';

import { FilenameLabelStyled, TransactionsSectionWrapperStyled } from './create-transaction.styles';

const CreateTransactions = () => {
  const [fileName, setFileName] = useState('');

  const {
    transactions,
    removeAllTransactions,
    replaceTransaction,
    reorderTransactions,
    removeTransaction,
  } = useTransactionStore();
  const { importBatch, downloadBatch, saveBatch } = useTransactionLibrary();
  const { safeSdk } = useSafeStore();

  const { chainId } = useWeb3ModalAccount();

  const [fileChainId, setFileChainId] = useState<string>();

  const {
    open: showWrongChainModal,
    openModal: openWrongChainModal,
    closeModal: closeWrongChainModal,
  } = useModal();

  const createBatch = async () => {
    try {
      // await submitTransactions();
      // openSuccessBatchModal();
      if (!safeSdk) return;

      // TODO: Implement the SDK transaction submission
      // await sdk.txs.send({
      //   txs: transactions.map(transaction => transaction.raw),
      // });
      // await safeSdk.createTransaction({
      //   transactions: [transactionObj],
      // });
      // const trx1 = await safeSdk.createTransaction({
      //   transactions: transactions.map(transaction => transaction.raw),
      // });

      console.log('___transactions___', transactions);

      const rawTrx = transactions.map(transaction => transaction.raw);
      console.log('_rawTrx_', rawTrx);

      console.log(
        await safeSdk.createTransaction({
          transactions: rawTrx,
        })
      );

      const trx2 = await safeSdk.createTransactionBatch(rawTrx);
      console.log(trx2);

      console.log(
        await safeSdk.createTransaction({
          transactions: [trx2],
        })
      );
    } catch (e) {
      console.error('Error sending transactions:', e);
    }
  };

  return (
    <>
      <TransactionsSectionWrapperStyled>
        {transactions.length > 0 ? (
          <>
            <TransactionsBatchList
              batchTitle={fileName ? <FileNameTitle filename={fileName} /> : 'Transactions Batch'}
              transactions={transactions}
              removeTransaction={removeTransaction}
              saveBatch={saveBatch}
              downloadBatch={downloadBatch}
              removeAllTransactions={removeAllTransactions}
              replaceTransaction={replaceTransaction}
              reorderTransactions={reorderTransactions}
              showTransactionDetails={false}
              showBatchHeader
            />

            {/* Go to Review Screen button */}
            <WalletButton
              disabled={!transactions.length}
              variant="contained"
              styles={{ width: '150px' }}
              onClick={createBatch}
            >
              Send Batch
            </WalletButton>
          </>
        ) : (
          <CreateNewBatchCard
            onFileSelected={async (uploadedFile: File | null) => {
              if (uploadedFile) {
                const batchFile = await importBatch(uploadedFile);

                if (!batchFile) return;

                setFileName(batchFile.meta.name);
                const isWrongChain = +batchFile.chainId !== chainId;
                if (isWrongChain) {
                  setFileChainId(batchFile.chainId);
                  openWrongChainModal();
                }
              }
            }}
          />
        )}
      </TransactionsSectionWrapperStyled>

      {/* Uploaded batch network modal */}
      {showWrongChainModal && (
        <WrongChainBatchModal
          isOpen={showWrongChainModal}
          onClick={closeWrongChainModal}
          onClose={closeWrongChainModal}
          fileChainId={fileChainId}
        />
      )}
    </>
  );
};

export default CreateTransactions;

const FileNameTitle = ({ filename }: { filename: string }) => {
  return (
    <>
      <FilenameLabelStyled>{filename}</FilenameLabelStyled>
      {/* <UploadedLabelStyled>uploaded</UploadedLabelStyled> */}
    </>
  );
};
