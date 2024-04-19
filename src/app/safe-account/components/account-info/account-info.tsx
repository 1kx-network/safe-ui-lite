import { Box } from '@mui/system';

import { WalletPaper, WalletTypography } from '@/ui-kit';
import IconDefualtAddress from '@/assets/svg/defult-icon-address.svg';
import { formattedLabel } from '@/utils/foramtters';
import { formatterIcon } from '@/utils/icon-formatter';
import { themeMuiBase } from '@/assets/styles/theme-mui';

import { AccountPreviewItemstyled, styleWalletPaper } from './account-info-styles';

interface IAccountInfo {
  account?: string;
  networkName?: string;
  chainId?: number;
}

export const AccountInfo = ({ account, networkName, chainId }: IAccountInfo) => {
  return (
    <WalletPaper style={styleWalletPaper}>
      <WalletTypography fontSize={17} fontWeight={600}>
        Your Safe Account preview
      </WalletTypography>
      <Box>
        <AccountPreviewItemstyled>
          <WalletTypography fontSize={14} fontWeight={600}>
            Wallet
          </WalletTypography>
          {account && (
            <Box display={'flex'} gap={1.5}>
              <IconDefualtAddress width={'16px'} height={'16px'} />

              <WalletTypography fontSize={14}>{formattedLabel(account, 15, 15)}</WalletTypography>
            </Box>
          )}
        </AccountPreviewItemstyled>

        <AccountPreviewItemstyled>
          <WalletTypography fontSize={14} fontWeight={600}>
            Network
          </WalletTypography>
          <Box display={'flex'} alignItems={'center'} gap={themeMuiBase.spacing(2)}>
            {chainId ? formatterIcon(chainId, '15px', '15px') : ''}
            <WalletTypography fontSize={14} fontWeight={600} textTransform="capitalize">
              {networkName}
            </WalletTypography>
          </Box>
        </AccountPreviewItemstyled>

        <AccountPreviewItemstyled noBorder={true}>
          <WalletTypography fontSize={14} fontWeight={600}>
            Name
          </WalletTypography>
          <WalletTypography fontSize={14} fontWeight={600} textTransform="capitalize">
            {networkName}
          </WalletTypography>
        </AccountPreviewItemstyled>
      </Box>
    </WalletPaper>
  );
};
