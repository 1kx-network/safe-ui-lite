import { type ReactElement } from 'react';
import { Badge, ButtonBase, SvgIcon } from '@mui/material';

import WalletConnectIcon from '@/assets/svg/common/walletconnect.svg';
import SafeAppIconCard from '@/components/safe-apps/SafeAppIconCard';

type WcIconProps = {
  onClick: () => void;
  sessionCount: number;
  isError: boolean;
  sessionIcon?: string;
};

const WcIcon = ({ sessionCount, sessionIcon, isError, onClick }: WcIconProps): ReactElement => {
  const showIcon = sessionCount === 1 && !!sessionIcon;

  return (
    <ButtonBase
      onClick={onClick}
      title="WalletConnect"
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '36px',
        width: '36px',
        borderRadius: '50%',
        backgroundColor: '#fff',
      }}
    >
      <Badge
        variant={isError ? 'dot' : 'standard'}
        badgeContent={
          showIcon ? (
            <SafeAppIconCard alt="Connected dApp icon" src={sessionIcon} width={18} height={18} />
          ) : (
            sessionCount
          )
        }
        color={isError ? 'error' : showIcon ? undefined : 'secondary'}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <SvgIcon component={WalletConnectIcon} inheritViewBox fontSize="medium" />
      </Badge>
    </ButtonBase>
  );
};

export default WcIcon;
