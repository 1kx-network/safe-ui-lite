import { create } from 'zustand';

import { addAddressToDB, addAddressesArrayToDB, removeAddressFromDB } from '@/db/set-info';

export interface IAddressBook {
  address: string;
  chainId?: string | number;
  name?: string;
}

type Store = {
  addressBook: IAddressBook[];

  setAddressBook: (payload: IAddressBook) => void;
  removeAddressBook: (payload: string) => void;
  setAddressBookArray: (payload: IAddressBook[]) => void;
};

// need added info in indexDB
const useAddressBookStore = create<Store>(set => ({
  addressBook: [],

  setAddressBook: (payload: IAddressBook) =>
    set(state => {
      (async () => await addAddressToDB(payload))();

      const existingIndex = state.addressBook.findIndex(entry => entry.address === payload.address);
      if (existingIndex !== -1) {
        const updatedAddressBook = [...state.addressBook];
        updatedAddressBook[existingIndex] = payload;
        return { ...state, addressBook: updatedAddressBook };
      } else {
        return { ...state, addressBook: [payload, ...state.addressBook] };
      }
    }),

  removeAddressBook: (payload: string) =>
    set(state => {
      (async () => await removeAddressFromDB(payload))();

      return {
        ...state,
        addressBook: state.addressBook.filter(({ address }) => address !== payload),
      };
    }),

  setAddressBookArray: (payload: IAddressBook[]) =>
    set(state => {
      (async () => await addAddressesArrayToDB(payload))();

      return { ...state, addressBook: payload };
    }),
}));

export default useAddressBookStore;
