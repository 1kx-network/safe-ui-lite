'use client';
import { Box } from '@mui/system';
import { usePathname, useRouter } from 'next/navigation';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

import { WalletTypography } from '@/ui-kit';
import routes from '@/app/routes';
import IconOpenAccount from '@/assets/svg/arrow-r.svg';
import IconMenu from '@/assets/svg/menu-dots.svg';
import IconPlus from '@/assets/svg/plus.svg';
import { CustomModal } from '..';
import { useOwnerList } from '@/queries/safe-accounts';
import { formattedLabel } from '@/utils/foramtters';
import { iconNetwork } from '@/utils/icon-formatter';
import { themeMuiBase } from '@/assets/styles/theme-mui';

import { dataUserMock, menuList } from './ fixtures';
import {
  MenuStyled,
  WrapperStyled,
  ImgUserStyled,
  InfoUserStyled,
  ItemMenuStyled,
  boxStyleInfoUser,
  WrapperIconStyled,
  styleBtnTransaction,
  IconOpenAccountsStyled,
  AccountWrapperStyled,
  ItemAccountStyled,
  IconDefaultAddressStyled,
} from './sidebar.styles';

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
  const { address, chainId } = useWeb3ModalAccount();
  const [dataList, setDataList] = useState([]);
  const router = useRouter();
  const { data } = useOwnerList(address);

  const [isOpenAccount, setIsOpenAccount] = useState(false);

  useEffect(() => {
    if (chainId && data) {
      const listAccount = data[chainId];

      if (listAccount !== undefined) {
        setDataList(listAccount);
      }
    }
  }, [data, chainId]);

  const handleClickAccount = (address: string) => {
    localStorage.setItem('safeAddress', address);
    setIsOpenAccount(false);
    router.push(routes.entryPage);
  };

  const handleOpenAccount = () => {
    setIsOpenAccount(!isOpenAccount);
  };

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

        {address && (
          <IconOpenAccountsStyled onClick={handleOpenAccount}>
            <IconOpenAccount />
          </IconOpenAccountsStyled>
        )}
      </InfoUserStyled>
      <MenuStyled>
        <ItemMenuStyled
          style={styleBtnTransaction}
          disabled={!address}
          href={address ? routes.newTransaction : ''}
        >
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

      <CustomModal
        isOpen={isOpenAccount}
        closeModal={handleOpenAccount}
        modalStyles={{
          content: {
            top: '0%',
            left: '0%',
            bottom: '0',
            width: '350px',
            height: '100%',
            border: 'none',
            background: 'transparent',
          },
        }}
        styles={{
          height: '100%',
        }}
      >
        <InfoUserStyled sx={{ padding: 0 }}>
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

        <AccountWrapperStyled>
          <WalletTypography fontWeight={600}>Safe Accounts</WalletTypography>
          <Box mt={4}>
            <WalletTypography fontSize={14} fontWeight={400}>
              My accounts
            </WalletTypography>
            <Box mt={2.5}>
              {dataList.map((item, index) => (
                <ItemAccountStyled key={index} onClick={() => handleClickAccount(item)}>
                  <Box display={'flex'} alignItems={'center'} gap={1}>
                    <IconDefaultAddressStyled />
                    <WalletTypography fontSize={12} fontWeight={500}>
                      gno:
                    </WalletTypography>
                    <WalletTypography fontSize={12} fontWeight={300}>
                      {formattedLabel(item, 4, 4)}
                    </WalletTypography>
                  </Box>

                  <Box display={'flex'} alignItems={'center'} gap={1}>
                    {chainId && iconNetwork(chainId, '14px', '14px')}
                    <WalletTypography fontSize={12} fontWeight={300}>
                      Sepolia
                    </WalletTypography>
                  </Box>

                  <IconMenu />
                </ItemAccountStyled>
              ))}
            </Box>
          </Box>

          <Box display={'flex'} flex-direction={'row-reverse'} mt={2}>
            <Box display={'flex'} alignItems={'end'} gap={1}>
              <IconPlus width="17px" height="17px" color={themeMuiBase.palette.success} />
              <Link href={routes.safeAccountCreate}>
                <WalletTypography fontSize={12} fontWeight={500}>
                  Add new account
                </WalletTypography>
              </Link>
            </Box>
          </Box>
        </AccountWrapperStyled>
      </CustomModal>
    </WrapperStyled>
  );
};
