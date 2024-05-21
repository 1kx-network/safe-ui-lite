import { ITypeSignTrx } from './type-sign';

export interface IQueryParams {
  safeAddress: string | null;
  chainIdUrl: string | null;
  amount: string | null;
  destinationAddress: string | null;
  safeTxHash: string | null;
  tokenType: string | null;
  networkName: string | null;
  thresholdUrl: string | null;
  newThreshold: string | null;
  nonceUrl: string | null;
  calldata: string | null;
  userNetworkTrxUrl: string | null;
  signatures: string | null;
  signers: string | null;
  typeSignTrx: keyof ITypeSignTrx | null;
  batchTr?: string | null;
}
