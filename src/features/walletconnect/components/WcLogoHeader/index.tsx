import { SvgIcon, Typography } from '@mui/material';
import type { ReactElement } from 'react';

import WalletConnect from '@/assets/svg/common/walletconnect.svg';
import Alert from '@/assets/svg/notifications/alert.svg';

import css from './styles.module.css';

const WcLogoHeader = ({ errorMessage }: { errorMessage?: string }): ReactElement => {
  return (
    <>
      <div>
        <SvgIcon component={WalletConnect} inheritViewBox className={css.icon} />
        {errorMessage && (
          <SvgIcon component={Alert} inheritViewBox className={css.errorBadge} fontSize="small" />
        )}
      </div>

      <Typography variant="h5" mt={2} mb={0.5} className={css.title}>
        {errorMessage || 'Connect dApps to Safe{Wallet}'}
      </Typography>
    </>
  );
};

export default WcLogoHeader;
