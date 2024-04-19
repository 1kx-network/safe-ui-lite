import { useCallback, useEffect } from 'react';
import { Grid, Typography, Divider, SvgIcon, IconButton, Tooltip, Box } from '@mui/material';
import type { ReactElement } from 'react';
import type { SessionTypes } from '@walletconnect/types';

import useLocalStorage from '@/features/local-storage/useLocalStorage';
import InfoIcon from '@/assets/svg/notifications/info.svg';
import WcHints from '../WcHints';
import WcSessionList from '../WcSessionList';
import WcInput from '../WcInput';
import WcLogoHeader from '../WcLogoHeader';
import useSafeStore from '@/stores/safe-store';

import css from './styles.module.css';

const WC_HINTS_KEY = 'wcHints';

export const WcConnectionForm = ({
  sessions,
  uri,
}: {
  sessions: SessionTypes.Struct[];
  uri: string;
}): ReactElement => {
  const [showHints = true, setShowHints] = useLocalStorage<boolean>(WC_HINTS_KEY);
  const { safeSdk } = useSafeStore();

  const onToggle = useCallback(() => {
    setShowHints(prev => !prev);
  }, [setShowHints]);

  // Show the hints only once
  useEffect(() => {
    return () => setShowHints(false);
  }, [setShowHints]);

  return (
    <Grid className={css.container}>
      <Grid item textAlign="center">
        <Tooltip
          title={showHints ? 'Hide how WalletConnect works' : 'How does WalletConnect work?'}
          placement="top"
          arrow
          className={css.infoIcon}
        >
          <span>
            <IconButton onClick={onToggle}>
              <SvgIcon component={InfoIcon} inheritViewBox />
            </IconButton>
          </span>
        </Tooltip>

        <WcLogoHeader />

        <Typography variant="body2" color="text.secondary">
          {safeSdk
            ? `Paste the pairing code below to connect to your Safe{Wallet} via WalletConnect`
            : `Please open one of your Safe Accounts to connect to via WalletConnect`}
        </Typography>

        {safeSdk ? (
          <Box mt={3}>
            <WcInput uri={uri} />
          </Box>
        ) : null}
      </Grid>

      <Divider flexItem />

      <Grid item>
        <WcSessionList sessions={sessions} />
      </Grid>

      {showHints && (
        <>
          <Divider flexItem />

          <Grid item mt={1}>
            <WcHints />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default WcConnectionForm;
