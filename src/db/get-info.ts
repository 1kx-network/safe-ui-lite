import { networks } from '@/context/networks';

import { INetworkDB, ISafe, ITransaction, db } from '.';

export async function getTransactionsDB(safeAddress: string): Promise<ITransaction[] | null> {
  const existingSafe: ISafe | undefined = await db.safes.get({ address: safeAddress });

  if (existingSafe && existingSafe.transactions) {
    return existingSafe.transactions;
  } else {
    return null;
  }
}

export async function getOwnersDB(safeAddress: string): Promise<string[] | null> {
  const existingSafe: ISafe | undefined = await db.safes.get({ address: safeAddress });

  if (existingSafe && existingSafe.owners) {
    return existingSafe.owners;
  } else {
    return null;
  }
}

export async function getNetworksDB(): Promise<INetworkDB[]> {
  try {
    const networksDB: INetworkDB[] = await db.networks.toArray();
    networks.push(...networksDB);
    return networksDB;
  } catch (error) {
    return [];
  }
}
