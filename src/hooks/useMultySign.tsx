import { useCallback, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import * as utils from 'ethers';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSwitchNetwork, useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers/react';
import { MetaTransactionData } from '@safe-global/safe-core-sdk-types';

import { db } from '@/db';
import { useSafeSdk } from '@/hooks/useSafeSdk';
import useSafeStore from '@/stores/safe-store';
import { customToasty } from '@/components';
import useSignStore from '@/stores/sign-store';
interface IUseMultySign {
  safeAddress: string | null;
  safeTxHash: string | null;
  destinationAddress: string | null;
  amount: string | null;
  chainIdUrl: string | null;
}

interface IMultySignResult {
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
  destinationAddress,
  amount,
  chainIdUrl,
}: IUseMultySign): IMultySignResult | undefined {
  const conditionMulty =
    !safeAddress || !safeTxHash || !destinationAddress || !amount || !chainIdUrl;

  const { chainId } = useWeb3ModalAccount();
  const { safeTransaction, safeSdk, setSafeTransaction } = useSafeStore();
  const { switchNetwork } = useSwitchNetwork();
  const { open } = useWeb3Modal();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { threshold, setThreshold, status, setStatus } = useSignStore();

  useSafeSdk(safeAddress);

  const transactions = useLiveQuery(
    () =>
      db.transactions
        .where('hash')
        .equals(safeTxHash ?? '')
        .toArray(),
    [safeTxHash]
  );

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
  };

  const getOwners = async () => {
    if (conditionMulty) return;
    if (!safeSdk) return;

    const threshold = await safeSdk.getThreshold();
    setThreshold(threshold);
    setStatus('');
  };

  useEffect(() => {
    switchNetworkMulty({ chainIdUrl, chainId, switchNetwork, open });
    if (conditionMulty) return;

    getOwners();
    const conditionForCreateTrx =
      amount && destinationAddress && !safeTransaction && safeSdk && safeAddress;

    const pendingCreateTrxData = async () => {
      if (conditionForCreateTrx) {
        const parseAmount = utils.parseUnits(amount, 'ether');
        const safeTransactionData: MetaTransactionData = {
          to: destinationAddress,
          value: String(parseAmount),
          data: '0x',
        };
        if (!safeSdk) return;

        const safeTransaction = await safeSdk.createTransaction({
          transactions: [safeTransactionData],
        });
        setSafeTransaction(safeTransaction);
      }
    };

    pendingCreateTrxData();
  }, [safeSdk]);

  const getSignaturesFromDbMulty = useCallback(() => {
    return (
      transactions![0]?.signatures.reduce(
        (acc: { signatures: string[]; signers: string[] }, sig) => {
          acc.signatures.push(sig.data);
          acc.signers.push(sig.signer);
          return acc;
        },
        { signatures: [], signers: [] }
      ) ?? { signatures: [], signers: [] }
    );
  }, [transactions]);

  const getSignaturesMulty = useCallback(() => {
    const originalUrl = new URL(window.location.href);
    const signatures = originalUrl.searchParams.getAll('signatures')[0]?.split(',') ?? [];
    const signers = originalUrl.searchParams.getAll('signers')[0]?.split(',') ?? [];
    if (transactions) {
      const { signatures: signaturesFromDb, signers: signersFromDb } = getSignaturesFromDbMulty();

      signersFromDb.map((s, idx) => {
        if (!signers.includes(s)) {
          signers.push(s);
          signatures.push(signaturesFromDb[idx]);
        }
      });
    }
    return { signatures, signers };
  }, [transactions]);

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

      if (transactions?.length) {
        const { signers: signersFromDb } = getSignaturesFromDbMulty();
        if (transactions[0].signatures.length !== signers.length) {
          db.transactions.where({ hash: transactions[0].hash }).modify(trx => {
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
    [router, transactions]
  );

  const signTransactionMulty = useCallback(async () => {
    if (conditionMulty) return;
    if (!safeSdk || !safeTransaction || !safeTxHash) return;

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
        customToasty((error as { message: string }).message as string, 'error');
      }
    }
  }, [safeSdk, safeTransaction, safeTxHash, status]);

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
    if (transactions) {
      const { signatures, signers } = getSignaturesMulty();
      saveSignaturesMulty(signatures, signers);
    }
  }, [transactions]);

  return {
    thresholdMulty: threshold,
    getSignaturesFromDbMulty,
    getSignaturesMulty,
    saveSignaturesMulty,
    signTransactionMulty,
    executeMulty,
  };
}
