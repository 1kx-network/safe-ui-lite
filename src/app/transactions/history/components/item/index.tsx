import Link from 'next/link';
import { Box } from '@mui/system';
import * as utils from 'ethers';

import { WalletTypography } from '@/ui-kit';
import IconDefaultAddress from '@/assets/svg/defult-icon-address.svg';
import { ITransaction } from '@/db';
import { formatterIcon } from '@/utils/icon-formatter';
import { formattedLabel } from '@/utils/formatters';

import { ItemInfoStyled, ItemWrapperStyled, IconCopyStyled } from './item.styles';
import { customToasty } from '@/components';

export const ItemTransaction = (
  data: ITransaction & { linkOnScan: string; smallType?: boolean }
) => {
  const { date, tokenType, amount, linkOnScan, destinationAddress, theshold, smallType, calldata } =
    data;

  const handleCopy = () => {
    navigator.clipboard.writeText(calldata);
    customToasty('Calldata was copy', 'success');
  };

  const calldataTitle = calldata.length > 18 ? formattedLabel(calldata, 12) : calldata;

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
            <WalletTypography fontWeight={300} fontSize={14}>
              {formattedLabel(destinationAddress)}
            </WalletTypography>
          </Box>
        </Link>
        <WalletTypography fontSize={smallType ? 14 : 16}>send </WalletTypography>
        <Box display={'flex'} alignItems={'center'} gap={1}>
          <WalletTypography fontSize={14}>
            {utils.formatEther(amount)} {tokenType}
          </WalletTypography>
          {tokenType && smallType
            ? formatterIcon(tokenType, '16px', '16px')
            : formatterIcon(tokenType)}
        </Box>
      </ItemInfoStyled>

      <ItemInfoStyled>
        <WalletTypography>{calldata ? calldataTitle : '0x'}</WalletTypography>
        <IconCopyStyled onClick={handleCopy} />
      </ItemInfoStyled>

      {!smallType && (
        <ItemInfoStyled>
          <WalletTypography>{theshold}</WalletTypography>
        </ItemInfoStyled>
      )}
    </ItemWrapperStyled>
  );
};
