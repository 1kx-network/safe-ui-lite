'use client';

import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { useRouter } from 'next/navigation';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isConnected } = useWeb3ModalAccount();
  const router = useRouter();

  switch (isConnected) {
    case false:
      router.push('/');
      return children;

    default:
      return children;
  }
}
