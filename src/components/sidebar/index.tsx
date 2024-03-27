'use client';
import { Box } from '@mui/system';
import { usePathname, useRouter } from 'next/navigation';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { useCallback, useEffect, useState } from 'react';
import * as utils from 'ethers';
import Link from 'next/link';

import { WalletTypography } from '@/ui-kit';
import routes from '@/app/routes';
import IconOpenAccount from '@/assets/svg/arrow-r.svg';
import IconPlus from '@/assets/svg/plus.svg';
import OpenInNewIcon from '@/assets/svg/open-in-new.svg';
import { CustomModal } from '..';
import { useOwnerList } from '@/queries/safe-accounts';
import { formattedLabel } from '@/utils/foramtters';
import { iconNetwork } from '@/utils/icon-formatter';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import { networks } from '@/context/networks';
import useSafeStore from '@/stores/safe-store';

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
  modalStyled,
  IconRemoveAccountStyled,
  CopyIconStyled,
  boxStyleInfoUserAddress,
  BodyMainInfoStyled,
} from './sidebar.styles';

interface ISidebar {
  icon?: string;
  name?: string;
  id?: string;
  count?: string;
}

export const Sidebar: React.FunctionComponent<ISidebar> = ({ icon = dataUserMock.icon }) => {
  const pathname = usePathname();
  const { address, chainId } = useWeb3ModalAccount();
  const [dataList, setDataList] = useState([]);
  const router = useRouter();
  const { data } = useOwnerList(address);
  const { safeSdk } = useSafeStore();

  const [isOpenAccount, setIsOpenAccount] = useState(false);
  const [safeAddress, setSafeAddress] = useState('');
  const [linkOnScan, setLinkOnScan] = useState<string>('');
  const [balanceAccount, setBalanceAccount] = useState('0');

  useEffect(() => {
    const pendingBalance = async () => {
      if (safeSdk) {
        const balanceAccount = await safeSdk.getBalance();
        const parceBalance = utils.formatEther(String(balanceAccount));

        setBalanceAccount(parceBalance);
      }
    };

    pendingBalance();

    setSafeAddress(localStorage.getItem('safeAddress') ?? '');

    if (chainId && data) {
      const linkOnScan = networks.find(elem => elem.chainId === chainId)?.explorerUrl;
      if (linkOnScan) {
        setLinkOnScan(linkOnScan);
      }

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

  const handleRemoveAccount = async (e: React.MouseEvent<HTMLElement>, address: string) => {
    e.stopPropagation();

    if (safeAddress === address) {
      router.push(routes.home);
    }

    console.log('_remove account_', address);
  };

  const headerAddress = useCallback(() => {
    if (address && safeAddress) {
      return formattedLabel(safeAddress, 4, 7);
    }
    return 'Safe account';
  }, [address, safeAddress]);

  const handleCopyAddress = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (safeAddress) navigator.clipboard.writeText(safeAddress);
  };

  return (
    <WrapperStyled>
      <BodyMainInfoStyled>
        <InfoUserStyled>
          <ImgUserStyled src={icon} alt="avatar" width={44} height={44} />

          <Box sx={boxStyleInfoUser}>
            <Box sx={boxStyleInfoUserAddress}>
              <WalletTypography fontSize={12} fontWeight={400}>
                <WalletTypography fontSize={12} fontWeight={500}>
                  gno:
                </WalletTypography>
                {headerAddress()}
              </WalletTypography>
              {safeAddress && (
                <Box display={'flex'} alignItems={'center'}>
                  <Link href={`${linkOnScan}address/${safeAddress}`} target="_blank">
                    <OpenInNewIcon width="14px" height="14px" />
                  </Link>
                  <CopyIconStyled onClick={handleCopyAddress} />
                </Box>
              )}
            </Box>

            <WalletTypography fontSize={14} fontWeight={500}>
              {balanceAccount} USD
            </WalletTypography>
          </Box>

          {address && (
            <IconOpenAccountsStyled onClick={handleOpenAccount}>
              <IconOpenAccount />
            </IconOpenAccountsStyled>
          )}
        </InfoUserStyled>
        <MenuStyled>
          <ItemMenuStyled style={styleBtnTransaction} href={address ? routes.newTransaction : ''}>
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
      </BodyMainInfoStyled>

      <CustomModal
        isOpen={isOpenAccount}
        closeModal={handleOpenAccount}
        modalStyles={modalStyled}
        widthoutPaper
      >
        <InfoUserStyled>
          <ImgUserStyled src={icon} alt="avatar" width={44} height={44} />

          <Box sx={boxStyleInfoUser}>
            <WalletTypography fontSize={12} fontWeight={400} style={{ marginBottom: 2 }}>
              <WalletTypography fontSize={12} fontWeight={500}>
                gno:
              </WalletTypography>
              {headerAddress()}
            </WalletTypography>
            <WalletTypography fontSize={14} fontWeight={500}>
              {balanceAccount} USD
            </WalletTypography>
          </Box>
        </InfoUserStyled>

        <AccountWrapperStyled>
          <WalletTypography fontWeight={600}>Safe Accounts</WalletTypography>
          <Box mt={4}>
            <WalletTypography fontSize={14} fontWeight={500}>
              My Accounts{' '}
              <WalletTypography color={themeMuiBase.palette.tetriaryGrey}>
                ({dataList.length})
              </WalletTypography>
            </WalletTypography>
            <Box mt={2.5}>
              {dataList.map((item, index) => (
                <ItemAccountStyled key={index} onClick={() => handleClickAccount(item)}>
                  <Box display={'flex'} alignItems={'center'}>
                    <IconDefaultAddressStyled width={'24px'} height={'24px'} />
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

                  <IconRemoveAccountStyled
                    onClick={(e: React.MouseEvent<HTMLElement>) => handleRemoveAccount(e, item)}
                  />
                </ItemAccountStyled>
              ))}
            </Box>
          </Box>

          <Box display={'flex'} flexDirection={'row-reverse'} mt={5}>
            <Box display={'flex'} alignItems={'end'} gap={1}>
              <IconPlus width="17px" height="17px" color={themeMuiBase.palette.success} />
              <Link href={routes.safeAccountCreate}>
                <WalletTypography fontSize={12} fontWeight={500}>
                  Add
                </WalletTypography>
              </Link>
            </Box>
          </Box>
        </AccountWrapperStyled>
      </CustomModal>
    </WrapperStyled>
  );
};
