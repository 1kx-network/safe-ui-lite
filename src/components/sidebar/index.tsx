import { Box } from '@mui/system';
import { WalletTypography } from '@/ui-kit';
import {
  MenuStyled,
  WrapperStyled,
  ImgUserStyled,
  InfoUserStyled,
  ItemMenuStyled,
  boxStyleInfoUser,
} from './sidebar.styles';

interface ISidebar {
  icon?: string;
  name: string;
  id: string;
  count: string;
}

export const Sidebar: React.FunctionComponent<ISidebar> = ({
  icon = 'https://uxwing.com/wp-content/themes/uxwing/download/hand-gestures/good-icon.png',
  name = 'Praiseworthy gnosis',
  id = 'gno:0x0eA9ecE',
  count = '10.00',
}) => {
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
        <ItemMenuStyled href="/" style={{ textAlign: 'center', border: '2px solid #020303' }}>
          New transaction
        </ItemMenuStyled>
        <ItemMenuStyled href="/">Balance</ItemMenuStyled>
        <ItemMenuStyled href="/">Transactions</ItemMenuStyled>
        <ItemMenuStyled href="/">Settins</ItemMenuStyled>
      </MenuStyled>
    </WrapperStyled>
  );
};
