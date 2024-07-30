import { ITypeSignTrx } from './type-sign';

export interface IQueryParams {
  safeAddress: string | null;
  chainIdUrl: string | null;
  amount: string | null;
  destinationAddress: string | null;
  destinationName?: string | null;
  safeTxHash: string | null;
  tokenType: string | null;
  networkName: string | null;
  thresholdUrl: string | null;
  newThreshold: string | null;
  nonce: string | null;
  calldata: string | null;
  userNetworkTrx: string | null;
  signatures: string | null;
  signers: string | null;
  typeSignTrx: keyof ITypeSignTrx | null;
  batchTr?: string | null;
}
