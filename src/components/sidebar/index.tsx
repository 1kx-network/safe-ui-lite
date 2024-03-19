import { Box } from '@mui/system';
import { useSearchParams } from 'next/navigation';

import { WalletTypography } from '@/ui-kit';
import WalletSvg from '@/assets/svg/wallet.svg';
import SettingSvg from '@/assets/svg/setting.svg';
import TransactionSvg from '@/assets/svg/transaction.svg';
import routes from '@/app/routes';
import { useSafeSdk } from '@/hooks/useSafeSdk';

import {
  MenuStyled,
  WrapperStyled,
  ImgUserStyled,
  InfoUserStyled,
  ItemMenuStyled,
  boxStyleInfoUser,
  WrapperIconStyled,
  styleBtnTransaction,
} from './sidebar.styles';
import { dataUserMock } from './ fixtures';

interface ISidebar {
  icon?: string;
  name?: string;
  id?: string;
  count?: string;
}

export const Sidebar: React.FunctionComponent<ISidebar> = ({
  icon = dataUserMock.icon,
  name = dataUserMock.name,
  id = dataUserMock.id,
  count = dataUserMock.count,
}) => {
  const searchParams = useSearchParams();
  const safeAddress = searchParams.get('address');
  useSafeSdk(safeAddress);
  const network = searchParams.get('network');
  return (
    <WrapperStyled>
      <InfoUserStyled>
        <ImgUserStyled src={icon} alt="avatar" width={44} height={44} />

        <Box sx={boxStyleInfoUser}>
          <WalletTypography fontSize={10}>{name}</WalletTypography>
          <WalletTypography fontSize={10}>{id}</WalletTypography>
          <WalletTypography fontSize={10}>{count} USD</WalletTypography>
        </Box>
      </InfoUserStyled>
      <MenuStyled>
        {/* TODO */}
        <ItemMenuStyled
          style={styleBtnTransaction}
          href={`${routes.newTransaction}?network=${network}&address=${encodeURIComponent(String(safeAddress))}`}
        >
          <WalletTypography>New transaction</WalletTypography>
        </ItemMenuStyled>
        <ItemMenuStyled href="/">
          <WrapperIconStyled>
            <WalletSvg />
          </WrapperIconStyled>
          <WalletTypography>Balance</WalletTypography>
        </ItemMenuStyled>
        <ItemMenuStyled href="/">
          <WrapperIconStyled>
            <SettingSvg />
          </WrapperIconStyled>
          <WalletTypography>Transactions</WalletTypography>
        </ItemMenuStyled>
        <ItemMenuStyled href="/">
          <WrapperIconStyled>
            <TransactionSvg />
          </WrapperIconStyled>
          <WalletTypography>Settings</WalletTypography>
        </ItemMenuStyled>
      </MenuStyled>
    </WrapperStyled>
  );
};
