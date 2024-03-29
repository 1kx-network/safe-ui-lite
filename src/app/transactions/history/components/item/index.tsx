import { WalletTypography } from '@/ui-kit';

import { WrapperStyled } from './item.styles';

interface ItemTransaction {
  id: number;
  date: string;
  amount: number | string;
  token: string;
  address: string;
  linkOnScan: string;
  theshold: number;
  owners: number;
  status?: string;
}

export const ItemTransaction = () => {
  return (
    <WrapperStyled>
      <WalletTypography>sdsf</WalletTypography>
    </WrapperStyled>
  );
};