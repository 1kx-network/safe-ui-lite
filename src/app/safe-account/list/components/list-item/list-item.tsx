import { Box } from '@mui/system';

import { WalletTypography } from '@/ui-kit';
import { formatterIcon } from '@/utils/icon-formatter';

import { BodyStyled, AccountInfoStyled, IconDefaultAddressStyled } from './list-item.styles';

interface IListItem {
  address: string;
  chainId: number;
  network?: string;
  onClick: () => void;
}

export const ListItem = ({ chainId, address, network, onClick }: IListItem) => {
  return (
    <BodyStyled onClick={onClick}>
      <IconDefaultAddressStyled width={'24px'} height={'24px'} />
      <AccountInfoStyled>
        <WalletTypography>sep:{address}</WalletTypography>
      </AccountInfoStyled>
      <Box display={'flex'} alignItems={'center'} gap={1}>
        {chainId && formatterIcon(chainId)}
        <WalletTypography component="p">
          {network ? network.charAt(0).toUpperCase() + network.slice(1) : chainId}
        </WalletTypography>
      </Box>
    </BodyStyled>
  );
};
