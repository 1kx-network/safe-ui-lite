import { useCallback, useContext, useEffect } from 'react';
import { Theme } from '@mui/material';
import { ThemeProvider as Provider } from '@emotion/react';

import useWalletConnectSessions from '@/features/walletconnect/hooks/useWalletConnectSessions';
import { WalletConnectContext } from '@/features/walletconnect/WalletConnectContext';
import useWcUri from '../../hooks/useWcUri';
import WcHeaderWidget from '../WcHeaderWidget';
import WcSessionManager from '../WcSessionMananger';
import { WalletConnectProvider } from '../WalletConnectProvider';
import useSafeStore from '@/stores/safe-store';
import SafeThemeProvider from '@/components/theme/SafeThemeProvider';

const WalletConnectWidget = () => {
  const { walletConnect, error, open, setOpen } = useContext(WalletConnectContext);
  const [uri, clearUri] = useWcUri();
  const sessions = useWalletConnectSessions();
  const { safeSdk } = useSafeStore();

  const onOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const onClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  // Open the popup if there is a pairing code in the URL or clipboard
  useEffect(() => {
    if (safeSdk && uri) {
      onOpen();
    }
  }, [safeSdk, uri, onOpen]);

  // Clear the pairing code when connected
  useEffect(() => {
    return walletConnect?.onSessionPropose(clearUri);
  }, [walletConnect, clearUri]);

  return (
    <WcHeaderWidget
      isError={!!error}
      isOpen={open}
      onOpen={onOpen}
      onClose={onClose}
      sessions={sessions}
    >
      <WcSessionManager sessions={sessions} uri={uri} />
    </WcHeaderWidget>
  );
};

const themeMode = 'dark';

const WalletConnectUi = () => (
  <WalletConnectProvider>
    <SafeThemeProvider mode={themeMode}>
      {(safeTheme: Theme) => <Provider theme={safeTheme}>{<WalletConnectWidget />}</Provider>}
    </SafeThemeProvider>
  </WalletConnectProvider>
);

export default WalletConnectUi;
