'use client';
import { v4 as uuid } from 'uuid';
import { getAddress } from 'ethers';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Methods } from '@safe-global/safe-apps-sdk';
import type { EIP712TypedData, SafeSettings } from '@safe-global/safe-apps-sdk';
import { ChainInfo, getTransactionDetails } from '@safe-global/safe-gateway-typescript-sdk';
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
import useChains from '@/hooks/useChains';
// import { useAppSelector } from '@/store';
// import { selectOnChainSigning } from '@/store/settingsSlice';
// import { isOffchainEIP1271Supported } from '@/utils/safe-messages';
// import useActiveSafeAddress from '@/stores/safe-address-store';
import useSafeStore from '@/stores/safe-store';
import useActiveSafeAddress from '@/stores/safe-address-store';
import { NATIVE_TOKENS } from '@/constants/tokens';
import { TYPE_SIGN_TRX } from '@/constants/type-sign';
import { setDataDB } from '@/db/set-info';
import routes from '@/app/routes';

import { NotificationMessages, showNotification } from './notifications';

import { SafeWalletProvider } from '.';
import type { AppInfo, WalletSDK } from '.';

export const _useTxFlowApi = (chainId: string, safeAddress: string): WalletSDK | undefined => {
  const { safeSdk: safe } = useSafeStore();
  // const { setTxFlow } = useContext(TxModalContext);
  const setTxFlow = () => {};

  const router = useRouter();

  const pendingTxs = useRef<Record<string, string>>({});

  const web3ReadOnly = useWeb3ReadOnly();
  const { configs } = useChains();
  // const onChainSigning = useAppSelector(selectOnChainSigning);
  const [settings, setSettings] = useState<SafeSettings>({
    offChainSigning: true,
  });

  useEffect(() => {
    const unsubscribe = txSubscribe(TxEvent.PROCESSING, async ({ txId, txHash }) => {
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
        const id = uuid();

        const transactions = params.txs.map(({ to, value, data }) => {
          return {
            to: getAddress(to),
            value: BigInt(value).toString(),
            data,
          };
        });

        const { title, options } = NotificationMessages.TRANSACTION_REQUEST(appInfo);
        showNotification(title, options);
        if (!safe) {
          return new Promise((_resolve, reject) => {
            reject('No Safe SDK');
          });
        }

        const safeSdk = safe;
        const safeTransaction = await safeSdk.createTransaction({
          transactions,
        });

        const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
        const thesholders = await safeSdk.getThreshold();
        const currentDate = new Date();
        const dateTrx = currentDate.toLocaleString('en-GB', { timeZone: 'UTC' }).replace(',', '');
        const networkUserInfo = configs.find((elem: ChainInfo) => elem.chainId === chainId);

        if (chainId && safeAddress) {
          const queryParams = {
            chainId: String(chainId),
            address: encodeURIComponent(safeAddress),
            amount: safeTransaction.data.value.toString(),
            destinationAddress: transactions[0].to,
            tokenType: NATIVE_TOKENS.ETH,
            networkName: networkUserInfo?.chainName ?? 'Ethereum',
            safeTxHash,
            nonce: safeTransaction.data.nonce.toString(),
            typeSignTrx: TYPE_SIGN_TRX.SEND_TOKEN,
            userNetworkTrx: JSON.stringify(networkUserInfo),
          };

          const transactionDB = {
            id,
            date: dateTrx,
            tokenType: NATIVE_TOKENS.ETH,
            theshold: thesholders,
            hash: safeTxHash,
            amount: safeTransaction.data.value.toString(),
            calldata: safeTransaction.data.data,
            destinationAddress: safeTransaction.data.to,
            nonce: safeTransaction.data.nonce.toString(),
            signatures: [],
          };

          await setDataDB(safeAddress, {
            address: safeAddress,
            transactions: [transactionDB],
          });

          const queryString = new URLSearchParams(queryParams).toString();
          router.push(`${routes.signTransaction}?${queryString}`);
        }

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
