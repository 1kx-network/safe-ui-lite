import { create } from 'zustand';

type Store = {
  owners: string[];
  needConfirmOwner: number;

  setOwners: (payload: string[]) => void;
  setNeedConfirmOwner: (payload: number) => void;
  setClearOwners: () => void;
  setArrayOwners: (payload: string[]) => void;
};

const defaultStore = {
  owners: [],
  needConfirmOwner: 1,
};

const useActiveOwnerStore = create<Store>(set => ({
  ...defaultStore,

  setOwners: (payload: string[]) => {
    set(state => ({ ...state, owners: Array.from(new Set([...state.owners, ...payload])) }));
  },

  setNeedConfirmOwner: (payload: number) => set(state => ({ ...state, needConfirmOwner: payload })),
  setArrayOwners: (payload: string[]) => {
    set(state => ({ ...state, owners: payload }));
  },
  setClearOwners: () => () => set(() => defaultStore),
}));

export default useActiveOwnerStore;
