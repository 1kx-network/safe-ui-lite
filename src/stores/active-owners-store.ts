import { create } from 'zustand';

type Store = {
  owners: string[];
  needConfirmOwner: number;

  setOwners: (payload: string[]) => void;
  setNeedConfirmOwner: (payload: number) => void;
};

const useActiveOwnerStore = create<Store>(set => ({
  owners: [],
  needConfirmOwner: 1,

  setOwners: (payload: string[]) => {
    set(state => ({ ...state, owners: Array.from(new Set([...state.owners, ...payload])) }));
  },

  setNeedConfirmOwner: (payload: number) => set(state => ({ ...state, needConfirmOwner: payload })),
}));

export default useActiveOwnerStore;
