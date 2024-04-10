'use client';
import { Box } from '@mui/system';
import { usePathname } from 'next/navigation';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { useCallback, useEffect, useState } from 'react';
import * as utils from 'ethers';
import Link from 'next/link';

import { WalletTypography } from '@/ui-kit';
import routes from '@/app/routes';
import IconOpenAccount from '@/assets/svg/arrow-r.svg';
import IconPlus from '@/assets/svg/plus.svg';
import IconLoading from '@/assets/svg/loader.svg';
import OpenInNewIcon from '@/assets/svg/open-in-new.svg';
import { CustomModal, customToasty } from '..';
import { useOwnerList } from '@/queries/safe-accounts';
import { formattedLabel } from '@/utils/foramtters';
import { formatterIcon } from '@/utils/icon-formatter';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import { networks } from '@/context/networks';
import useSafeStore from '@/stores/safe-store';
import useActiveSafeAddress from '@/stores/safe-address-store';
import { useSafeSdk } from '@/hooks/useSafeSdk';
import { safeNetworksObj } from '@/constants/networks';
import { useNetwork } from '@/hooks/useNetwork';
import { getNetworksDB } from '@/db/get-info';

import { dataUserMock, menuList } from './fixtures';
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
  CopyIconStyled,
  boxStyleInfoUserAddress,
  BodyMainInfoStyled,
  BoxAccountActionStyled,
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
  const { data } = useOwnerList(address);
  const { safeSdk, saveSdk } = useSafeStore();
  const network = useNetwork();

  const {
    safeAddress,
    balanceAccount,
    setSafeAddress,
    setBalanceAccount,
    setClearActiveSafeStore,
    isLoading,
    setIsLoading,
  } = useActiveSafeAddress();
  const { createSafe, getInfoByAccount } = useSafeSdk();

  const [isOpenAccount, setIsOpenAccount] = useState(false);
  const [linkOnScan, setLinkOnScan] = useState<string>('');

  const networkName =
    (network?.name || '').toString().charAt(0).toUpperCase() +
    (network?.name || '').toString().slice(1);

  useEffect(() => {
    if (!safeAddress) return;

    setIsLoading(true);
    setSafeAddress(safeAddress);
    createSafe(safeAddress);
  }, [safeAddress, address, chainId]);

  useEffect(() => {
    if (chainId) {
      const localList = localStorage.getItem('createdSafes');
      const localListParsed = localList ? JSON.parse(localList) : safeNetworksObj;

      const listAccount =
        data && data.length
          ? data[chainId].concat(localListParsed[chainId])
          : localListParsed[chainId];

      console.log('_1_listAccount_', listAccount, 'safeAddress', safeAddress);

      if (listAccount !== undefined) {
        setDataList(listAccount);

        const defaultAccount = listAccount[0]; // 1

        if (listAccount.some((elem: string) => elem === safeAddress)) {
          setSafeAddress(safeAddress);
        }

        if (defaultAccount) {
          localStorage.setItem('safeAddress', defaultAccount);
          setSafeAddress(defaultAccount);
        }
      }

      console.log('_need create new account with new network_');
    }
  }, [data, chainId, address]);

  useEffect(() => {
    (async () => await getNetworksDB())();

    if (!address && !chainId) {
      saveSdk(null);
      localStorage.removeItem('safeAddress');
      setClearActiveSafeStore();
    }
  }, [address, chainId, safeAddress]);

  useEffect(() => {
    if (!safeSdk || !chainId) return;

    const linkOnScan = networks.find(elem => elem.chainId === chainId)?.explorerUrl;
    if (linkOnScan) {
      setLinkOnScan(linkOnScan);
    }

    const pendingBalance = async () => {
      const dataAcc = await getInfoByAccount(safeSdk);
      if (!dataAcc) return;

      const { balanceAccount } = dataAcc;
      const parceBalance = utils.formatEther(String(balanceAccount));

      setBalanceAccount(parceBalance);
      setIsLoading(false);
    };

    pendingBalance();
  }, [safeSdk, chainId]);

  const handleClickAccount = (address: string) => {
    localStorage.setItem('safeAddress', address);
    setSafeAddress(address);
    setIsOpenAccount(false);
  };

  const handleOpenAccount = () => {
    setIsOpenAccount(!isOpenAccount);
  };

  const headerAddress = useCallback(() => {
    if (safeAddress) {
      return formattedLabel(safeAddress);
    }
    return 'Safe account';
  }, [address, safeAddress]);

  const handleCopyAddress = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (safeAddress) {
      navigator.clipboard.writeText(safeAddress);
      customToasty('Address was copy', 'success');
    }
  };

  const condMenuList = address ? menuList : [menuList[0]];

  return (
    <WrapperStyled>
      <BodyMainInfoStyled>
        <InfoUserStyled suppressHydrationWarning>
          <ImgUserStyled src={icon} alt="avatar" width={44} height={44} />

          <Box sx={boxStyleInfoUser}>
            <Box sx={boxStyleInfoUserAddress}>
              <WalletTypography fontSize={12} fontWeight={400}>
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

            {isLoading ? (
              <Box>
                <IconLoading />
              </Box>
            ) : (
              <Box height={'25px'} display={'flex'} alignItems={'center'} gap={2}>
                <WalletTypography fontSize={14} fontWeight={500}>
                  {balanceAccount} ETH
                </WalletTypography>
                {chainId && formatterIcon(chainId, '19px', '19px')}
              </Box>
            )}
          </Box>

          {address && (
            <IconOpenAccountsStyled onClick={handleOpenAccount}>
              <IconOpenAccount />
            </IconOpenAccountsStyled>
          )}
        </InfoUserStyled>
        <MenuStyled suppressHydrationWarning>
          <ItemMenuStyled style={styleBtnTransaction} href={address ? routes.newTransaction : ''}>
            <WalletTypography>New transaction</WalletTypography>
          </ItemMenuStyled>

          {condMenuList.map(item => (
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
              {headerAddress()}
            </WalletTypography>
            <WalletTypography fontSize={14} fontWeight={500}>
              {balanceAccount} ETH
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
                    <WalletTypography fontSize={12} fontWeight={300}>
                      {formattedLabel(item, 4, 4)}
                    </WalletTypography>
                  </Box>

                  <Box display={'flex'} alignItems={'center'} gap={1}>
                    {chainId && formatterIcon(chainId, '15px', '15px')}
                    <WalletTypography fontSize={12} fontWeight={300}>
                      {networkName}
                    </WalletTypography>
                  </Box>
                </ItemAccountStyled>
              ))}
            </Box>
          </Box>

          <Box display={'flex'} flexDirection={'column'} mt={5} gap={0.5}>
            <Link href={routes.safeAccountCreate}>
              <BoxAccountActionStyled>
                <IconPlus width="17px" height="17px" color={themeMuiBase.palette.success} />
                <WalletTypography fontSize={14} fontWeight={500}>
                  Add new account
                </WalletTypography>
              </BoxAccountActionStyled>
            </Link>

            <Link href={routes.safeAccountImport}>
              <BoxAccountActionStyled>
                <IconPlus width="17px" height="17px" color={themeMuiBase.palette.success} />
                <WalletTypography fontSize={14} fontWeight={500}>
                  Import new account
                </WalletTypography>
              </BoxAccountActionStyled>
            </Link>
          </Box>
        </AccountWrapperStyled>
      </CustomModal>
    </WrapperStyled>
  );
};
