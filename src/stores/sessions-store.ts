import { create } from 'zustand';
import type { SessionTypes } from '@walletconnect/types';

type Store = {
  sessions: SessionTypes.Struct[];
  setSessions: (payload: SessionTypes.Struct[]) => void;
};

const useSessionsStore = create<Store>()(set => ({
  sessions: [],
  setSessions: (payload: SessionTypes.Struct[]) => set(() => ({ sessions: payload })),
}));

export default useSessionsStore;
