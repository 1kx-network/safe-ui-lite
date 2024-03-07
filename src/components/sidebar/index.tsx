import { Box } from '@mui/system';
import { WalletTypography } from '@/ui-kit';
import WalletSvg from '@/assets/svg/wallet.svg';
import SettingSvg from '@/assets/svg/setting.svg';
import TransactionSvg from '@/assets/svg/transaction.svg';
import {
  MenuStyled,
  WrapperStyled,
  ImgUserStyled,
  InfoUserStyled,
  ItemMenuStyled,
  boxStyleInfoUser,
  WrapperIconStyled,
} from './sidebar.styles';

interface ISidebar {
  icon?: string;
  name?: string;
  id?: string;
  count?: string;
  isHidden?: boolean;
}

export const Sidebar: React.FunctionComponent<ISidebar> = ({
  icon = 'https://uxwing.com/wp-content/themes/uxwing/download/hand-gestures/good-icon.png',
  name = 'Praiseworthy gnosis',
  id = 'gno:0x0eA9ecE',
  count = '10.00',
  isHidden = false,
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
        <ItemMenuStyled
          href="/"
          style={{
            justifyContent: 'center',
            border: '2px solid #020303',
            borderRadius: '28px',
            padding: '0.719rem 0.75rem',
          }}
        >
          New transaction
        </ItemMenuStyled>
        <ItemMenuStyled href="/">
          <WrapperIconStyled>
            <WalletSvg />
          </WrapperIconStyled>{' '}
          Balance
        </ItemMenuStyled>
        <ItemMenuStyled href="/">
          <WrapperIconStyled>
            <SettingSvg />
          </WrapperIconStyled>{' '}
          Transactions
        </ItemMenuStyled>
        <ItemMenuStyled href="/">
          <WrapperIconStyled>
            <TransactionSvg />
          </WrapperIconStyled>{' '}
          Settins
        </ItemMenuStyled>
      </MenuStyled>
    </WrapperStyled>
  );
};
