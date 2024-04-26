import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { Network, ethers } from 'ethers';
import { useEffect, useState } from 'react';

import useNetworkStore from '@/stores/networks-store';

export function useNetwork() {
  const { walletProvider } = useWeb3ModalProvider();
  const { chainId } = useWeb3ModalAccount();
  const { networks } = useNetworkStore();

  const [network, setNetwork] = useState<Network | null>(null);

  useEffect(() => {
    if (walletProvider) getNetworkInfo();
  }, [walletProvider, chainId, networks]);

  const getNetworkInfo = async () => {
    if (!walletProvider) return;
    const userProvider = new ethers.BrowserProvider(walletProvider);
    const network = await userProvider.getNetwork();

    const name = networks?.find(elem => BigInt(elem.chainId) === network.chainId)?.name || '';
    if (name !== '') {
      network.name = name;
    }

    setNetwork(network);
  };

  return network;
}
