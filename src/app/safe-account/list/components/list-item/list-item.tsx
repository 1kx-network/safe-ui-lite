import { WalletTypography } from '@/ui-kit';

import { BodyStyled, AccountInfoStyled } from './list-item.styles';

interface IListItem {
  address: string;
  network: number;
  onClick: () => void;
}

export const ListItem = ({ address, network, onClick }: IListItem) => {
  return (
    <BodyStyled onClick={onClick}>
      <AccountInfoStyled>
        <WalletTypography>sep:{address}</WalletTypography>
      </AccountInfoStyled>
      <WalletTypography component="p">{network}</WalletTypography>
    </BodyStyled>
  );
};
