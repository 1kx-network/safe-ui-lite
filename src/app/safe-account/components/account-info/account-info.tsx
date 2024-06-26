import { Box } from '@mui/system';
import Link from 'next/link';

import { WalletPaper, WalletTypography } from '@/ui-kit';
import IconDefualtAddress from '@/assets/svg/defult-icon-address.svg';
import { formattedLabel } from '@/utils/formatters';
import { formatterIcon } from '@/utils/icon-formatter';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import { IOptionNetwork } from '@/constants/networks';

import { AccountPreviewItemstyled, styleWalletPaper } from './account-info-styles';

interface IAccountInfo {
  account?: string;
  chosenNetwork?: IOptionNetwork | null;
}

export const AccountInfo = ({ account, chosenNetwork }: IAccountInfo) => {
  return (
    <>
      <WalletPaper style={styleWalletPaper}>
        <WalletTypography fontSize={17} fontWeight={600}>
          Safe Account preview
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
              {chosenNetwork ? formatterIcon(chosenNetwork.chainId, '15px', '15px') : ''}
              <WalletTypography fontSize={14} fontWeight={600} textTransform="capitalize">
                {chosenNetwork && (chosenNetwork.name || chosenNetwork.label)}
              </WalletTypography>
            </Box>
          </AccountPreviewItemstyled>
          <AccountPreviewItemstyled noBorder={true}>
            <WalletTypography fontSize={14} fontWeight={600} style={{ whiteSpace: 'nowrap' }}>
              Safe Account RPC
            </WalletTypography>
            <Link href={(chosenNetwork && chosenNetwork.rpc) ?? '/'} target="_black">
              <Box
                display={'flex'}
                alignItems={'left'}
                width={'100%'}
                sx={{ overflowWrap: 'break-word' }}
              >
                <WalletTypography fontSize={14} style={{ width: '100%' }}>
                  {(chosenNetwork && chosenNetwork.rpc) ?? ''}
                </WalletTypography>
              </Box>
            </Link>
          </AccountPreviewItemstyled>
        </Box>
      </WalletPaper>
    </>
  );
};
