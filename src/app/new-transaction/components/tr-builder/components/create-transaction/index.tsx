import { useState } from 'react';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { useRouter } from 'next/navigation';
import { MetaTransactionData } from '@safe-global/safe-core-sdk-types';

import { WalletButton } from '@/ui-kit';
import routes from '@/app/routes';
import CreateNewBatchCard from '../create-batch/CreateBatch';
import TransactionsBatchList from '../TransactionsBatchList/transactionsBatchList';
import useTransactionStore from '../../store/tr-context-store';
import useTransactionLibrary from '../../hooks/transactionLibrary';
import useModal from '../../hooks/useModal';
import WrongChainBatchModal from '../modals/WrongChainBatchModal';
import useSafeStore from '@/stores/safe-store';
import useNetworkStore from '@/stores/networks-store';
import useActiveSafeAddress from '@/stores/safe-address-store';
import { TYPE_SIGN_TRX } from '@/constants/type-sign';

import { FilenameLabelStyled, TransactionsSectionWrapperStyled } from './create-transaction.styles';

const CreateTransactions = ({ nonce }: { nonce: string | number }) => {
  const {
    transactions,
    removeAllTransactions,
    replaceTransaction,
    reorderTransactions,
    removeTransaction,
  } = useTransactionStore();
  const { importBatch, downloadBatch } = useTransactionLibrary();
  const { safeSdk } = useSafeStore();
  const { chainId } = useWeb3ModalAccount();
  const router = useRouter();
  const { chosenNetwork } = useNetworkStore();
  const { safeAddress } = useActiveSafeAddress();

  const [fileName, setFileName] = useState('');
  const [fileChainId, setFileChainId] = useState<string>();

  const {
    open: showWrongChainModal,
    openModal: openWrongChainModal,
    closeModal: closeWrongChainModal,
  } = useModal();

  const createBatch = async () => {
    try {
      if (!safeSdk || !chosenNetwork || !safeAddress) return;
      const rawTr: MetaTransactionData[] = transactions.map(transaction => transaction.raw);

      const safeTransaction = await safeSdk.createTransaction({
        transactions: rawTr,
        options: {
          nonce: nonce ? +nonce : 0,
        },
      });

      const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
      const description = transactions.map(({ description, raw }) => {
        const { contractMethod, contractFieldsValues, networkPrefix, customTransactionData } =
          description;
        return {
          method: contractMethod?.name ?? 'Transfer',
          fieldsValues: contractFieldsValues,
          networkPrefix,
          rawTr: raw,
          customData: customTransactionData,
        };
      });

      const queryParams = {
        chainId: JSON.stringify(chosenNetwork.chainId),
        address: encodeURIComponent(safeAddress),
        safeTxHash,
        typeSignTrx: TYPE_SIGN_TRX.TR_BUILD,
        nonce: JSON.stringify(nonce),
        batchTr: JSON.stringify(description),

        userNetworkTrx: JSON.stringify({
          name: chosenNetwork.value,
          chainId: chosenNetwork.chainId,
          rpcUrl: chosenNetwork.rpc,
          explorerUrl: chosenNetwork.explorerUrl,
          currency: chosenNetwork.currency ?? '',
        }),
      };

      const queryString = new URLSearchParams(queryParams).toString();
      router.push(`${routes.signTrBuilder}?${queryString}`);
    } catch (e) {
      console.error('<-- Error sending transactions: ', e);
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

                if (!batchFile) {
                  throw Error('<-- Something wrong width batchFile -->');
                }

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
    </>
  );
};
