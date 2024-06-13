'use client';
import { Box } from '@mui/system';
import { usePathname } from 'next/navigation';
import { useSwitchNetwork, useWeb3ModalAccount } from '@web3modal/ethers/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { MultiValue } from 'react-select';
import * as utils from 'ethers';

import { WalletButton, WalletSelect, WalletTypography } from '@/ui-kit';
import routes from '@/app/routes';
import IconOpenAccount from '@/assets/svg/arrow-r.svg';
import IconPlus from '@/assets/svg/plus.svg';
import IconLoading from '@/assets/svg/loader.svg';
import OpenInNewIcon from '@/assets/svg/open-in-new.svg';
import { CustomModal, customToasty } from '..';
import { useOwnerList } from '@/queries/safe-accounts';
import { formattedLabel, updateAddressSafe } from '@/utils/formatters';
import { formatterIcon } from '@/utils/icon-formatter';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import { networks } from '@/context/networks';
import useSafeStore from '@/stores/safe-store';
import useActiveSafeAddress from '@/stores/safe-address-store';
import { useSafeSdk } from '@/hooks/useSafeSdk';
import { ISafeNetworksObj, safeNetworksObj } from '@/constants/networks';
import { useNetwork } from '@/hooks/useNetwork';
import { getNetworksDB } from '@/db/get-info';
import { TYPE_IMPORT } from '@/constants/types';
import { setDataDB } from '@/db/set-info';

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
  ShareAccountsListStyled,
  ShareAccountItemStyled,
  styledNetwork,
  styledBalance,
} from './sidebar.styles';
import { dataUserMock, menuList } from './fixtures';

interface ISidebar {
  icon?: string;
  name?: string;
  id?: string;
  count?: string;
}

interface IOptionShareAcc {
  id: number;
  value: string;
  label: string;
}

export const Sidebar: React.FunctionComponent<ISidebar> = ({ icon = dataUserMock.icon }) => {
  const pathname = usePathname();
  const { address, chainId } = useWeb3ModalAccount();
  const { data } = useOwnerList(address);
  const { safeSdk } = useSafeStore();
  const network = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const prevSafeAddress = useRef<string | null>(null);

  const searchParams = useMemo(() => {
    if (typeof window !== 'undefined') return new URLSearchParams(window.location.search);
    return { get: () => null };
  }, [pathname]);

  const isShareAcc = searchParams.get('import') === TYPE_IMPORT.SHARE_ACC;
  const shareAccounts = isShareAcc ? searchParams.get('accounts') : null;
  const networkParam = searchParams.get('network');

  const shareNetwork = useMemo(() => {
    try {
      if (isShareAcc && networkParam) {
        return JSON.parse(networkParam);
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  }, [networkParam, isShareAcc]);

  const {
    safeAddress,
    balanceAccount,
    setSafeAddress,
    setBalanceAccount,
    isLoading,
    setIsLoading,
    accountList,
    setAccountList,
    setContractNonce,
  } = useActiveSafeAddress();
  const { createSafe, getInfoByAccount } = useSafeSdk();

  const [isOpenAccount, setIsOpenAccount] = useState(false);
  const [linkOnScan, setLinkOnScan] = useState<string>('');
  const [isOpenShareModal, setIsOpenShareModal] = useState(false);
  const [isShareAccModal, setIsShareAccModal] = useState(Boolean(isShareAcc));
  const [optionsShareAcc, setOptionsShareAcc] = useState<IOptionShareAcc[] | []>([]);
  const [chooseOptionsShareAcc, setChooseOptionsShareAcc] = useState<IOptionShareAcc[]>([]);

  const networkName =
    (network?.name || '').toString().charAt(0).toUpperCase() +
    (network?.name || '').toString().slice(1);

  useEffect(() => {
    if (!!accountList.length) {
      const upAccountList = accountList.map(elem => ({
        id: Number(accountList.length + 1),
        value: elem,
        label: elem,
        icon: () => formatterIcon(0),
      }));

      setOptionsShareAcc(upAccountList);
    }
  }, [accountList]);

  useEffect(() => {
    const safeAddressLocalStorage = localStorage.getItem('safeAddress');

    if (!safeAddressLocalStorage && accountList.length === 0) return;
    if (safeAddressLocalStorage === prevSafeAddress.current) {
      return;
    }
    setIsLoading(true);
    prevSafeAddress.current = safeAddressLocalStorage;
    setSafeAddress(safeAddressLocalStorage ?? accountList[0]);
    createSafe(safeAddressLocalStorage ?? accountList[0]);

    setIsLoading(false);
  }, [safeAddress, accountList, address, chainId]);

  useEffect(() => {
    if (chainId && address) {
      const localList = localStorage.getItem('createdSafes');
      const localListParsed: ISafeNetworksObj = localList ? JSON.parse(localList) : safeNetworksObj;
      const safeAddressLocalStorage = localStorage.getItem('safeAddress');

      const { activeSafeAddress, accountList } = updateAddressSafe({
        localListParsed,
        chainId,
        address,
        safeAddress: safeAddressLocalStorage,
        data,
      });

      if (activeSafeAddress) {
        localStorage.setItem('safeAddress', activeSafeAddress);
        setSafeAddress(activeSafeAddress);
      }

      if (accountList.length === 0) {
        localStorage.removeItem('safeAddress');
        setSafeAddress(null);
      }

      setAccountList(accountList);

      const linkOnScan = networks.find(elem => elem.chainId === chainId)?.explorerUrl;
      if (linkOnScan) {
        setLinkOnScan(linkOnScan);
      }

      const pendingBalance = async () => {
        setIsLoading(true);
        if (!safeSdk) return;
        const dataAcc = await getInfoByAccount(safeSdk);
        if (!dataAcc) return;

        const { balanceAccount, contractNonce } = dataAcc;
        const parceBalance = utils.formatEther(String(balanceAccount));

        setContractNonce(contractNonce);
        setBalanceAccount(parceBalance);
      };

      pendingBalance();
      setTimeout(() => setIsLoading(false), 300);
    }

    setIsLoading(false);
  }, [data, chainId, address, safeSdk]);

  useEffect(() => {
    (async () => {
      await getNetworksDB();

      if (shareAccounts) {
        const accounts: string[] = JSON.parse(shareAccounts);
        await setDataDB(accounts[0], {});
      }
    })();
  }, [address, chainId, safeAddress, networks]);

  const handleClickAccount = (address: string) => {
    localStorage.setItem('safeAddress', address);
    setSafeAddress(address);
    setIsOpenAccount(false);
  };

  const handleOpenAccount = () => {
    setIsOpenAccount(!isOpenAccount);
  };

  const headerAddress = useCallback(() => {
    if (safeAddress && safeAddress !== 'null') {
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

  const condMenuList = address && accountList.length > 0 ? menuList : [menuList[0]];

  const handleChangeSelect = (elems: MultiValue<IOptionShareAcc>) => {
    setChooseOptionsShareAcc(elems as IOptionShareAcc[]);
  };

  const handleCopyShareAccount = () => {
    const networkUserInfo = networks.find(elem => elem.chainId === chainId);
    const accounts = chooseOptionsShareAcc.map(({ value }) => value);

    const host = window.location.hostname;

    const queryParams = {
      import: TYPE_IMPORT.SHARE_ACC,
      network: JSON.stringify(networkUserInfo),
      accounts: JSON.stringify(accounts),
    };

    const queryString = new URLSearchParams(queryParams).toString();

    navigator.clipboard.writeText(`${host}${routes.home}?${queryString}`);
    setChooseOptionsShareAcc([]);
    setIsOpenShareModal(false);

    customToasty('Link width account(s) was copy!', 'success');
  };

  const handleCancelShareAccount = () => {
    setIsShareAccModal(false);
    setChooseOptionsShareAcc([]);
    setIsOpenShareModal(false);
  };

  const handleSwitchNetwork = async () => {
    if (!shareNetwork) return;
    await switchNetwork(shareNetwork.chainId);
    handleCancelShareAccount();
  };

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
                  <Link href={`${linkOnScan}/address/${safeAddress}`} target="_blank">
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
                <WalletTypography fontSize={14} fontWeight={500} style={styledBalance}>
                  {safeAddress ? balanceAccount : 0}
                </WalletTypography>
                <WalletTypography fontSize={14} fontWeight={500} style={styledNetwork}>
                  {networkName}
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
          {accountList.length > 0 && (
            <>
              <ItemMenuStyled
                style={styleBtnTransaction}
                href={address ? routes.newTransactionSendToken : ''}
              >
                <WalletTypography>New transaction</WalletTypography>
              </ItemMenuStyled>
              <ItemMenuStyled style={styleBtnTransaction} href={routes.newSignTransaction}>
                <WalletTypography>Sign Transaction</WalletTypography>
              </ItemMenuStyled>
            </>
          )}

          {condMenuList.map(item => (
            <ItemMenuStyled key={item.id} href={item.url}>
              <WrapperIconStyled
                isActive={pathname === '/' ? item.url === '/' : item.url.includes(pathname)}
              >
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
                ({accountList.length})
              </WalletTypography>
            </WalletTypography>
            <Box mt={2.5}>
              {accountList.map((item, index) => (
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

            {/* <BoxAccountActionStyled onClick={() => setIsOpenShareModal(true)}>
              <IconPlus width="17px" height="17px" color={themeMuiBase.palette.success} />
              <WalletTypography fontSize={14} fontWeight={500}>
                Share your account
              </WalletTypography>
            </BoxAccountActionStyled> */}
          </Box>
        </AccountWrapperStyled>
      </CustomModal>

      <CustomModal isOpen={isOpenShareModal} closeModal={() => setIsOpenShareModal(false)}>
        <Box display="flex" flexDirection={'column'} gap={1}>
          <WalletTypography fontSize={18} fontWeight={600}>
            Share account(s)
          </WalletTypography>

          <WalletTypography fontSize={14} fontWeight={500}>
            Select one or more accounts that you want to send.
          </WalletTypography>

          <Box my={4} width={'500px'}>
            <WalletSelect options={optionsShareAcc} onChange={handleChangeSelect} isMulti />
          </Box>

          <WalletTypography fontSize={14} fontWeight={400}>
            Copy the link and send it to the user with whom you want to share your account
          </WalletTypography>

          <Box display="flex" justifyContent={'space-between'} gap={4} mt={3}>
            <WalletButton variant="outlined" onClick={handleCancelShareAccount}>
              Cancel
            </WalletButton>
            <WalletButton variant="contained" onClick={handleCopyShareAccount}>
              Copy
            </WalletButton>
          </Box>
        </Box>
      </CustomModal>

      <CustomModal isOpen={isShareAccModal} closeModal={() => setIsShareAccModal(false)}>
        <Box display="flex" flexDirection={'column'} gap={1}>
          <WalletTypography fontSize={18} fontWeight={600}>
            Was import account(s)
          </WalletTypography>
          <ShareAccountsListStyled>
            {shareAccounts &&
              JSON.parse(shareAccounts).map((elem: string) => (
                <ShareAccountItemStyled key={elem}>
                  {formatterIcon(0)} {elem}
                </ShareAccountItemStyled>
              ))}
          </ShareAccountsListStyled>

          <Box display={'flex'} justifyContent={'space-between'} gap={4}>
            <WalletButton variant="outlined" onClick={handleCancelShareAccount}>
              Close
            </WalletButton>

            <WalletButton variant="contained" onClick={handleSwitchNetwork} styles={{ gap: '4px' }}>
              Switch on {shareNetwork && formatterIcon(shareNetwork.chainId)} {shareNetwork?.value}
            </WalletButton>
          </Box>
        </Box>
      </CustomModal>
    </WrapperStyled>
  );
};
