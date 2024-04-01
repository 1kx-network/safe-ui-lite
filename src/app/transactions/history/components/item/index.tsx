import Link from 'next/link';

import { WalletTypography } from '@/ui-kit';
import IconDefaultAddress from '@/assets/svg/defult-icon-address.svg';

import { ItemInfoStyled, ItemWrapperStyled } from './item.styles';

interface IItemTransaction {
  id: number;
  date: string;
  amount: number | string;
  token: string;
  address: string;
  theshold: number;
  linkOnScan: string;
  status?: string;
  owners: string[];
  // status?: string;
}

export const ItemTransaction = (data: IItemTransaction) => {
  return (
    <ItemWrapperStyled>
      <ItemInfoStyled isFirst>
        <WalletTypography fontWeight={500}>{data.date}</WalletTypography>
      </ItemInfoStyled>

      <ItemInfoStyled>
        <WalletTypography fontWeight={500}>
          {data.amount} {data.token}
        </WalletTypography>{' '}
        send to{' '}
        <Link href={`${data.linkOnScan}address/${data.address}`}>
          <IconDefaultAddress width="20px" height="20px" />
        </Link>
      </ItemInfoStyled>

      <ItemInfoStyled>
        <WalletTypography fontWeight={500}>
          {data.theshold} out of {data.owners.length}
        </WalletTypography>
      </ItemInfoStyled>
    </ItemWrapperStyled>
  );
};
