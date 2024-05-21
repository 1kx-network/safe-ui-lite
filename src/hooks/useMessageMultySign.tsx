'use client';
import { useEffect, useCallback, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useRouter } from 'next/navigation';
import { useSwitchNetwork, useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers/react';
import { v4 as uuid } from 'uuid';

import { db } from '@/db';
import { useSafeSdk } from '@/hooks/useSafeSdk';
import useSafeStore from '@/stores/safe-store';
import { customToasty } from '@/components';
import useSignStore from '@/stores/sign-store';
import { setDataDB } from '@/db/set-info';
import { SafeMsgEvent, safeMsgDispatch } from '@/features/safe-messages/safeMsgEvents';

export interface IUseMultySign {
  mode: 'runtime' | 'url';
  safeAddress: string;
  safeMsg: string;
  chainIdUrl: string | null;
  nonce: string | null;
}

export interface IMultySignResult {
  thresholdMulty: number;
  getSignaturesFromDbMulty: () => { signatures: string[]; signers: string[] };
  getSignaturesMulty: () => { signatures: string[]; signers: string[] };
  saveSignaturesMulty: (signatures: string[], signers: string[]) => void;
  signMessageMulty: () => Promise<void>;
  executeMulty: () => Promise<void | unknown>;
}

export interface ICheckAndSwitchNetwork {
  chainIdUrl: string | null;
  chainId: number | undefined;
  switchNetwork: (chainId: number) => void;
  open: () => void;
}

let debounceCreation = false;

export function useMessageMultySign({
  mode,
  safeAddress,
  safeMsg,
  chainIdUrl,
}: IUseMultySign): IMultySignResult {
  const conditionMulty = useMemo(() => !safeAddress || !safeMsg, [safeAddress, safeMsg]);
  const { address: userWalletAddress } = useWeb3ModalAccount();

  const { createSdkInstance } = useSafeSdk();
  const { chainId } = useWeb3ModalAccount();
  const { safeMessage, safeSdk, setSafeMessage } = useSafeStore();
  const { switchNetwork } = useSwitchNetwork();
  const { open } = useWeb3Modal();
  const router = useRouter();

  const { threshold, setThreshold, status, setStatus, setOwners } = useSignStore();

  const safeFromDb = useLiveQuery(
    () => db.safes.where('address').equals(safeAddress).first(),
    [safeMsg]
  );
  const message = safeFromDb?.messages.find(msg => msg.data === safeMsg);

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

  useEffect(() => {
    switchNetworkMulty({ chainIdUrl, chainId, switchNetwork, open });

    if (conditionMulty) return;

    getOwners();

    const conditionForCreateTrx = !safeMessage && safeSdk && safeAddress;

    const pendingCreateTrxData = async () => {
      if (!safeSdk || !conditionForCreateTrx) return -1;

      if (!chainId || !safeSdk) return -1;
      if (debounceCreation) return -1;
      debounceCreation = true;
      setTimeout(() => (debounceCreation = false), 500);

      const safeMessage = await safeSdk.createMessage(safeMsg);
      await setSafeMessage(safeMessage);
      if (message) {
        return;
      }
      const safeMsgHash = await safeSdk.getSafeMessageHash(safeMsg);
      const thresholders = await safeSdk.getThreshold();
      const currentDate = new Date();
      const dateMsg = currentDate.toLocaleString('en-GB', { timeZone: 'UTC' }).replace(',', '');
      const messageDB = {
        id: uuid(),
        date: dateMsg,
        data: safeMsg,
        name: 'Message',
        description: 'Message for sign',
        threshold: thresholders,
        hash: safeMsgHash,
        signatures: [],
      };

      await setDataDB(safeAddress, {
        address: safeAddress,
        messages: [messageDB],
      });
      if (status === 'loading') {
        setStatus('');
      }
    };

    pendingCreateTrxData();
  }, [safeSdk, message, conditionMulty, chainId, safeAddress, safeMsg, status]);

  useEffect(() => {
    return () => {
      setSafeMessage(null);
    };
  }, []);

  useEffect(() => {
    if (message && message.signatures.length > 0) {
      checkSignedStatus();
    }
  }, [message, userWalletAddress]);

  useEffect(() => {
    if (userWalletAddress) {
      createSdkInstance(safeAddress);
    }
  }, [userWalletAddress]);

  const getSignaturesFromDbMulty = useCallback(() => {
    return (
      message?.signatures.reduce(
        (acc: { signatures: string[]; signers: string[] }, sig) => {
          acc.signatures.push(sig.data);
          acc.signers.push(sig.signer);
          return acc;
        },
        { signatures: [], signers: [] }
      ) ?? { signatures: [], signers: [] }
    );
  }, [message, chainId]);

  const getSignaturesMulty = useCallback(() => {
    const originalUrl = new URL(window.location.href);
    const signatures = originalUrl.searchParams.getAll('signatures')[0]?.split(',') ?? [];
    const signers = originalUrl.searchParams.getAll('signers')[0]?.split(',') ?? [];

    if (message) {
      const { signatures: signaturesFromDb, signers: signersFromDb } = getSignaturesFromDbMulty();
      signersFromDb.map((s, idx) => {
        if (!signers.includes(s)) {
          signers.push(s);
          signatures.push(signaturesFromDb[idx]);
        }
      });
    }

    return { signatures, signers };
  }, [message, chainId]);

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

      if (message) {
        if (message.signatures.length !== signers.length) {
          db.safes.where({ address: safeAddress }).modify(safe => {
            safe.messages = safe.messages.map(msg => {
              if (msg.hash !== message.hash) return msg;
              msg.signatures = [];
              signers.map((s, idx) => {
                msg.signatures.push({ data: signatures[idx], signer: signers[idx] });
              });
              return msg;
            });
          });
        }
      }
      router.push(originalUrl.toString());
    },
    [router, message, chainId, conditionMulty]
  );

  const checkSignedStatus = useCallback(() => {
    const { signers } = getSignaturesMulty();
    const signed = signers.some(signer => signer === userWalletAddress);
    if (signed) {
      setStatus('signed');
    } else {
      if (status === 'signed') {
        setStatus('');
      }
    }
  }, [userWalletAddress, chainId, getSignaturesMulty]);

  const signMessageMulty = useCallback(async () => {
    if (conditionMulty) return;
    if (!safeSdk || !safeMessage || !userWalletAddress) return;

    try {
      const signedMessage = await safeSdk.signMessage(safeMessage);
      setSafeMessage(signedMessage);

      const { signatures, signers } = getSignaturesMulty();
      let signature = '';
      signedMessage.signatures.forEach(value => {
        if (value.signer !== userWalletAddress) return;
        signature = value.data;
      });
      const signer = userWalletAddress;
      signatures.push(encodeURIComponent(signature));
      signers.push(encodeURIComponent(signer));

      saveSignaturesMulty(signatures, signers);
      customToasty('This wallet signed successfully', 'success');
    } catch (error) {
      const message = (error as { message: string }).message;
      if (message) {
        customToasty(message, 'error');
        console.error(`<--${message}-->`);
      }
      checkSignedStatus();
    }
  }, [safeSdk, safeMessage, safeMsg, status, chainId, userWalletAddress]);

  const executeMulty = useCallback(async () => {
    try {
      // setStatus('loading');
      const { signatures, signers } = getSignaturesMulty();
      if (!safeSdk || !safeMessage || !message || !signatures || !signers) return;
      signatures.map((sig: string, idx: number) =>
        safeMessage.addSignature({
          data: sig,
          isContractSignature: false,
          signer: signers[idx],
          staticPart: () => sig,
          dynamicPart: () => '',
        })
      );

      safeMsgDispatch(SafeMsgEvent.SIGNATURE_PREPARED, {
        messageHash: message.hash,
        requestId: message.id,
        signatures,
      });
      // setStatus('success');
      customToasty('Execute success', 'success');
    } catch (error) {
      checkSignedStatus();
      const message = (error as { message: string }).message;
      if (message.includes('-32603')) {
        customToasty('Transaction has already been executed', 'error');
        return error;
      }
      customToasty(message, 'error');
      console.error(`<-- ${error} -->`);
      return error;
    }
  }, [mode, conditionMulty, safeSdk, safeMessage, chainId, status, safeMsg]);

  useEffect(() => {
    if (message) {
      const { signatures, signers } = getSignaturesMulty();
      saveSignaturesMulty(signatures, signers);
    }
  }, [message, chainId]);

  return {
    thresholdMulty: threshold,
    getSignaturesFromDbMulty,
    getSignaturesMulty,
    saveSignaturesMulty,
    signMessageMulty,
    executeMulty,
  };
}
