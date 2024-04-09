import { networks } from '@/context/networks';

import { INetworkDB, ISafe, db } from '.';

export async function setDataDB(safeAddress: string, data: Partial<ISafe>): Promise<void> {
  const existingSafe: ISafe | undefined = await db.safes.get({ address: safeAddress });

  if (existingSafe) {
    if (data.owners && data.owners.length > 0) {
      existingSafe.owners = data.owners;
    }
    if (data.transactions && data.transactions.length > 0) {
      existingSafe.transactions.unshift(...data.transactions);
    }
    await db.safes.put(existingSafe);
  } else {
    const newSafe: ISafe = {
      address: safeAddress,
      owners: data.owners || [],
      transactions: data.transactions || [],
    };
    await db.safes.add(newSafe);
  }
}

export async function addCustomNetworkDB(network: INetworkDB): Promise<void> {
  try {
    const networkWithId: INetworkDB = { ...network, id: String(network.chainId) };
    networks.push(network);

    await db.networks.add(networkWithId);
    console.log('New network added:', networkWithId);
  } catch (error) {
    console.error('Error adding network:', error);
  }
}
