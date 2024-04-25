'use client';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { useEffect } from 'react';
import { ThemeProvider as ThemeProviderStyled } from 'styled-components';
import { theme } from '@gnosis.pm/safe-react-components';

import useActiveSafeAddress from '@/stores/safe-address-store';
import { WALLETCONNECT_V2_PROJECT_ID } from '@/constants/wallet-connect';

import { networks } from './networks';

const metadata = {
  name: 'Safe Lite',
  description: 'Safe UI Lite',
  url: 'https://safe-ui-lite.vercel.app/',
  icons: [
    'https://app.safe.global/favicons/mstile-150x150.png',
    'https://app.safe.global/favicons/logo_120x120.png',
  ],
};

console.log(`WALLETCONNECT_V2_PROJECT_ID:`, WALLETCONNECT_V2_PROJECT_ID);
// const modal = createWeb3Modal({
//   ethersConfig: defaultConfig({ metadata }),
//   chains: networks,
//   projectId: WALLETCONNECT_V2_PROJECT_ID,
//   themeMode: 'light',
//   allowUnsupportedChain: true,
// });

export function Web3ModalProvider({ children }: { children: React.ReactNode }) {
  const { setSafeAddress } = useActiveSafeAddress();
  const safeAddress: string | null =
    typeof window !== 'undefined' ? localStorage.getItem('safeAddress') : null;

  useEffect(() => {
    setSafeAddress(safeAddress);
  }, [safeAddress]);

  return <ThemeProviderStyled theme={theme}>{children}</ThemeProviderStyled>;
}
