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

export async function setMultipleDataDB(data: Record<string, Partial<ISafe>>): Promise<void> {
  try {
    const safeAddresses = Object.keys(data);

    const existingSafes: ISafe[] = await db.safes.where('address').anyOf(safeAddresses).toArray();

    const updatedSafes: ISafe[] = [];
    const newSafes: ISafe[] = [];

    for (const address of safeAddresses) {
      const existingSafe = existingSafes.find(safe => safe.address === address);
      const partialData = data[address];

      if (existingSafe) {
        if (partialData.owners && partialData.owners.length > 0) {
          existingSafe.owners = partialData.owners;
        }
        if (partialData.transactions && partialData.transactions.length > 0) {
          existingSafe.transactions.unshift(...partialData.transactions);
        }
        updatedSafes.push(existingSafe);
      } else {
        const newSafe: ISafe = {
          address: address,
          owners: partialData.owners || [],
          transactions: partialData.transactions || [],
        };
        newSafes.push(newSafe);
      }
    }

    if (updatedSafes.length > 0) {
      await db.safes.bulkPut(updatedSafes);
      console.log('Updated safes:', updatedSafes);
    }

    if (newSafes.length > 0) {
      await db.safes.bulkAdd(newSafes);
      console.log('Added new safes:', newSafes);
    }
  } catch (error) {
    console.error('Error updating or adding safes:', error);
  }
}

export async function addCustomNetworkDB(network: INetworkDB): Promise<void> {
  try {
    const networkWithId: INetworkDB = { ...network, id: String(network.chainId) };

    const existingNetwork = await db.networks.get(networkWithId.id || '');

    if (existingNetwork) {
      await db.networks.update(networkWithId.id || '', networkWithId);
    } else {
      await db.networks.add(networkWithId);
    }
  } catch (error) {
    console.error('Error adding or updating network:', error);
  }
}

// Function work width Address book DB
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
