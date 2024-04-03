import { ethers } from 'ethers';
import { EthersAdapter } from '@safe-global/protocol-kit';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';

export function useEthersAdapter() {
  const { walletProvider } = useWeb3ModalProvider();
  if (!walletProvider) return null;

  const createEthAdapter = async () => {
    const etherProvider = new ethers.BrowserProvider(walletProvider);

    const safeOwner = await etherProvider.getSigner(0);

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: safeOwner,
    });

    return await ethAdapter;
  };
  return { createEthAdapter };
}
