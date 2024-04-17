import type { RequestId } from '@safe-global/safe-apps-sdk';

import EventBus from '@/features/EventBus';

export enum TxEvent {
  SIGNED = 'SIGNED',
  SIGN_FAILED = 'SIGN_FAILED',
  PROPOSED = 'PROPOSED',
  PROPOSE_FAILED = 'PROPOSE_FAILED',
  DELETED = 'DELETED',
  SIGNATURE_PROPOSED = 'SIGNATURE_PROPOSED',
  SIGNATURE_PROPOSE_FAILED = 'SIGNATURE_PROPOSE_FAILED',
  SIGNATURE_INDEXED = 'SIGNATURE_INDEXED',
  ONCHAIN_SIGNATURE_REQUESTED = 'ONCHAIN_SIGNATURE_REQUESTED',
  ONCHAIN_SIGNATURE_SUCCESS = 'ONCHAIN_SIGNATURE_SUCCESS',
  EXECUTING = 'EXECUTING',
  PROCESSING = 'PROCESSING',
  PROCESSING_MODULE = 'PROCESSING_MODULE',
  PROCESSED = 'PROCESSED',
  REVERTED = 'REVERTED',
  RELAYING = 'RELAYING',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
  SAFE_APPS_REQUEST = 'SAFE_APPS_REQUEST',
  BATCH_ADD = 'BATCH_ADD',
  SPEEDUP_FAILED = 'SPEEDUP_FAILED',
}

type Id = { txId: string; groupKey?: string } | { txId?: string; groupKey: string };

interface TxEvents {
  [TxEvent.SIGNED]: { txId?: string };
  [TxEvent.SIGN_FAILED]: { txId?: string; error: Error };
  [TxEvent.PROPOSE_FAILED]: { error: Error };
  [TxEvent.PROPOSED]: { txId: string };
  [TxEvent.DELETED]: { safeTxHash: string };
  [TxEvent.SIGNATURE_PROPOSE_FAILED]: { txId: string; error: Error };
  [TxEvent.SIGNATURE_PROPOSED]: { txId: string; signerAddress: string };
  [TxEvent.SIGNATURE_INDEXED]: { txId: string };
  [TxEvent.ONCHAIN_SIGNATURE_REQUESTED]: Id;
  [TxEvent.ONCHAIN_SIGNATURE_SUCCESS]: Id;
  [TxEvent.EXECUTING]: Id;
  [TxEvent.PROCESSING]: Id & {
    txHash: string;
    signerAddress: string;
    signerNonce: number;
  } & (
      | { txType: 'Custom'; data: string; to: string }
      | { txType: 'SafeTx'; gasLimit: string | number | undefined }
    );
  [TxEvent.SPEEDUP_FAILED]: Id & { error: Error };
  [TxEvent.PROCESSING_MODULE]: Id & { txHash: string };
  [TxEvent.PROCESSED]: Id & { safeAddress: string; txHash?: string };
  [TxEvent.REVERTED]: Id & { error: Error };
  [TxEvent.RELAYING]: Id & { taskId: string };
  [TxEvent.FAILED]: Id & { error: Error };
  [TxEvent.SUCCESS]: Id & { txHash?: string };
  [TxEvent.SAFE_APPS_REQUEST]: { safeAppRequestId: RequestId; safeTxHash: string; txId?: string };
  [TxEvent.BATCH_ADD]: Id;
}

const txEventBus = new EventBus<TxEvents>();

export const txDispatch = txEventBus.dispatch.bind(txEventBus);

export const txSubscribe = txEventBus.subscribe.bind(txEventBus);

// Log all events
Object.values(TxEvent).forEach((event: TxEvent) => {
  txSubscribe<TxEvent>(event, detail => {
    console.info(`Transaction ${event} event received`, detail);
  });
});
