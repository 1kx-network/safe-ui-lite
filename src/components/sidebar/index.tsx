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
import IconLoading from '@/assets/svg/loader.svg';
import OpenInNewIcon from '@/assets/svg/open-in-new.svg';
import { CustomModal } from '..';
import { useOwnerList } from '@/queries/safe-accounts';
import { formattedLabel } from '@/utils/foramtters';
import { iconNetwork } from '@/utils/icon-formatter';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import { networks } from '@/context/networks';
import useSafeStore from '@/stores/safe-store';
import useActiveSafeAddress from '@/stores/safe-address-store';
import { useSafeSdk } from '@/hooks/useSafeSdk';
import { safeNetworksObj } from '@/constants/networks';

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
  const { safeSdk, saveSdk } = useSafeStore();
  const {
    safeAddress,
    balanceAccount,
    setSafeAddress,
    setBalanceAccount,
    setClearActiveSafeStore,
    setSafeAccountOwners,
    setNeedConfirmOwner,
    setContractNonce,
    setContractVersion,
    isLoading,
    setIsLoading,
  } = useActiveSafeAddress();
  const { createSafe, getInfoByAccount } = useSafeSdk();

  const [isOpenAccount, setIsOpenAccount] = useState(false);
  const [linkOnScan, setLinkOnScan] = useState<string>('');

  useEffect(() => {
    if (!safeAddress) return;

    setIsLoading(true);
    createSafe(safeAddress);
  }, [safeAddress]);

  useEffect(() => {
    if (!safeSdk) return;

    const pendingBalance = async () => {
      const dataAcc = await getInfoByAccount(safeSdk);
      if (!dataAcc) return;

      const { balanceAccount, ownersAccount, contractVersion, contractNonce, accountThreshold } =
        dataAcc;
      const parceBalance = utils.formatEther(String(balanceAccount));

      setBalanceAccount(parceBalance);
      setSafeAccountOwners(ownersAccount);
      setContractNonce(contractNonce);
      setContractVersion(contractVersion);
      setNeedConfirmOwner(accountThreshold);

      setIsLoading(false);
    };

    pendingBalance();
  }, [safeSdk]);

  useEffect(() => {
    if (chainId) {
      const linkOnScan = networks.find(elem => elem.chainId === chainId)?.explorerUrl;
      if (linkOnScan) {
        setLinkOnScan(linkOnScan);
      }
    }
  }, [chainId]);

  useEffect(() => {
    if (!chainId) return;
    if (!data) return;

    const localList = localStorage.getItem('createdSafes');
    const localListParsed = localList ? JSON.parse(localList) : safeNetworksObj;
    const listAccount = data[chainId].concat(localListParsed[chainId]);

    if (listAccount !== undefined) {
      setDataList(listAccount);
      const safeAddressFromStore = localStorage.getItem('safeAddress');
      const defaultAccount = listAccount[0];

      if (safeAddressFromStore && !safeAddress) {
        setSafeAddress(safeAddressFromStore);
      }

      if (!safeAddress && !safeAddressFromStore) {
        localStorage.setItem('safeAddress', defaultAccount);
        setSafeAddress(defaultAccount);
      }
    }
  }, [data, chainId]);

  useEffect(() => {
    if (!address) {
      saveSdk(null);
      setClearActiveSafeStore();
    }
  }, [address]);

  const handleClickAccount = (address: string) => {
    localStorage.setItem('safeAddress', address);

    setSafeAddress(address);
    setIsOpenAccount(false);

    router.push(routes.walletPage);
  };

  const handleOpenAccount = () => {
    setIsOpenAccount(!isOpenAccount);
  };

  const handleRemoveAccount = async (e: React.MouseEvent<HTMLElement>, address: string) => {
    e.stopPropagation();

    // TODO - need create logic if user want remove yourself active account
    if (safeAddress === address) {
      router.push(routes.home);
    }
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

  const condMenuList = address ? menuList : [menuList[0]];

  return (
    <WrapperStyled>
      <BodyMainInfoStyled>
        <InfoUserStyled suppressHydrationWarning>
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

            {isLoading ? (
              <Box>
                <IconLoading />
              </Box>
            ) : (
              <Box height={'25px'}>
                <WalletTypography fontSize={14} fontWeight={500}>
                  {balanceAccount} ETH
                </WalletTypography>
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
              <WalletTypography fontSize={12} fontWeight={500}>
                gno:
              </WalletTypography>
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
                      Ethereum
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
