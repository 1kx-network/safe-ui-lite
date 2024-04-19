import {
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import type { SessionTypes } from '@walletconnect/types';
import { useCallback, useContext } from 'react';

import SafeAppIconCard from '@/components/safe-apps/SafeAppIconCard';
import { WCLoadingState } from '@/features/walletconnect/components/WalletConnectProvider';
import { getPeerName } from '@/features/walletconnect/services/utils';
import { WalletConnectContext } from '@/features/walletconnect/WalletConnectContext';
import { asError } from '@/features/exceptions/utils';
import useSafeStore from '@/stores/safe-store';
import useWalletConnectSessions from '../../hooks/useWalletConnectSessions';

import css from './styles.module.css';
import WcNoSessions from './WcNoSessions';

type WcSesstionListProps = {
  sessions: SessionTypes.Struct[];
};

const WcSessionListItem = ({ session }: { session: SessionTypes.Struct }) => {
  const { walletConnect, setError, isLoading, setIsLoading } = useContext(WalletConnectContext);
  const { updateSessions } = useWalletConnectSessions();

  const MAX_NAME_LENGTH = 23;
  const { safeSdk } = useSafeStore();
  let name = getPeerName(session.peer) || 'Unknown dApp';

  if (name.length > MAX_NAME_LENGTH + 1) {
    name = `${name.slice(0, MAX_NAME_LENGTH)}…`;
  }

  const onDisconnect = useCallback(async () => {
    if (!walletConnect) return;

    setIsLoading(WCLoadingState.DISCONNECT);

    try {
      await walletConnect.disconnectSession(session);
      updateSessions();
    } catch (error) {
      setIsLoading(undefined);
      setError(asError(error));
    }

    setIsLoading(undefined);
  }, [walletConnect, session, setIsLoading, setError]);

  return (
    <ListItem className={css.sessionListItem}>
      {session.peer.metadata.icons[0] && (
        <ListItemAvatar className={css.sessionListAvatar}>
          <SafeAppIconCard src={session.peer.metadata.icons[0]} alt="icon" width={20} height={20} />
        </ListItemAvatar>
      )}

      <ListItemText
        primary={name}
        primaryTypographyProps={{ color: safeSdk ? undefined : 'text.secondary' }}
      />

      <ListItemIcon className={css.sessionListSecondaryAction}>
        <Button onClick={onDisconnect} className={css.button} disabled={!!isLoading}>
          {isLoading === WCLoadingState.DISCONNECT ? <CircularProgress size={20} /> : 'Disconnect'}
        </Button>
      </ListItemIcon>
    </ListItem>
  );
};

const WcSessionList = ({ sessions }: WcSesstionListProps) => {
  if (sessions.length === 0) {
    return <WcNoSessions />;
  }

  return (
    <List className={css.sessionList}>
      {Object.values(sessions).map(session => (
        <WcSessionListItem key={session.topic} session={session} />
      ))}
    </List>
  );
};

export default WcSessionList;
