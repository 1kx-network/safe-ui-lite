import { WalletTypography } from '@/ui-kit';

import { BodyStyled, AccountInfoStyled } from './list-item.styles';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ListItem = (props: any) => {
  return (
    <BodyStyled>
      <AccountInfoStyled>
        {props.title && <WalletTypography>Test-1</WalletTypography>}
        <WalletTypography fontSize={12}>sep:{props.address}</WalletTypography>
      </AccountInfoStyled>
      <WalletTypography component="p">{props.network}</WalletTypography>
    </BodyStyled>
  );
};
