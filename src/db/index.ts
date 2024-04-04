import Dexie, { Table } from 'dexie';

export interface ISignature {
  signer: string;
  data: string;
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
  transactions: ITransaction[];
}

export class MySubClassedDexie extends Dexie {
  public transactions!: Table<ITransaction>;
  public safes!: Table<ISafe>;

  public constructor() {
    super('1kx');
    this.version(1).stores({
      transactions: '++id, hash, safeAccount',
      safes: 'address, owners',
    });
  }
}

export const db = new MySubClassedDexie();
