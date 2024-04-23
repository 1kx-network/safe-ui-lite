import Link from 'next/link';
import { Box } from '@mui/system';

import { WalletTypography } from '@/ui-kit';
import IconDefaultAddress from '@/assets/svg/defult-icon-address.svg';
import { ITransaction } from '@/db';
import { formatterIcon } from '@/utils/icon-formatter';
import { formattedLabel } from '@/utils/foramtters';

import { ItemInfoStyled, ItemWrapperStyled } from './item.styles';

export const ItemTransaction = (
  data: ITransaction & { linkOnScan: string; smallType?: boolean }
) => {
  const { date, tokenType, amount, linkOnScan, destinationAddress, theshold, smallType } = data;

  return (
    <ItemWrapperStyled smallType={smallType}>
      <ItemInfoStyled isFirst>
        <WalletTypography fontWeight={300} fontSize={14}>
          {date}
        </WalletTypography>
      </ItemInfoStyled>

      <ItemInfoStyled smallType={smallType}>
        <Link href={`${linkOnScan}address/${destinationAddress}`} target="_blanck">
          <Box display={'flex'} alignItems={'center'} gap={1}>
            <IconDefaultAddress
              width={smallType ? '16px' : '20px'}
              height={smallType ? '16px' : '20px'}
            />
            <WalletTypography fontWeight={300} fontSize={smallType ? 14 : 14}>
              {formattedLabel(destinationAddress)}
            </WalletTypography>
          </Box>
        </Link>
        <WalletTypography fontSize={smallType ? 14 : 16}>send </WalletTypography>
        <Box display={'flex'} alignItems={'center'} gap={1}>
          <WalletTypography fontWeight={500} fontSize={14}>
            {amount} {tokenType}
          </WalletTypography>
          {tokenType && smallType
            ? formatterIcon(tokenType, '16px', '16px')
            : formatterIcon(tokenType)}
        </Box>
      </ItemInfoStyled>

      {!smallType && (
        <ItemInfoStyled>
          <WalletTypography fontWeight={500}>{theshold}</WalletTypography>
        </ItemInfoStyled>
      )}
    </ItemWrapperStyled>
  );
};
