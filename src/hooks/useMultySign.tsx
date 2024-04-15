import { useCallback, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSwitchNetwork, useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers/react';
import { SafeTransaction } from '@safe-global/safe-core-sdk-types';

import { db } from '@/db';
import { useSafeSdk } from '@/hooks/useSafeSdk';
import useSafeStore from '@/stores/safe-store';
import { customToasty } from '@/components';
import useSignStore from '@/stores/sign-store';
import { returnTransactionObj } from '@/utils/new-trx-functionals';
import { ITypeSignTrx, TYPE_SIGN_TRX } from '@/constants/type-sign';
interface IUseMultySign {
  safeAddress: string;
  safeTxHash: string;
  destinationAddress?: string | null;
  address: string | null;
  amount: string | null;
  chainIdUrl: string | null;
  tokenType: string | null;
  typeSignTrx: keyof ITypeSignTrx | null;
  newThresholdUrl: string | null;
  nonce: string | null;
}

export interface IMultySignResult {
  thresholdMulty: number;
  getSignaturesFromDbMulty: () => { signatures: string[]; signers: string[] };
  getSignaturesMulty: () => { signatures: string[]; signers: string[] };
  saveSignaturesMulty: (signatures: string[], signers: string[]) => void;
  signTransactionMulty: () => Promise<void>;
  executeMulty: () => Promise<void | unknown>;
}

interface ICheckAndSwitchNetwork {
  chainIdUrl: string | null;
  chainId: number | undefined;
  switchNetwork: (chainId: number) => void;
  open: () => void;
}

export function useMultySign({
  safeAddress,
  safeTxHash,
  amount,
  chainIdUrl,
  tokenType,
  typeSignTrx,
  address,
  newThresholdUrl,
  nonce,
}: IUseMultySign): IMultySignResult | undefined {
  const conditionMulty = !safeAddress || !safeTxHash;
  !address || !chainIdUrl;
  const { REMOVE_OWNER, ADD_OWNER, SEND_TOKEN, CHANGE_THRESHOLD } = TYPE_SIGN_TRX;

  const { chainId } = useWeb3ModalAccount();
  const { safeTransaction, safeSdk, setSafeTransaction } = useSafeStore();
  const { switchNetwork } = useSwitchNetwork();
  const { open } = useWeb3Modal();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { threshold, setThreshold, status, setStatus } = useSignStore();
  const { createTrancationERC20 } = useSafeSdk();

  useSafeSdk(safeAddress);

  // const conditionForCreateTrx = address && !safeTransaction && safeSdk && safeAddress;

  const safeFromDb = useLiveQuery(
    () => db.safes.where('address').equals(safeAddress).first(),
    [safeTxHash]
  );
  const transaction = safeFromDb?.transactions.find(tx => tx.hash === safeTxHash);

  const switchNetworkMulty = async (props: ICheckAndSwitchNetwork) => {
    if (conditionMulty) return;
    const { chainIdUrl, chainId, switchNetwork, open } = props;
    const shouldSwitchNetwork = chainIdUrl && +chainIdUrl !== chainId;
    const isNewNetwork = !chainId && chainIdUrl;

    if (shouldSwitchNetwork) {
      switchNetwork(+chainIdUrl);
    } else if (isNewNetwork) {
      open();
      switchNetwork(+chainIdUrl);
    }
    getOwners();
  };

  const getOwners = async () => {
    if (conditionMulty) return;
    if (!safeSdk) return;

    const threshold = await safeSdk.getThreshold();
    setThreshold(threshold);
    setStatus('');
  };

  const trxResponseByType = async () => {
    if (!safeSdk || !address) return null;

    let resTrx: SafeTransaction | null = null;

    switch (typeSignTrx) {
      case ADD_OWNER:
        resTrx = await safeSdk.createAddOwnerTx({
          ownerAddress: address,
        });
        break;

      case REMOVE_OWNER:
        resTrx = await safeSdk.createRemoveOwnerTx({
          ownerAddress: address,
          threshold: newThresholdUrl ? +newThresholdUrl : 1,
        });
        break;

      case CHANGE_THRESHOLD:
        resTrx = await safeSdk.createChangeThresholdTx(newThresholdUrl ? +newThresholdUrl : 1);
        break;

      default:
        break;
    }

    return resTrx;
  };

  useEffect(() => {
    switchNetworkMulty({ chainIdUrl, chainId, switchNetwork, open });

    if (conditionMulty) return;

    getOwners();
    const conditionForCreateTrx = amount && address && !safeTransaction && safeSdk && safeAddress;
    const pendingCreateTrxData = async () => {
      if (!safeSdk || !conditionForCreateTrx) return;
      if (typeSignTrx === SEND_TOKEN) {
        if (!chainId || !safeSdk || !tokenType || !transaction) return null;
        const data = transaction.calldata;
        const objTrx = await returnTransactionObj(
          address,
          amount,
          tokenType,
          chainId,
          data,
          createTrancationERC20
        );

        if (!objTrx) return;
        const safeTransaction = await safeSdk.createTransaction({
          transactions: [objTrx],
          options: {
            nonce: nonce ? +nonce : 0,
          },
        });

        setSafeTransaction(safeTransaction);
        return;
      }

      const resTransaction = await trxResponseByType();
      if (!resTransaction) return;
      setSafeTransaction(resTransaction);
    };

    pendingCreateTrxData();
  }, [safeSdk, conditionMulty, chainId]);

  const getSignaturesFromDbMulty = useCallback(() => {
    return (
      transaction?.signatures.reduce(
        (acc: { signatures: string[]; signers: string[] }, sig) => {
          acc.signatures.push(sig.data);
          acc.signers.push(sig.signer);
          return acc;
        },
        { signatures: [], signers: [] }
      ) ?? { signatures: [], signers: [] }
    );
  }, [transaction, chainId]);

  const getSignaturesMulty = useCallback(() => {
    const originalUrl = new URL(window.location.href);
    const signatures = originalUrl.searchParams.getAll('signatures')[0]?.split(',') ?? [];
    const signers = originalUrl.searchParams.getAll('signers')[0]?.split(',') ?? [];

    if (transaction) {
      const { signatures: signaturesFromDb, signers: signersFromDb } = getSignaturesFromDbMulty();
      signersFromDb.map((s, idx) => {
        if (!signers.includes(s)) {
          signers.push(s);
          signatures.push(signaturesFromDb[idx]);
        }
      });
    }

    return { signatures, signers };
  }, [transaction, chainId]);

  const saveSignaturesMulty = useCallback(
    (signatures: string[], signers: string[]) => {
      if (conditionMulty) return;

      if (signatures.length === 0 || signatures[0] === '') {
        return;
      }
      const originalUrl = new URL(window.location.href);
      const encodedSignatures = signatures.map(sig => encodeURIComponent(sig));
      const encodedSigners = signers.map(sig => encodeURIComponent(sig));
      originalUrl.searchParams.set('signatures', encodedSignatures.join(','));
      originalUrl.searchParams.set('signers', encodedSigners.join(','));

      if (transaction) {
        const { signers: signersFromDb } = getSignaturesFromDbMulty();
        if (transaction.signatures.length !== signers.length) {
          db.transactions.where({ hash: transaction.hash }).modify(trx => {
            signers.map((s, idx) => {
              if (!signersFromDb.includes(s)) {
                trx.signatures.push({ data: signatures[idx], signer: signers[idx] });
              }
            });
          });
        }
      }
      router.push(originalUrl.toString());
    },
    [router, transaction, chainId]
  );

  const signTransactionMulty = useCallback(async () => {
    if (conditionMulty) return;
    if (!safeSdk || !safeTransaction) return;

    try {
      const signedTransaction = await safeSdk.signTransaction(safeTransaction);
      setSafeTransaction(signedTransaction);

      const { signatures, signers } = getSignaturesMulty();
      const signature = signedTransaction.signatures.entries().next().value[1].data;
      const signer = signedTransaction.signatures.entries().next().value[1].signer;
      signatures.push(encodeURIComponent(signature));
      signers.push(encodeURIComponent(signer));
      saveSignaturesMulty(signatures, signers);
      customToasty('This wallet signed successfully', 'success');
    } catch (error) {
      if ((error as { message: string }).message) {
        customToasty('Something went wrong with sign!', 'error');
        console.error((error as { message: string }).message as string);
      }
    }
  }, [safeSdk, safeTransaction, safeTxHash, status, chainId]);

  const executeMulty = async () => {
    try {
      if (conditionMulty) return;

      setStatus('loading');
      const signatures = searchParams.getAll('signatures')[0];
      const signers = searchParams.getAll('signers')[0];
      if (!safeSdk || !safeTransaction || !signatures || !signers) return;
      signatures.split(',').map((sig: string, idx: number) =>
        safeTransaction.addSignature({
          data: sig,
          isContractSignature: false,
          signer: signers.split(',')[idx],
          staticPart: () => sig,
          dynamicPart: () => '',
        })
      );
      const txResponse = await safeSdk.executeTransaction(safeTransaction);
      await txResponse.transactionResponse?.wait();

      setStatus('success');
      customToasty('Execute success', 'success');
    } catch (error) {
      if ((error as { message: string }).message.includes('-32603')) {
        customToasty('Transaction has already been executed', 'error');
        return error;
      }
      customToasty('Something error with execute', 'error');

      return error;
    }
  };

  useEffect(() => {
    if (transaction) {
      const { signatures, signers } = getSignaturesMulty();
      saveSignaturesMulty(signatures, signers);
    }
  }, [transaction, chainId]);

  return {
    thresholdMulty: threshold,
    getSignaturesFromDbMulty,
    getSignaturesMulty,
    saveSignaturesMulty,
    signTransactionMulty,
    executeMulty,
  };
}
