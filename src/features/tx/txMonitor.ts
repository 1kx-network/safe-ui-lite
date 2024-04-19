import { type JsonRpcProvider, type TransactionReceipt } from 'ethers';

import { didRevert, type EthersError } from '@/utils/ethers-utils';
import { txDispatch, TxEvent } from '@/features/tx/txEvents';
import { POLLING_INTERVAL } from '@/constants/wallet-connect';
import { Errors, logError } from '@/features/exceptions';
import { asError } from '../exceptions/utils';
import { SimpleTxWatcher } from '@/utils/SimpleTxWatcher';

export function _getRemainingTimeout(defaultTimeout: number, submittedAt?: number) {
  const timeoutInMs = defaultTimeout * 60_000;
  const timeSinceSubmission = submittedAt !== undefined ? Date.now() - submittedAt : 0;

  return Math.max(timeoutInMs - timeSinceSubmission, 1);
}

// Provider must be passed as an argument as it is undefined until initialised by `useInitWeb3`
export const waitForTx = async (
  provider: JsonRpcProvider,
  txIds: string[],
  txHash: string,
  safeAddress: string,
  walletAddress: string,
  walletNonce: number
) => {
  const processReceipt = (receipt: TransactionReceipt | null, txIds: string[]) => {
    if (receipt === null) {
      txIds.forEach(txId => {
        txDispatch(TxEvent.FAILED, {
          txId,
          error: new Error(
            `Transaction not found. It might have been replaced or cancelled in the connected wallet.`
          ),
        });
      });
    } else if (didRevert(receipt)) {
      txIds.forEach(txId => {
        txDispatch(TxEvent.REVERTED, {
          txId,
          error: new Error('Transaction reverted by EVM.'),
        });
      });
    } else {
      txIds.forEach(txId => {
        txDispatch(TxEvent.PROCESSED, {
          txId,
          safeAddress,
          txHash,
        });
      });
    }
  };

  const processError = (err: any, txIds: string[]) => {
    const error = err as EthersError;

    txIds.forEach(txId => {
      txDispatch(TxEvent.FAILED, {
        txId,
        error: asError(error),
      });
    });
  };

  try {
    const receipt = await SimpleTxWatcher.getInstance().watchTxHash(
      txHash,
      walletAddress,
      walletNonce,
      provider
    );
    processReceipt(receipt, txIds);
  } catch (error) {
    processError(error, txIds);
  }
};

export enum TaskState {
  CheckPending = 'CheckPending',
  ExecPending = 'ExecPending',
  ExecSuccess = 'ExecSuccess',
  ExecReverted = 'ExecReverted',
  WaitingForConfirmation = 'WaitingForConfirmation',
  Blacklisted = 'Blacklisted',
  Cancelled = 'Cancelled',
  NotFound = 'NotFound',
}

type TransactionStatusResponse = {
  chainId: number;
  taskId: string;
  taskState: TaskState;
  creationDate: string;
  lastCheckDate?: string;
  lastCheckMessage?: string;
  transactionHash?: string;
  blockNumber?: number;
  executionDate?: string;
};

const TASK_STATUS_URL = 'https://relay.gelato.digital/tasks/status';
const getTaskTrackingUrl = (taskId: string) => `${TASK_STATUS_URL}/${taskId}`;

export const getRelayTxStatus = async (
  taskId: string
): Promise<{ task: TransactionStatusResponse } | undefined> => {
  const url = getTaskTrackingUrl(taskId);

  let response;

  try {
    response = await fetch(url).then(res => {
      // 404s can happen if gelato is a bit slow with picking up the taskID
      if (res.status !== 404 && res.ok) {
        return res.json();
      }

      return res.json().then(data => {
        throw new Error(`${res.status} - ${res.statusText}: ${data?.message}`);
      });
    });
  } catch (error) {
    logError(Errors._632, error);
    return;
  }

  return response;
};

const WAIT_FOR_RELAY_TIMEOUT = 3 * 60_000; // 3 minutes

export const waitForRelayedTx = (
  taskId: string,
  txIds: string[],
  safeAddress: string,
  groupKey?: string
): void => {
  const intervalId: NodeJS.Timeout = setInterval(async () => {
    const status = await getRelayTxStatus(taskId);

    // 404
    if (!status) {
      return;
    }

    switch (status.task.taskState) {
      case TaskState.ExecSuccess:
        txIds.forEach(txId =>
          txDispatch(TxEvent.PROCESSED, {
            txId,
            groupKey,
            safeAddress,
          })
        );
        break;
      case TaskState.ExecReverted:
        txIds.forEach(txId =>
          txDispatch(TxEvent.REVERTED, {
            txId,
            error: new Error(`Relayed transaction reverted by EVM.`),
            groupKey,
          })
        );
        break;
      case TaskState.Blacklisted:
        txIds.forEach(txId =>
          txDispatch(TxEvent.FAILED, {
            txId,
            error: new Error(`Relayed transaction was blacklisted by relay provider.`),
            groupKey,
          })
        );
        break;
      case TaskState.Cancelled:
        txIds.forEach(txId =>
          txDispatch(TxEvent.FAILED, {
            txId,
            error: new Error(`Relayed transaction was cancelled by relay provider.`),
            groupKey,
          })
        );
        break;
      case TaskState.NotFound:
        txIds.forEach(txId =>
          txDispatch(TxEvent.FAILED, {
            txId,
            error: new Error(`Relayed transaction was not found.`),
            groupKey,
          })
        );
        break;
      default:
        // Don't clear interval as we're still waiting for the tx to be relayed
        return;
    }

    clearTimeout(failAfterTimeoutId);
    clearInterval(intervalId);
  }, POLLING_INTERVAL);

  const failAfterTimeoutId: NodeJS.Timeout = setTimeout(() => {
    txIds.forEach(txId =>
      txDispatch(TxEvent.FAILED, {
        txId,
        error: new Error(
          `Transaction not relayed in ${
            WAIT_FOR_RELAY_TIMEOUT / 60_000
          } minutes. Be aware that it might still be relayed.`
        ),
        groupKey,
      })
    );

    clearInterval(intervalId);
  }, WAIT_FOR_RELAY_TIMEOUT);
};

export const waitForCreateSafeTx = (taskId: string, _setStatus: (value: any) => void): void => {
  const intervalId: NodeJS.Timeout = setInterval(async () => {
    const status = await getRelayTxStatus(taskId);

    // 404
    if (!status) {
      return;
    }

    switch (status.task.taskState) {
      case TaskState.ExecSuccess:
        break;
      case TaskState.ExecReverted:
      case TaskState.Blacklisted:
      case TaskState.Cancelled:
      case TaskState.NotFound:
        break;
      default:
        // Don't clear interval as we're still waiting for the tx to be relayed
        return;
    }

    clearTimeout(failAfterTimeoutId);
    clearInterval(intervalId);
  }, POLLING_INTERVAL);

  const failAfterTimeoutId: NodeJS.Timeout = setTimeout(() => {
    clearInterval(intervalId);
  }, WAIT_FOR_RELAY_TIMEOUT);
};
