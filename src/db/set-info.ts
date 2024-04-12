import { networks } from '@/context/networks';
import { IAddressBook } from '@/stores/address-book-store';

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

export const removeAddressFromDB = async (address: string) => {
  try {
    await db.addressBook.where('address').equals(address).delete();
    console.log('Record removed from the addressBook:', address);
  } catch (error) {
    console.error('Error removing record from the addressBook:', error);
  }
};

export const addAddressToDB = async (payload: IAddressBook) => {
  try {
    await db.addressBook.put(payload);
    console.log('Record added to the addressBook:', payload);
  } catch (error) {
    console.error('Error adding record to the addressBook:', error);
  }
};

export const addAddressesArrayToDB = async (payload: IAddressBook[]) => {
  try {
    await db.transaction('rw', db.addressBook, async () => {
      for (const entry of payload) {
        await db.addressBook.put(entry);
      }
    });
    console.log('Records added to the addressBook:', payload);
  } catch (error) {
    console.error('Error adding records to the addressBook:', error);
  }
};
