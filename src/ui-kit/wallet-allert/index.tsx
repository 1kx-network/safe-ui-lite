import * as React from 'react';
import { Box } from '@mui/system';

import { WalletTypography } from '..';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import InfoIcon from '@/assets/svg/b-info-icon.svg';

import { AlertStyled } from './wallet-alert.styles';

interface WalletAlertProps {
  title: string;
  description: string;
}

const WalletAlert = ({ title, description }: WalletAlertProps) => {
  return (
    <AlertStyled>
      <Box>
        <WalletTypography
          fontSize={12}
          fontWeight={600}
          component="p"
          color={themeMuiBase.palette.white}
        >
          {title}
        </WalletTypography>
        <Box mt={2}>
          <WalletTypography
            fontSize={12}
            fontWeight={400}
            component="p"
            color={themeMuiBase.palette.white}
          >
            {description}
          </WalletTypography>
        </Box>
      </Box>
      <InfoIcon width="14px" height="14px" color="white" />
    </AlertStyled>
  );
};

export default WalletAlert;
