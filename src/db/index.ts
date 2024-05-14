import Dexie, { Table } from 'dexie';
import { EIP712TypedData } from '@safe-global/safe-core-sdk-types';

import { IAddressBook } from '@/stores/address-book-store';

export interface INetworkDB {
  id?: string;
  name: string;
  currency: string;
  explorerUrl: string;
  rpcUrl: string;
  symbol: string;
  decimals: number;
  chainId: number;
  isNew?: boolean;
}

export interface IUserCustomNetwork {
  network: INetworkDB;
}
export interface ISignature {
  signer: string;
  data: string;
}

export interface IMessage {
  id: string;
  date: string;
  data: string | EIP712TypedData;
  name: string;
  description: string;
  threshold: number;
  hash: string;
  signatures: ISignature[];
}

export interface ITransaction {
  id: string;
  date: string;
  tokenType: string;
  theshold: number;
  hash: string;
  amount: string;
  destinationAddress: string;
  calldata: string;
  signatures: ISignature[];
}

export interface ISafe {
  id?: number;
  address: string;
  owners: string[];
  messages: IMessage[];
  transactions: ITransaction[];
}

export class MySubClassedDexie extends Dexie {
  public transactions!: Table<ITransaction>;
  public safes!: Table<ISafe>;
  public networks!: Table<INetworkDB>;
  public addressBook!: Table<IAddressBook>;

  public constructor() {
    super('safe-ui-lite');
    this.version(1).stores({
      transactions: '++id, hash, safeAccount',
      safes: 'address, owners',
      networks: '++id',
      addressBook: 'address',
    });
  }
}

export const db = new MySubClassedDexie();
