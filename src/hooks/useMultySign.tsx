'use client';
import { useEffect, useCallback, useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useRouter } from 'next/navigation';
import { useSwitchNetwork, useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers/react';
import { MetaTransactionData, SafeTransaction } from '@safe-global/safe-core-sdk-types';
import { v4 as uuid } from 'uuid';

import { ITransaction, db } from '@/db';
import { useSafeSdk } from '@/hooks/useSafeSdk';
import useSafeStore from '@/stores/safe-store';
import { customToasty } from '@/components';
import useSignStore from '@/stores/sign-store';
import { returnTransactionObj } from '@/utils/new-trx-functionals';
import { ITypeSignTrx, TYPE_SIGN_TRX } from '@/constants/type-sign';
import { setDataDB } from '@/db/set-info';
import useActiveSafeAddress from '@/stores/safe-address-store';

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
  rawTr?: MetaTransactionData[];
  signaturesFromQueryArgs?: string[] | null;
  signersFromQueryArgs?: string[] | null;
  calldata?: string | null;
}

export interface IMultySignResult {
  hash: string | null;
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

let debounceCreation = false,
  debounceCreateSafeInDb = false;

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
  rawTr,
  calldata,
  signaturesFromQueryArgs,
  signersFromQueryArgs,
}: IUseMultySign): IMultySignResult {
  const [hash, setHash] = useState<string | null>(null);

  const { REMOVE_OWNER, ADD_OWNER, SEND_TOKEN, CHANGE_THRESHOLD, TR_BUILD, ADD_MODULE } =
    TYPE_SIGN_TRX;
  const { address: userWalletAddress } = useWeb3ModalAccount();

  const { setSafeAddress } = useActiveSafeAddress();
  const { createSdkInstance, createTrancationERC20 } = useSafeSdk();
  const { chainId } = useWeb3ModalAccount();
  const { safeTransaction, safeSdk, setSafeTransaction } = useSafeStore();
  const { switchNetwork } = useSwitchNetwork();
  const { open } = useWeb3Modal();
  const router = useRouter();

  const { threshold, setThreshold, status, setStatus, setOwners } = useSignStore();

  const safeFromDb = useLiveQuery(
    () => db.safes.where('address').equals(safeAddress).first(),
    [safeTxHash]
  );
  const transaction = safeFromDb?.transactions.find(tx => tx.hash === safeTxHash);

  const conditionMulty = useMemo(
    () => !safeAddress || !safeTxHash || !safeFromDb,
    [safeAddress, safeTxHash, safeFromDb]
  );

  useEffect(() => {
    if (!debounceCreateSafeInDb) {
      debounceCreateSafeInDb = true;
      return;
    }
    if (!safeFromDb) {
      setDataDB(safeAddress, {});
    }
  }, [safeFromDb]);

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
    return () => {
      setStatus('');
      setSafeTransaction(null);
    };
  }, []);

  useEffect(() => {
    if (transaction) {
      const { signatures, signers } = getSignaturesMulty();
      saveSignaturesMulty(signatures, signers);
    }
  }, [transaction, chainId]);

  useEffect(() => {
    switchNetworkMulty({ chainIdUrl, chainId, switchNetwork, open });

    if (conditionMulty) return;
    getOwners();
    const conditionForCreateTrx = !safeTransaction && safeSdk && safeAddress;

    const pendingCreateTrxData = async () => {
      if (!safeSdk || !conditionForCreateTrx || !chainId) return;

      if (debounceCreation) return;
      debounceCreation = true;
      setTimeout(() => (debounceCreation = false), 700);

      let safeTransaction: SafeTransaction | null = null;
      let transactionsArray = null;

      // create transaction array
      const typeNativeTr =
        typeSignTrx === SEND_TOKEN || typeSignTrx === TR_BUILD || typeSignTrx === ADD_MODULE;

      const simpleTrxCond =
        (typeSignTrx === ADD_MODULE || typeSignTrx === SEND_TOKEN) && amount && address;

      if (typeNativeTr) {
        if (typeSignTrx === TR_BUILD) {
          transactionsArray = rawTr ? rawTr : undefined;
        }
        if (simpleTrxCond) {
          const res = await returnTransactionObj(
            address,
            amount,
            tokenType ?? 'ETH',
            chainId,
            calldata ?? '0x',
            createTrancationERC20
          );
          transactionsArray = res ? [res] : undefined;
        }

        if (!transactionsArray) return;
        safeTransaction = await safeSdk.createTransaction({
          transactions: transactionsArray,
          ...(typeSignTrx === TR_BUILD
            ? {}
            : {
                options: {
                  nonce: nonce ? +nonce : 0,
                },
              }),
        });

        setSafeTransaction(safeTransaction);
      } else {
        safeTransaction = await trxResponseByType();
        setSafeTransaction(safeTransaction);
      }

      if (!safeTransaction) return;

      const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
      const thesholders = await safeSdk.getThreshold();
      const currentDate = new Date();
      const dateTrx = currentDate.toLocaleString('en-GB', { timeZone: 'UTC' }).replace(',', '');
      const { signers, signatures } = getSignaturesMulty();
      const transactionDB: ITransaction = {
        id: uuid(),
        date: dateTrx,
        tokenType: tokenType ?? 'ETH',
        theshold: thesholders,
        hash: safeTxHash,
        amount: safeTransaction.data.value,
        calldata: safeTransaction.data.data,
        destinationAddress: safeTransaction.data.to,
        nonce: nonce ?? '1',
        signatures: signers.map((s, idx) => ({ data: signatures[idx], signer: s })),
      };

      if (transaction) return;
      await setDataDB(safeAddress, {
        address: safeAddress,
        transactions: [transactionDB],
      });

      if (status === 'loading') {
        setStatus('');
      }
    };

    pendingCreateTrxData();
  }, [
    transaction,
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
    if (transaction && transaction.signatures.length > 0) {
      checkSignedStatus();
    }
  }, [transaction, userWalletAddress]);

  useEffect(() => {
    if (userWalletAddress) {
      createSdkInstance(safeAddress);
      localStorage.setItem('safeAddress', safeAddress);
      setSafeAddress(safeAddress);
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

    if (signersFromQueryArgs) {
      signersFromQueryArgs.map((s, idx) => {
        if (!signers.includes(s)) {
          signers.push(s);
          if (signaturesFromQueryArgs) {
            signatures.push(signaturesFromQueryArgs[idx]);
          }
        }
      });
    }
    return { signatures, signers };
  }, [transaction, signaturesFromQueryArgs, signersFromQueryArgs, chainId]);

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
      signaturesFromQueryArgs = signatures;
      signersFromQueryArgs = signers;

      router.push(originalUrl.toString());
    },
    [router, transaction, chainId, conditionMulty]
  );

  const checkSignedStatus = useCallback(() => {
    const { signers } = getSignaturesMulty();
    const signed = signers.some(signer => signer === userWalletAddress);
    if (signed) {
      setStatus('signed');
      return;
    } else {
      if (status === 'signed') {
        setStatus('');
        return;
      }
    }
    setStatus('');
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

      const filteredSignatures = signatures.filter(sig => sig !== encodeURIComponent(signature));
      filteredSignatures.push(encodeURIComponent(signature));
      const filteredSigners = signers.filter(
        signer => signer !== encodeURIComponent(userWalletAddress)
      );
      filteredSigners.push(encodeURIComponent(signer));

      saveSignaturesMulty(filteredSignatures, filteredSigners);
      customToasty('This wallet signed successfully', 'success');
    } catch (error) {
      const message = (error as { message: string }).message;
      const shortMessage = (error as { shortMessage?: string }).shortMessage ?? 'Error';

      if (message) {
        if (message.includes('4001')) {
          customToasty(shortMessage, 'error');
        }

        console.error(`<--${message}-->`);
      }
      checkSignedStatus();
    }
  }, [safeSdk, safeTransaction, safeTxHash, status, chainId, userWalletAddress]);

  const executeMulty = useCallback(async () => {
    try {
      if (conditionMulty) return;

      setStatus('loading');
      const { signatures, signers } = getSignaturesMulty();
      if (!safeSdk || !safeTransaction || !signatures || !signers) return;
      signatures.map((sig: string, idx: number) => {
        safeTransaction.addSignature({
          data: sig,
          isContractSignature: false,
          signer: signers[idx],
          staticPart: () => sig,
          dynamicPart: () => '',
        });
      });

      const txResponse = await safeSdk.executeTransaction(safeTransaction);
      setHash(txResponse.hash);
      await txResponse.transactionResponse?.wait();
      setStatus('success');
      customToasty('Execute success', 'success');
    } catch (error) {
      checkSignedStatus();
      const message = (error as { message: string }).message;
      const shortMessage =
        (error as { shortMessage?: string }).shortMessage ?? message ?? 'Execute error';

      customToasty(shortMessage, 'error');
      console.error(`1- <-- ${error} -->`);
      return error;
    }
  }, [mode, conditionMulty, safeSdk, safeTransaction, chainId, status, safeTxHash]);

  return {
    hash,
    safeTransaction,
    thresholdMulty: threshold,
    getSignaturesFromDbMulty,
    getSignaturesMulty,
    saveSignaturesMulty,
    signTransactionMulty,
    executeMulty,
  };
}
