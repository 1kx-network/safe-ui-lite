'use client';
import { useEffect, useCallback, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSwitchNetwork, useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers/react';
import { SafeTransaction } from '@safe-global/safe-core-sdk-types';
import { v4 as uuid } from 'uuid';

import { db } from '@/db';
import { useSafeSdk } from '@/hooks/useSafeSdk';
import useSafeStore from '@/stores/safe-store';
import { customToasty } from '@/components';
import useSignStore from '@/stores/sign-store';
import { returnTransactionObj } from '@/utils/new-trx-functionals';
import { ITypeSignTrx, TYPE_SIGN_TRX } from '@/constants/type-sign';
import { setDataDB } from '@/db/set-info';

export interface IUseMultySign {
  mode: 'runtime' | 'url';
  safeAddress: string;
  safeTxHash: string;
  destinationAddress?: string | null;
  address: string | null;
  amount: string | null;
  chainIdUrl: string | null;
  tokenType: string | null;
  typeSignTrx: keyof ITypeSignTrx | null;
  newThreshold: string | null;
  nonce: string | null;
}

export interface IMultySignResult {
  safeTransaction: SafeTransaction | null;
  thresholdMulty: number;
  getSignaturesFromDbMulty: () => { signatures: string[]; signers: string[] };
  getSignaturesMulty: () => { signatures: string[]; signers: string[] };
  saveSignaturesMulty: (signatures: string[], signers: string[]) => void;
  signTransactionMulty: () => Promise<void>;
  executeMulty: () => Promise<void | unknown>;
}

export interface ICheckAndSwitchNetwork {
  chainIdUrl: string | null;
  chainId: number | undefined;
  switchNetwork: (chainId: number) => void;
  open: () => void;
}

let debounceCreation = false;

export function useMultySign({
  mode,
  safeAddress,
  safeTxHash,
  amount,
  chainIdUrl,
  tokenType,
  typeSignTrx,
  address,
  newThreshold,
  nonce,
}: IUseMultySign): IMultySignResult {
  const conditionMulty = useMemo(() => !safeAddress || !safeTxHash, [safeAddress, safeTxHash]);
  const { REMOVE_OWNER, ADD_OWNER, SEND_TOKEN, CHANGE_THRESHOLD } = TYPE_SIGN_TRX;
  const { address: userWalletAddress } = useWeb3ModalAccount();

  const { createSdkInstance, createTrancationERC20 } = useSafeSdk();
  const { chainId } = useWeb3ModalAccount();
  const { safeTransaction, safeSdk, setSafeTransaction } = useSafeStore();
  const { switchNetwork } = useSwitchNetwork();
  const { open } = useWeb3Modal();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { threshold, setThreshold, status, setStatus, setOwners } = useSignStore();

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
    const owners = await safeSdk.getOwners();
    setThreshold(threshold);
    setOwners(owners);
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
          threshold: newThreshold ? +newThreshold : 1,
        });
        break;

      case CHANGE_THRESHOLD:
        resTrx = await safeSdk.createChangeThresholdTx(newThreshold ? +newThreshold : 1);
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
      if (!safeSdk || !conditionForCreateTrx) return -1;

      if (typeSignTrx === SEND_TOKEN) {
        if (!chainId || !safeSdk || !tokenType) return -1;
        if (debounceCreation) return -1;
        debounceCreation = true;
        console.log(`wazzup`);
        setTimeout(() => (debounceCreation = false), 500);
        const objTrx = await returnTransactionObj(
          address,
          amount,
          tokenType,
          chainId,
          searchParams.get('calldata') || '0x',
          createTrancationERC20
        );

        if (!objTrx) return;
        const safeTransaction = await safeSdk.createTransaction({
          transactions: [objTrx],
          options: {
            nonce: nonce ? +nonce : 0,
          },
        });
        await setSafeTransaction(safeTransaction);

        const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
        const thesholders = await safeSdk.getThreshold();
        const currentDate = new Date();
        const dateTrx = currentDate.toLocaleString('en-GB', { timeZone: 'UTC' }).replace(',', '');
        const transactionDB = {
          id: uuid(),
          date: dateTrx,
          tokenType,
          theshold: thesholders,
          hash: safeTxHash,
          amount: safeTransaction.data.value,
          calldata: safeTransaction.data.data,
          destinationAddress: safeTransaction.data.to,
          nonce,
          signatures: [],
        };
        await setDataDB(safeAddress, {
          address: safeAddress,
          transactions: [transactionDB],
        });
        if (status === 'loading') {
          setStatus('');
        }

        return 0;
      }

      const resTransaction = await trxResponseByType();
      if (!resTransaction) return;
      setSafeTransaction(resTransaction);
    };

    pendingCreateTrxData();
  }, [
    safeSdk,
    conditionMulty,
    chainId,
    safeAddress,
    safeTxHash,
    amount,
    address,
    typeSignTrx,
    status,
  ]);

  useEffect(() => {
    return () => {
      setSafeTransaction(null);
    };
  }, []);

  useEffect(() => {
    console.log(`userWalletAddress: ${userWalletAddress}`);
    if (transaction && transaction.signatures.length > 0) {
      checkSignedStatus();
    }
  }, [transaction, userWalletAddress]);

  useEffect(() => {
    if (userWalletAddress) {
      createSdkInstance(safeAddress);
    }
  }, [userWalletAddress]);

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

      if (mode === 'url') {
        originalUrl.searchParams.set('signatures', encodedSignatures.join(','));
        originalUrl.searchParams.set('signers', encodedSigners.join(','));
      }

      if (transaction) {
        if (transaction.signatures.length !== signers.length) {
          db.safes.where({ address: safeAddress }).modify(safe => {
            safe.transactions = safe.transactions.map(trx => {
              if (trx.hash !== transaction.hash) return trx;
              trx.signatures = [];
              signers.map((s, idx) => {
                trx.signatures.push({ data: signatures[idx], signer: signers[idx] });
              });
              return trx;
            });
          });
        }
      }
      router.push(originalUrl.toString());
    },
    [router, transaction, chainId, conditionMulty]
  );

  const checkSignedStatus = useCallback(() => {
    const { signers } = getSignaturesMulty();
    const signed = signers.some(signer => signer === userWalletAddress);
    console.log(`signed: ${signed}`);
    if (signed) {
      setStatus('signed');
    } else {
      if (status === 'signed') {
        setStatus('');
      }
    }
  }, [userWalletAddress, chainId, getSignaturesMulty]);

  const signTransactionMulty = useCallback(async () => {
    if (conditionMulty) return;
    if (!safeSdk || !safeTransaction || !userWalletAddress) return;

    try {
      const signedTransaction = await safeSdk.signTransaction(safeTransaction);
      setSafeTransaction(signedTransaction);

      const { signatures, signers } = getSignaturesMulty();
      let signature = '';
      signedTransaction.signatures.forEach(value => {
        if (value.signer !== userWalletAddress) return;
        signature = value.data;
      });
      const signer = userWalletAddress;
      signatures.push(encodeURIComponent(signature));
      signers.push(encodeURIComponent(signer));

      saveSignaturesMulty(signatures, signers);
      customToasty('This wallet signed successfully', 'success');
    } catch (error) {
      if ((error as { message: string }).message) {
        customToasty('Something went wrong with sign!', 'error');
        console.error(`<--${(error as { message: string }).message as string}-->`);
        checkSignedStatus();
      }
    }
  }, [safeSdk, safeTransaction, safeTxHash, status, chainId, userWalletAddress]);

  const executeMulty = useCallback(async () => {
    try {
      if (conditionMulty) return;

      setStatus('loading');
      const { signatures, signers } = getSignaturesMulty();
      if (!safeSdk || !safeTransaction || !signatures || !signers) return;
      signatures.map((sig: string, idx: number) =>
        safeTransaction.addSignature({
          data: sig,
          isContractSignature: false,
          signer: signers[idx],
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
      checkSignedStatus();
      console.error(`<-- ${error} -->`);
      return error;
    }
  }, [mode, conditionMulty, safeSdk, safeTransaction, chainId, status, safeTxHash]);

  useEffect(() => {
    if (transaction) {
      const { signatures, signers } = getSignaturesMulty();
      saveSignaturesMulty(signatures, signers);
    }
  }, [transaction, chainId]);

  return {
    safeTransaction,
    thresholdMulty: threshold,
    getSignaturesFromDbMulty,
    getSignaturesMulty,
    saveSignaturesMulty,
    signTransactionMulty,
    executeMulty,
  };
}
