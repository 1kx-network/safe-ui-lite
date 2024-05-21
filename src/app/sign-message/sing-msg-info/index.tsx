import { Box } from '@mui/system';

import { WalletTypography } from '@/ui-kit';
import { TransactionInfoStyled } from '../sing-message.styles';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import CopyIcon from '@/assets/svg/copy.svg';
import { customToasty } from '@/components';

interface ISignMessageInfo {
  name: string;
  description: string;
  message: string;
}

export const SignMessageInfo = ({ message, name, description }: ISignMessageInfo) => {
  const handleCopy = (address: string | null) => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    customToasty('Was copy', 'success');
  };

  return (
    <TransactionInfoStyled>
      <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
        {name}
      </WalletTypography>
      <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
        {description}
      </WalletTypography>
      <>
        <Box display={'flex'} alignItems={'center'} gap={1}>
          <WalletTypography component="p" color={themeMuiBase.palette.white} fontWeight={600}>
            Message:
          </WalletTypography>
        </Box>
        <Box display={'flex'} alignItems={'center'} gap={1}>
          <WalletTypography
            component="p"
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '500px',
              overflow: 'hidden',
            }}
            color={themeMuiBase.palette.white}
            fontWeight={600}
          >
            {message}
          </WalletTypography>
          <CopyIcon
            width="18px"
            height="19px"
            cursor="pointer"
            onClick={() => handleCopy(message)}
          />
        </Box>
      </>
    </TransactionInfoStyled>
  );
};
