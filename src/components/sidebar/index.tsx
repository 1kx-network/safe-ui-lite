'use client';
import { Box } from '@mui/system';
import { usePathname } from 'next/navigation';

import { WalletTypography } from '@/ui-kit';
import routes from '@/app/routes';

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
import { dataUserMock, menuList } from './ fixtures';

interface ISidebar {
  icon?: string;
  name?: string;
  id?: string;
  count?: string;
}

export const Sidebar: React.FunctionComponent<ISidebar> = ({
  icon = dataUserMock.icon,
  name = dataUserMock.name,
  count = dataUserMock.count,
}) => {
  const pathname = usePathname();
  // const safeAddress = localStorage.getItem('safeAddress');

  // if (!safeSdk && safeAddress) {
  //   useSafeSdk(safeAddress);
  // }

  // useEffect(() => {
  //   console.log(safeSdk);
  //   if (!safeSdk && safeAddress) {
  //     useSafeSdk(safeAddress);
  //   }
  // }, [safeSdk]);

  return (
    <WrapperStyled>
      <InfoUserStyled>
        <ImgUserStyled src={icon} alt="avatar" width={44} height={44} />

        <Box sx={boxStyleInfoUser}>
          <WalletTypography fontSize={12} fontWeight={400}>
            <WalletTypography fontSize={12} fontWeight={500}>
              gno:
            </WalletTypography>
            {name}
          </WalletTypography>
          <WalletTypography fontSize={14} fontWeight={500}>
            {count} USD
          </WalletTypography>
        </Box>
      </InfoUserStyled>
      <MenuStyled>
        <ItemMenuStyled style={styleBtnTransaction} href={routes.newTransaction}>
          <WalletTypography>New transaction</WalletTypography>
        </ItemMenuStyled>

        {menuList.map(item => (
          <ItemMenuStyled key={item.id} href={item.url}>
            <WrapperIconStyled isActive={item.url === pathname}>
              <item.icon />
            </WrapperIconStyled>
            <WalletTypography>{item.title}</WalletTypography>
          </ItemMenuStyled>
        ))}
      </MenuStyled>
    </WrapperStyled>
  );
};
