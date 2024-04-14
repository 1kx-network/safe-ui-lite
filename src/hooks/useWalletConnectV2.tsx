// import { useState, useCallback, useEffect, useMemo } from 'react';
// import { SignClientTypes, SessionTypes } from '@walletconnect/types';
// import { SafeAppProvider } from '@safe-global/safe-apps-provider';
// import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk';
// import { ethers } from 'ethers';
// import { Core } from '@walletconnect/core';
// import Web3WalletType, { Web3Wallet } from '@walletconnect/web3wallet';
// import { useWeb3ModalProvider } from '@web3modal/ethers/react';

// import {
//   IS_PRODUCTION,
//   SAFE_WALLET_METADATA,
//   WALLETCONNECT_V2_PROJECT_ID,
// } from '../constants/wallet-connect';
// import useSafeStore from '@/stores/safe-store';

// const EVMBasedNamespaces: string = 'eip155';

// // see full list here: https://github.com/safe-global/safe-apps-sdk/blob/main/packages/safe-apps-provider/src/provider.ts#L35
// export const compatibleSafeMethods: string[] = [
//   'eth_accounts',
//   'net_version',
//   'eth_chainId',
//   'personal_sign',
//   'eth_sign',
//   'eth_signTypedData',
//   'eth_signTypedData_v4',
//   'eth_sendTransaction',
//   'eth_blockNumber',
//   'eth_getBalance',
//   'eth_getCode',
//   'eth_getTransactionCount',
//   'eth_getStorageAt',
//   'eth_getBlockByNumber',
//   'eth_getBlockByHash',
//   'eth_getTransactionByHash',
//   'eth_getTransactionReceipt',
//   'eth_estimateGas',
//   'eth_call',
//   'eth_getLogs',
//   'eth_gasPrice',
//   'wallet_getPermissions',
//   'wallet_requestPermissions',
//   'safe_setSettings',
// ];

// // see https://docs.walletconnect.com/2.0/specs/sign/error-codes
// const UNSUPPORTED_CHAIN_ERROR_CODE = 5100;
// const INVALID_METHOD_ERROR_CODE = 1001;
// const USER_REJECTED_REQUEST_CODE = 4001;
// const USER_DISCONNECTED_CODE = 6000;

// const logger = IS_PRODUCTION ? undefined : 'debug';

// export const errorLabel =
//   'We were unable to create a connection due to compatibility issues with the latest WalletConnect v2 upgrade. We are actively working with the WalletConnect team and the dApps to get these issues resolved. Use Safe Apps instead wherever possible.';

// export type wcConnectType = (uri: string) => Promise<void>;
// export type wcDisconnectType = () => Promise<void>;

// type useWalletConnectType = {
//   wcClientData: SignClientTypes.Metadata | undefined;
//   wcConnect: wcConnectType;
//   wcDisconnect: wcDisconnectType;
//   isWallectConnectInitialized: boolean;
//   error: string | undefined;
// };

// const useWalletConnectV2 = (): useWalletConnectType => {
//   const { walletProvider } = useWeb3ModalProvider();

//   const [web3wallet, setWeb3wallet] = useState<Web3WalletType>();

//   const [wcSession, setWcSession] = useState<SessionTypes.Struct>();
//   const [isWallectConnectInitialized, setIsWallectConnectInitialized] = useState<boolean>(false);
//   const [error, setError] = useState<string>();
//   const [chainId, setChainId] = useState<string>();
//   const [safeAddress, setSafeAddress] = useState<string>();

//   const { safeSdk } = useSafeStore();
//   const web3Provider = useMemo(() => walletProvider, [walletProvider]);

//   useEffect(() => {
//     const getChainInfo = async () => {
//       try {
//         const chainId = await safeSdk?.getChainId();
//         setChainId(chainId?.toString());
//         const address = await safeSdk?.getAddress();
//         setSafeAddress(address);
//       } catch (error) {
//         console.error('Unable to get chain info:', error);
//       }
//     };

//     if (safeSdk) {
//       getChainInfo();
//     }
//   }, [safeSdk]);

//   // Initializing v2, see https://docs.walletconnect.com/2.0/javascript/web3wallet/wallet-usage
//   useEffect(() => {
//     const initializeWalletConnectV2Client = async () => {
//       const core = new Core({
//         projectId: WALLETCONNECT_V2_PROJECT_ID,
//         logger,
//       });

//       const web3wallet = await Web3Wallet.init({
//         // @ts-expect-error Wallet package mismatch
//         core,
//         metadata: SAFE_WALLET_METADATA,
//       });

//       setWeb3wallet(web3wallet);
//     };

//     try {
//       initializeWalletConnectV2Client();
//     } catch (error) {
//       console.log('Error on walletconnect version 2 initialization: ', error);
//       setError(error as string);
//     }
//   }, []);

//   // session_request needs to be a separate Effect because a valid wcSession should be present
//   useEffect(() => {
//     console.log(`wcSession`, wcSession);
//     console.log(`isWallectConnectInitialized`, isWallectConnectInitialized);
//     if (isWallectConnectInitialized && web3wallet && wcSession) {
//       web3wallet.on('session_request', async event => {
//         const { topic, id } = event;
//         const { request, chainId: transactionChainId } = event.params;
//         const { params } = request;

//         const isSafeChainId = transactionChainId === `${EVMBasedNamespaces}:${chainId}`;

//         // we only accept transactions from the Safe chain
//         if (!isSafeChainId) {
//           const errorMessage = `Transaction rejected: the connected Dapp is not set to the correct chain. Make sure the Dapp only uses ${chainId ?? 'Ethereum'} to interact with this Safe.`;
//           setError(errorMessage);
//           await web3wallet.respondSessionRequest({
//             topic,
//             response: rejectResponse(id, UNSUPPORTED_CHAIN_ERROR_CODE, errorMessage),
//           });
//           return;
//         }

//         try {
//           setError(undefined);
//           const result = await web3Provider?.request(params);
//           console.log(`RESULT:`, result);
//           await web3wallet.respondSessionRequest({
//             topic,
//             response: {
//               id,
//               jsonrpc: '2.0',
//               result,
//             },
//           });
//           console.log(`AFTER respond session request`);
//         } catch (error) {
//           setError((error as { message: string })?.message);
//           const isUserRejection = (error as { message: string })?.message?.includes?.(
//             'Transaction was rejected'
//           );
//           const code = isUserRejection ? USER_REJECTED_REQUEST_CODE : INVALID_METHOD_ERROR_CODE;
//           await web3wallet.respondSessionRequest({
//             topic,
//             response: rejectResponse(id, code, (error as { message: string })?.message),
//           });
//         }
//       });
//     }
//   }, [chainId, wcSession, isWallectConnectInitialized, web3wallet, safeSdk, web3Provider]);

//   // we set here the events & restore an active previous session
//   useEffect(() => {
//     if (!isWallectConnectInitialized && web3wallet) {
//       // we try to find a compatible active session
//       const activeSessions = web3wallet.getActiveSessions();
//       const compatibleSession = Object.keys(activeSessions)
//         .map(topic => activeSessions[topic])
//         .find(
//           session =>
//             session.namespaces[EVMBasedNamespaces].accounts[0] ===
//             `${EVMBasedNamespaces}:${chainId}:${safeSdk?.getAddress()}` // Safe Account
//         );

//       if (compatibleSession) {
//         setWcSession(compatibleSession);
//       }

//       // events
//       web3wallet.on('session_proposal', async proposal => {
//         const { id, params } = proposal;
//         const { requiredNamespaces } = params;

//         console.log('Session proposal: ', proposal);

//         const safeAccount = `${EVMBasedNamespaces}:${chainId}:${safeAddress}`;
//         const safeChain = `${EVMBasedNamespaces}:${chainId}`;
//         const safeEvents = requiredNamespaces[EVMBasedNamespaces]?.events || []; // we accept all events like chainChanged & accountsChanged (even if they are not compatible with the Safe)

//         try {
//           const wcSession = await web3wallet.approveSession({
//             id,
//             namespaces: {
//               eip155: {
//                 accounts: [safeAccount], // only the Safe account
//                 chains: [safeChain], // only the Safe chain
//                 methods: compatibleSafeMethods, // only the Safe methods
//                 events: safeEvents,
//               },
//             },
//           });

//           setWcSession(wcSession);
//           setError(undefined);
//         } catch (error) {
//           console.log('error: ', error);

//           // human readeable error
//           setError(errorLabel);

//           const errorMessage = `Connection refused: This Safe Account is in ${chainId ?? 'Ethereum'} but the Wallet Connect session proposal is not valid because it contains: 1) A required chain different than ${chainId ?? 'Ethereum'} 2) Does not include ${chainId ?? 'Ethereum'} between the optional chains 3) No EVM compatible chain is included`;
//           console.log(errorMessage);
//           await web3wallet.rejectSession({
//             id: proposal.id,
//             reason: {
//               code: UNSUPPORTED_CHAIN_ERROR_CODE,
//               message: errorMessage,
//             },
//           });
//         }
//       });

//       web3wallet.on('session_delete', async () => {
//         setWcSession(undefined);
//         setError(undefined);
//       });

//       setIsWallectConnectInitialized(true);
//     }
//   }, [safeSdk, web3wallet, isWallectConnectInitialized, safeAddress, chainId]);

//   const wcConnect = useCallback<wcConnectType>(
//     async (uri: string) => {
//       const isValidWalletConnectUri = uri && uri.startsWith('wc');

//       if (isValidWalletConnectUri && web3wallet) {
//         console.log(`uri valid`);
//         console.log(`web3wallet`, web3wallet);
//         const pairingRes = await web3wallet.core.pairing.pair({ uri });
//         console.log(`pairingRes`, pairingRes);
//       }
//     },
//     [web3wallet]
//   );

//   const wcDisconnect = useCallback<wcDisconnectType>(async () => {
//     if (wcSession && web3wallet) {
//       await web3wallet.disconnectSession({
//         topic: wcSession.topic,
//         reason: {
//           code: USER_DISCONNECTED_CODE,
//           message: 'User disconnected. Safe Wallet Session ended by the user',
//         },
//       });
//       setWcSession(undefined);
//       setError(undefined);
//     }
//   }, [web3wallet, wcSession]);

//   const wcClientData = wcSession?.peer.metadata;

//   return { wcConnect, wcClientData, wcDisconnect, isWallectConnectInitialized, error };
// };

// export default useWalletConnectV2;

// const rejectResponse = (id: number, code: number, message: string) => {
//   return {
//     id,
//     jsonrpc: '2.0',
//     error: {
//       code,
//       message,
//     },
//   };
// };
