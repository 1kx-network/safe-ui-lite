'use client';
import ConnectButton from './connectButton';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';

export default function Home() {
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  console.log({ address, chainId, isConnected });
  return (
    <main>
      <ConnectButton />
    </main>
  );
}
