'use client';
import { useEffect } from 'react';
import { useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';

import { WalletLayout } from '@/ui-kit';
// import { safeNetworksObj } from '@/constants/networks';
import { CreateTransactionWidget } from '@/components/widgets/create-transaction';
import { GetStartedWidget } from '@/components/widgets/get-started';
import useActiveSafeAddress from '@/stores/safe-address-store';

import { WrapperStyled } from './home.styles';
import routes from './routes';
import AddModule from './add-module/add-module';

export default function Home() {
  const { address } = useWeb3ModalAccount();
  const { accountList } = useActiveSafeAddress();
  const { open } = useWeb3Modal();
  const { walletProvider } = useWeb3ModalProvider();

  useEffect(() => {
    const walletIsConnected: string | null =
      typeof window !== 'undefined' ? localStorage.getItem('@w3m/wallet_id') : null;
    if (walletIsConnected) return;

    open();
  }, [address, walletProvider]);

  // useEffect(() => {
  //   if (chainId && data && data.length) {
  //     const fetchedList = data[chainId];
  //     const localList = localStorage.getItem('createdSafes');
  //     const localListParsed = localList ? JSON.parse(localList) : safeNetworksObj;
  //     if (fetchedList === undefined || fetchedList.concat(localListParsed[chainId]).length === 0) {
  //       router.push(routes.safeAccountCreate);
  //     }
  //   }
  // }, [data, chainId]);

  return (
    <WalletLayout>
      <WrapperStyled>
        {address && accountList.length > 0 ? (
          <CreateTransactionWidget routes={routes} />
        ) : (
          <GetStartedWidget routes={routes} />
        )}
        <AddModule />
      </WrapperStyled>
    </WalletLayout>
  );
}
