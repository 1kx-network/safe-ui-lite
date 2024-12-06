import { SvgIcon, Typography } from '@mui/material';
import classNames from 'classnames';
import type { CoreTypes } from '@walletconnect/types';

import SafeAppIconCard from '@/components/safe-apps/SafeAppIconCard';
import SafeLogo from '@/assets/svg/images/logo-no-text.svg';
import ConnectionDots from '@/assets/svg/images/common/connection-dots.svg';

import css from './styles.module.css';

const WcConnectionState = ({
  metadata,
  isDelete,
}: {
  metadata?: CoreTypes.Metadata;
  isDelete: boolean;
}) => {
  const name = metadata?.name || 'dApp';
  const icon = metadata?.icons[0] || '';

  return (
    <div className={css.container}>
      <div>
        <SafeLogo alt="Safe logo" width="28px" height="28px" />

        <SvgIcon
          component={ConnectionDots}
          inheritViewBox
          sx={{ mx: 2 }}
          className={classNames(css.dots, { [css.errorDots]: isDelete })}
          title="Connection state"
        />

        <SafeAppIconCard src={icon} width={28} height={28} alt={`${name} logo`} />
      </div>

      <Typography variant="h5" mt={3}>
        {isDelete ? `${name} disconnected` : `${name} successfully connected!`}
      </Typography>
    </div>
  );
};

export default WcConnectionState;
