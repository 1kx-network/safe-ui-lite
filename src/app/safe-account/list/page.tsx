'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';

import { useOwnerList } from '@/queries/safe-accounts';
import routes from '@/app/routes';
import { WalletTypography, WalletPaper, WalletLayout, WalletButton } from '@/ui-kit';
import { useNetwork } from '@/hooks/useNetwork';
import { safeNetworksObj } from '@/constants/networks';

import { ListItem } from './components/list-item/list-item';
import { HeaderStyled, MainContainerStyled } from './list.styles';

export default function SafeAccountList() {
  const [dataList, setDataList] = useState([]);
  const router = useRouter();
  const pathName = usePathname();
  const { address, chainId } = useWeb3ModalAccount();
  const { data } = useOwnerList(address);

  const network = useNetwork();
  const networkName = network?.name.toString();

  useEffect(() => {
    if (chainId && data && pathName === routes.safeAccountList) {
      const fetchedList = data[chainId];
      const localList = localStorage.getItem('createdSafes');
      const localListParsed = localList ? JSON.parse(localList) : safeNetworksObj;
      if (fetchedList !== undefined) {
        setDataList(fetchedList.concat(localListParsed[chainId]));
      }
    }
  }, [data, chainId]);

  const handleCreateAccount = () => {
    if (chainId) {
      localStorage.removeItem('safeAddress');
      router.push(routes.safeAccountCreate);
    } else {
      router.push(routes.home);
    }
  };

  const handleListItemClick = (address: string) => {
    localStorage.setItem('safeAddress', address);
    router.push(routes.walletPage);
  };

  return (
    <WalletLayout hideSidebar>
      <MainContainerStyled>
        <HeaderStyled>
          <WalletTypography fontWeight={600} fontSize={22}>
            Safe accounts
          </WalletTypography>
          <WalletButton variant="contained" onClick={handleCreateAccount}>
            Create account
          </WalletButton>
        </HeaderStyled>

        <WalletPaper>
          {chainId && dataList.length ? (
            dataList.map((address, index) => (
              <ListItem
                key={index}
                address={address}
                chainId={chainId}
                network={networkName}
                onClick={() => handleListItemClick(address)}
              />
            ))
          ) : (
            <WalletTypography fontSize={17} textAlign="center">
              You dont have any Safe Account
            </WalletTypography>
          )}
        </WalletPaper>
      </MainContainerStyled>
    </WalletLayout>
  );
}
