'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';

import { useOwnerList } from '@/queries/safe-accounts';
import routes from '@/app/routes';
import { WalletTypography, WalletPaper, WalletLayout, WalletButton } from '@/ui-kit';

import { ListItem } from './components/list-item/list-item';
import { HeaderStyled, MainContainerStyled } from './list.styles';

export default function SafeAccountList() {
  const [dataList, setDataList] = useState([]);
  const router = useRouter();
  const pathName = usePathname();
  const { address, chainId } = useWeb3ModalAccount();
  const { data } = useOwnerList(address);

  useEffect(() => {
    if (chainId && data && pathName === routes.safeAccountList) {
      const listAccount = data[chainId];

      if (listAccount !== undefined) {
        setDataList(listAccount);
      }
    }
  }, [data, chainId]);

  const handleCreateAccount = () => {
    if (chainId) {
      router.push(routes.safeAccountCreate);
    } else {
      router.push(routes.home);
    }
  };

  const handleListItemClick = (address: string) => {
    const query = `?network=${chainId}&address=${encodeURIComponent(address)}`;
    router.push(`${routes.entryPage}${query}`);
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
                network={chainId}
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
