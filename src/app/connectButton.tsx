import WalletButton from '@/ui-kit/button';
import { useWeb3Modal } from '@web3modal/ethers/react';

export default function ConnectButton() {
  // 4. Use modal hook
  const { open } = useWeb3Modal();

  return (
    <>
      <WalletButton onClick={() => open()}>Open Connect Modal</WalletButton>
    </>
  );
}
