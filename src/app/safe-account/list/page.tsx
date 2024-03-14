'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';

import { useOwnerList } from '@/queries/safe-accounts';
import { updateAccountsListData } from '@/utils/foramtters';
import routes from '@/app/routes';
import { WalletTypography, WalletPaper, WalletLayout, WalletButton } from '@/ui-kit';

import { ListItem } from './components/list-item/list-item';
import { HeaderStyled, MainContainerStyled } from './list.styles';

export interface IAccountData {
  network: number;
  address: string;
}

export default function SafeAccountList() {
  const [dataList, setDataList] = useState<IAccountData[]>([]);
  const router = useRouter();
  const pathName = usePathname();
  const { address } = useWeb3ModalAccount();
  const { data } = useOwnerList(address);

  useEffect(() => {
    if (data && pathName === routes.safeAccountList) {
      const listAccount = updateAccountsListData(data);
      setDataList(listAccount);
    }
  }, [data]);

  const handleCreateAccount = () => router.push(routes.safeAccountCreate);

  const handleListItemClick = (account: IAccountData) => {
    const { network, address } = account;
    const query = `?network=${network}&address=${encodeURIComponent(address)}`;
    router.push(`${routes.safeLightWallet}${query}`);
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
          {dataList.length ? (
            dataList.map((elem, index) => (
              <ListItem key={index} {...elem} onClick={() => handleListItemClick(elem)} />
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
