import Link from 'next/link';
import { Box } from '@mui/system';

import { WalletTypography } from '@/ui-kit';
import IconDefaultAddress from '@/assets/svg/defult-icon-address.svg';
import { ITransaction } from '@/db';
import { formatterIcon } from '@/utils/icon-formatter';
import { formattedLabel } from '@/utils/foramtters';

import { ItemInfoStyled, ItemWrapperStyled } from './item.styles';

export const ItemTransaction = (data: ITransaction & { linkOnScan: string }) => {
  const { date, tokenType, amount, linkOnScan, destinationAddress, theshold } = data;

  return (
    <ItemWrapperStyled>
      <ItemInfoStyled isFirst>
        <WalletTypography fontWeight={500}>{date}</WalletTypography>
      </ItemInfoStyled>

      <ItemInfoStyled>
        <Box display={'flex'} alignItems={'center'} gap={1}>
          <WalletTypography fontWeight={500}>
            {amount} {tokenType}
          </WalletTypography>
          {tokenType && formatterIcon(tokenType)}
        </Box>
        send to{' '}
        <Link href={`${linkOnScan}address/${destinationAddress}`} target="_blanck">
          <Box display={'flex'} alignItems={'center'} gap={1}>
            <IconDefaultAddress width="20px" height="20px" />
            <WalletTypography fontSize={14} fontWeight={300}>
              {formattedLabel(destinationAddress)}
            </WalletTypography>
          </Box>
        </Link>
      </ItemInfoStyled>

      <ItemInfoStyled>
        <WalletTypography fontWeight={500}>{theshold}</WalletTypography>
      </ItemInfoStyled>
    </ItemWrapperStyled>
  );
};
