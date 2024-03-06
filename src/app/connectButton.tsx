import { WalletButton } from '@/ui-kit';
import { useWeb3Modal } from '@web3modal/ethers/react';

export default function ConnectButton() {
  const { open } = useWeb3Modal();

  return (
    <>
      <WalletButton onClick={() => open()}>Open Connect Modal</WalletButton>
    </>
  );
}
