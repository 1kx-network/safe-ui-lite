'use client';

import { useCallback, useEffect, useState } from 'react';
import { toChecksumAddress } from 'web3-utils';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';

import StorageManager from '../utils/storage';
import { Batch, BatchFile, BatchTransaction, ProposedTransaction } from '../typings/models';
import useNetworkStore from '@/stores/networks-store';
import { IOptionNetwork } from '@/constants/networks';
import { encodeToHexData } from '../utils/utils';
import { validateChecksum, addChecksum } from '../utils/checksum';
import useTransactionStore from '../store/tr-context-store';
import useActiveSafeAddress from '@/stores/safe-address-store';

// const { version } = require('../../../../../../package.json');

type TransactionLibraryContextProps = {
  batches: Batch[];
  batch?: Batch;
  saveBatch: (name: string, transactions: ProposedTransaction[]) => void;
  removeBatch: (batchId: string | number) => void;
  renameBatch: (batchId: string | number, newName: string) => void;
  updateBatch: (
    batchId: string | number,
    name: string,
    transactions: ProposedTransaction[]
  ) => void;
  downloadBatch: (name: string, transactions: ProposedTransaction[]) => void;
  executeBatch: (batch: Batch) => void;
  importBatch: (file: File) => Promise<BatchFile | undefined>;
  hasChecksumWarning: boolean;
  setHasChecksumWarning: (hasChecksumWarning: boolean) => void;
  errorMessage?: string;
  setErrorMessage: (errorMessage: string) => void;
};

// Currently it only checks that none the transaction values are encoded as a number
// We don't want numbers because the maximum number in JS is 2^53 - 1 but the maximum number
// in Solidity is 2^256 - 1
const validateTransactionsInBatch = (batch: BatchFile) => {
  const { transactions } = batch;

  return transactions.every(tx => {
    const valueEncodedAsString = typeof tx.value === 'string';
    const contractInputsEncodingValid =
      tx.contractInputsValues === null ||
      Object.values(tx.contractInputsValues || {}).every(input => typeof input !== 'number');

    return valueEncodedAsString && contractInputsEncodingValid;
  });
};

// export const TransactionLibraryContext = createContext<TransactionLibraryContextProps | null>(null);

const useTransactionLibrary = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [batch, setBatch] = useState<Batch>();
  const [hasChecksumWarning, setHasChecksumWarning] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const { resetTransactions } = useTransactionStore();
  //   const { chainInfo, safe } = useNetwork();
  const { chainId } = useWeb3ModalAccount();
  const { chosenNetwork } = useNetworkStore();
  const { safeAddress } = useActiveSafeAddress();

  const loadBatches = useCallback(async (): Promise<Batch[]> => {
    if (chainId && chosenNetwork?.chainId) {
      const batchesRecords = await StorageManager.getBatches();
      const batches: Batch[] = Object.keys(batchesRecords)
        .filter(key => batchesRecords[key].chainId === chainId.toString()) // batches filtered by chain
        .reduce((batches: Batch[], key: string) => {
          const batchFile = batchesRecords[key];
          const batch = {
            id: key,
            name: batchFile.meta.name,
            transactions: convertToProposedTransactions(batchFile, chosenNetwork),
          };

          return [...batches, batch];
        }, []);

      setBatches(batches);

      return batches;
    }
    return [];
  }, [chainId]);

  useEffect(() => {
    loadBatches();
  }, [loadBatches]);

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;

    if (hasChecksumWarning) {
      id = setTimeout(() => setHasChecksumWarning(false), 5000);
    }

    return () => clearTimeout(id);
  }, [hasChecksumWarning]);

  const updateBatch = useCallback(
    async (batchId: string | number, name: string, transactions: ProposedTransaction[]) => {
      const batch = await StorageManager.getBatch(String(batchId));
      if (batch && chosenNetwork && safeAddress) {
        await StorageManager.updateBatch(
          String(batchId),
          addChecksum(
            generateBatchFile({
              name,
              description: '',
              transactions,
              chainInfo: chosenNetwork,
              safeAddress,
            })
          )
        );
      }
      const batches = await loadBatches();
      setBatch(batches.find(batch => batch.id === batchId));
    },
    [loadBatches, chainId, safeAddress]
  );

  const removeBatch = useCallback(
    async (batchId: string | number) => {
      await StorageManager.removeBatch(String(batchId));
      await loadBatches();
      setBatch(undefined);
    },
    [loadBatches]
  );

  const renameBatch = useCallback(
    async (batchId: string | number, newName: string) => {
      const batch = await StorageManager.getBatch(String(batchId));
      const trimmedName = newName.trim();
      if (batch && trimmedName) {
        batch.meta.name = trimmedName;
        await StorageManager.updateBatch(String(batchId), batch);
      }
      const batches = await loadBatches();
      setBatch(batches.find(batch => batch.id === batchId));
    },
    [loadBatches]
  );

  const downloadBatch = useCallback(
    async (name: any, transactions: any) => {
      if (!chosenNetwork || !safeAddress) {
        console.error('<-- Error  width download batch -->');
        return;
      }

      await StorageManager.downloadBatch(
        addChecksum(
          generateBatchFile({
            name,
            description: '',
            transactions,
            chainInfo: chosenNetwork,
            safeAddress,
          })
        )
      );
    },
    [chainId, safeAddress]
  );

  const initializeBatch = useCallback(
    (batchFile: BatchFile) => {
      setErrorMessage(undefined);
      if (chainId && chosenNetwork) {
        if (!validateTransactionsInBatch(batchFile)) {
          setErrorMessage(
            'Invalid transaction in the batch file. Make sure all numbers are encoded as strings.'
          );
          return;
        }

        if (validateChecksum(batchFile)) {
          console.info('[Checksum check] - Checksum validation success', batchFile);
        } else {
          setHasChecksumWarning(true);
          console.error(
            '[Checksum check] - This file was modified since it was generated',
            batchFile
          );
        }
        resetTransactions(convertToProposedTransactions(batchFile, chosenNetwork));
      }
      return batchFile;
    },
    [chainId, resetTransactions]
  );

  const executeBatch = useCallback(
    async (batch: Batch) => {
      setBatch(batch);
      const batchFile = await StorageManager.getBatch(batch.id as string);

      if (batchFile) {
        initializeBatch(batchFile);
      }
    },
    [initializeBatch]
  );

  const importBatch: TransactionLibraryContextProps['importBatch'] = useCallback(
    async file => {
      const batchFile = await initializeBatch(await StorageManager.importBatch(file));
      return batchFile;
    },
    [initializeBatch]
  );

  return {
    batches,
    batch,
    // saveBatch,
    updateBatch,
    removeBatch,
    renameBatch,
    downloadBatch,
    executeBatch,
    importBatch,
    hasChecksumWarning,
    setHasChecksumWarning,
    errorMessage,
    setErrorMessage,
  };
};

const generateBatchFile = ({
  name,
  description,
  transactions,
  chainInfo,
  safeAddress,
}: {
  name: string;
  description: string;
  transactions: ProposedTransaction[];
  chainInfo: IOptionNetwork | undefined;
  safeAddress: string;
}): BatchFile => {
  return {
    version: '1.0',
    chainId: chainInfo?.chainId.toString() || '',
    createdAt: Date.now(),
    meta: {
      name,
      description,
      // txBuilderVersion: version,
      createdFromSafeAddress: safeAddress,
      createdFromOwnerAddress: '',
    },
    transactions: convertToBatchTransactions(transactions),
  };
};

const convertToBatchTransactions = (transactions: ProposedTransaction[]): BatchTransaction[] => {
  return transactions.map(
    ({ description }: ProposedTransaction): BatchTransaction => ({
      to: description.to,
      value: description.value,
      data: description.customTransactionData,
      contractMethod: description.contractMethod,
      contractInputsValues: description.contractFieldsValues,
    })
  );
};

const convertToProposedTransactions = (
  batchFile: BatchFile,
  chainInfo: IOptionNetwork
): ProposedTransaction[] => {
  return batchFile.transactions.map((transaction, index) => {
    if (transaction.data) {
      return {
        id: index,
        contractInterface: null,
        description: {
          to: transaction.to,
          value: transaction.value,
          customTransactionData: transaction.data,
          nativeCurrencySymbol: chainInfo.currency,
          networkPrefix: chainInfo.currency,
        },
        raw: {
          to: transaction.to,
          value: transaction.value,
          data: transaction.data || '',
        },
      };
    }

    return {
      id: index,
      contractInterface: !!transaction.contractMethod
        ? { methods: [transaction.contractMethod] }
        : null,
      description: {
        to: transaction.to,
        value: transaction.value,
        contractMethod: transaction.contractMethod,
        contractMethodIndex: '0',
        contractFieldsValues: transaction.contractInputsValues,
        nativeCurrencySymbol: chainInfo.currency,
        networkPrefix: chainInfo.currency,
      },
      raw: {
        to: toChecksumAddress(transaction.to),
        value: transaction.value,
        data:
          transaction.data ||
          encodeToHexData(transaction.contractMethod, transaction.contractInputsValues) ||
          '0x',
      },
    };
  });
};

export default useTransactionLibrary;
