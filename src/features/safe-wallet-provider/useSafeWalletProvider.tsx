'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Methods } from '@safe-global/safe-apps-sdk';
import type { EIP712TypedData, SafeSettings } from '@safe-global/safe-apps-sdk';
import { getTransactionDetails } from '@safe-global/safe-gateway-typescript-sdk';
// import { getAddress } from 'ethers';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';

// import { TxModalContext } from '@/components/tx-flow';
// import {
//   SignMessageFlow,
//   SafeAppsTxFlow,
//   SignMessageOnChainFlow,
// } from '@/components/tx-flow/flows';
// import { safeMsgSubscribe, SafeMsgEvent } from '@/services/safe-messages/safeMsgEvents';
import { TxEvent, txSubscribe } from '@/features/tx/txEvents';
import { useWeb3ReadOnly } from '@/features/web3';
// import { AppRoutes } from '@/config/routes';
// import useChains, { useCurrentChain } from '@/hooks/useChains';
// import { useAppSelector } from '@/store';
// import { selectOnChainSigning } from '@/store/settingsSlice';
// import { isOffchainEIP1271Supported } from '@/utils/safe-messages';
// import useActiveSafeAddress from '@/stores/safe-address-store';
import useSafeStore from '@/stores/safe-store';
import useActiveSafeAddress from '@/stores/safe-address-store';

import { NotificationMessages, showNotification } from './notifications';

import { SafeWalletProvider } from '.';
import type { AppInfo, WalletSDK } from '.';

export const _useTxFlowApi = (chainId: string, safeAddress: string): WalletSDK | undefined => {
  const { safeSdk: safe } = useSafeStore();
  // const currentChain = useCurrentChain();
  // const { setTxFlow } = useContext(TxModalContext);
  const setTxFlow = () => {};

  const router = useRouter();

  const pendingTxs = useRef<Record<string, string>>({});

  const web3ReadOnly = useWeb3ReadOnly();
  // const { configs } = useChains();
  // const onChainSigning = useAppSelector(selectOnChainSigning);
  const [settings, setSettings] = useState<SafeSettings>({
    offChainSigning: true,
  });

  useEffect(() => {
    const unsubscribe = txSubscribe(TxEvent.PROCESSING, async ({ txId, txHash }) => {
      console.log(`txId`, txId);
      console.log(`txHash`, txHash);
      if (!txId) return;
      pendingTxs.current[txId] = txHash;
    });
    return unsubscribe;
  }, []);

  return useMemo<WalletSDK | undefined>(() => {
    if (!chainId || !safeAddress) return;

    const signMessage = (
      _message: string | EIP712TypedData,
      appInfo: AppInfo,
      _method: Methods.signMessage | Methods.signTypedMessage
    ): Promise<{ signature: string }> => {
      // const id = Math.random().toString(36).slice(2);
      // const shouldSignOffChain =
      //   isOffchainEIP1271Supported(safe, currentChain) &&
      //   !onChainSigning &&
      //   settings.offChainSigning;

      const { title, options } = NotificationMessages.SIGNATURE_REQUEST(appInfo);
      showNotification(title, options);

      return new Promise((_resolve, _reject) => {
        // const onClose = () => {
        //   reject({
        //     code: RpcErrorCode.USER_REJECTED,
        //     message: 'User rejected signature',
        //   });
        //   unsubscribe();
        // };
        // const unsubscribeSignaturePrepared = safeMsgSubscribe(
        //   SafeMsgEvent.SIGNATURE_PREPARED,
        //   ({ requestId, signature }: { requestId: string; signature: string }) => {
        //     if (requestId === id) {
        //       resolve({ signature });
        //       unsubscribe();
        //     }
        //   }
        // );
        // const unsubscribe = () => {
        //   onClose = () => {};
        //   unsubscribeSignaturePrepared();
        // };
        // if (shouldSignOffChain) {
        //   setTxFlow(
        //     <SignMessageFlow
        //       logoUri={appInfo.iconUrl}
        //       name={appInfo.name}
        //       message={message}
        //       requestId={id}
        //       safeAppId={appInfo.id}
        //     />,
        //     onClose
        //   );
        // } else {
        //   setTxFlow(<SignMessageOnChainFlow props={{ requestId: id, message, method }} />, onClose);
        // }
      });
    };

    return {
      async signMessage(message, appInfo) {
        return await signMessage(message, appInfo, Methods.signMessage);
      },

      async signTypedMessage(typedData, appInfo) {
        return await signMessage(typedData as EIP712TypedData, appInfo, Methods.signTypedMessage);
      },

      async send(params: { txs: any[]; params: { safeTxGas: number } }, appInfo) {
        console.log(`params`, params);
        // const id = Math.random().toString(36).slice(2);

        // const transactions = params.txs.map(({ to, value, data }) => {
        //   return {
        //     to: getAddress(to),
        //     value: BigInt(value).toString(),
        //     data,
        //   };
        // });

        const { title, options } = NotificationMessages.TRANSACTION_REQUEST(appInfo);
        showNotification(title, options);

        return new Promise((_resolve, _reject) => {
          // let onClose = () => {
          //   reject({
          //     code: RpcErrorCode.USER_REJECTED,
          //     message: 'User rejected transaction',
          //   });
          // };
          // const onSubmit = (txId: string, safeTxHash: string) => {
          //   const txHash = pendingTxs.current[txId];
          //   onClose = () => {};
          //   resolve({ safeTxHash, txHash });
          // };
          //   setTxFlow(
          //     <SafeAppsTxFlow
          //       data={{
          //         appId: undefined,
          //         app: appInfo,
          //         requestId: id,
          //         txs: transactions,
          //         params: params.params,
          //       }}
          //       onSubmit={onSubmit}
          //     />,
          //     onClose
          //   );
        });
      },

      async getBySafeTxHash(safeTxHash) {
        return getTransactionDetails(chainId, safeTxHash);
      },

      async switchChain(hexChainId, appInfo) {
        console.log(`changing chain to ${hexChainId}`);
        const decimalChainId = parseInt(hexChainId, 16).toString();
        if (decimalChainId === chainId) {
          return null;
        }

        // const cfg = configs.find((c: { chainId: string }) => c.chainId === chainId);
        const cfg = { shortName: 'Eth' };
        if (!cfg) {
          throw new Error(`Chain ${chainId} not supported`);
        }
        if (
          prompt(`${appInfo.name} wants to switch to ${cfg.shortName}. Do you want to continue?`)
        ) {
          // router.push({
          //   pathname: AppRoutes.index,
          //   query: {
          //     chain: cfg.shortName,
          //   },
          // });
        }

        return null;
      },

      async showTxStatus(_safeTxHash) {
        console.log(`SHOW tx status`, _safeTxHash);
        // router.push({
        //   pathname: AppRoutes.transactions.tx,
        //   query: {
        //     safe: router.query.safe,
        //     id: safeTxHash,
        //   },
        // });
      },

      setSafeSettings(newSettings) {
        const res = {
          ...settings,
          ...newSettings,
        };

        setSettings(newSettings);

        return res;
      },

      async proxy(method, params) {
        return web3ReadOnly?.send(method, params);
      },
    };
  }, [
    chainId,
    safeAddress,
    safe,
    // currentChain,
    // onChainSigning,
    settings,
    setTxFlow,
    // configs,
    router,
    web3ReadOnly,
  ]);
};

const useSafeWalletProvider = (): SafeWalletProvider | undefined => {
  const { chainId } = useWeb3ModalAccount();
  const { safeAddress } = useActiveSafeAddress();

  const txFlowApi = _useTxFlowApi(chainId ? chainId.toString() : '1', safeAddress ?? '');

  return useMemo(() => {
    if (!safeAddress || !chainId || !txFlowApi) return;

    return new SafeWalletProvider(
      {
        safeAddress,
        chainId: chainId,
      },
      txFlowApi
    );
  }, [safeAddress, chainId, txFlowApi]);
};

export default useSafeWalletProvider;
