import { create } from 'zustand';

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
    set(state => ({
      ...state,
      addressBook: state.addressBook.filter(({ address }) => address !== payload),
    })),

  setAddressBookArray: (payload: IAddressBook[]) =>
    set(state => {
      console.log('payload', payload);

      return { ...state, addressBook: payload };
    }),
}));

export default useAddressBookStore;
