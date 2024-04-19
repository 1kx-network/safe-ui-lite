import { useContext, useEffect, useCallback } from 'react';
import type { SessionTypes } from '@walletconnect/types';

import { WalletConnectContext } from '@/features/walletconnect/WalletConnectContext';
import useSessionsStore from '@/stores/sessions-store';

function useWalletConnectSessions(): {
  sessions: SessionTypes.Struct[];
  updateSessions: () => void;
} {
  const { walletConnect } = useContext(WalletConnectContext);
  const { sessions, setSessions } = useSessionsStore();

  const updateSessions = useCallback(() => {
    if (!walletConnect) return;
    setSessions(walletConnect.getActiveSessions());
  }, [walletConnect]);

  // Initial sessions
  useEffect(updateSessions, [updateSessions]);

  // On session add
  useEffect(() => {
    if (!walletConnect) return;
    return walletConnect.onSessionAdd(updateSessions);
  }, [walletConnect, updateSessions]);

  // On session delete
  useEffect(() => {
    if (!walletConnect) return;
    return walletConnect.onSessionDelete(updateSessions);
  }, [walletConnect, updateSessions]);

  return { sessions, updateSessions };
}

export default useWalletConnectSessions;
