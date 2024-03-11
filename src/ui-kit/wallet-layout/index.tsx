import * as React from 'react';
import { ThemeProvider } from '@emotion/react';

import { Sidebar } from '@/components';
import { themeMuiBase } from '@/assets/styles/theme-mui';

import { LayoutStyled } from './wallet-layout.styles';

interface IWalletLayoutProps {
  children: React.ReactNode;
  hideSidebar?: boolean;
}

export function WalletLayout({ children, hideSidebar }: IWalletLayoutProps) {
  return (
    <ThemeProvider theme={themeMuiBase}>
      <LayoutStyled>
        {!hideSidebar && <Sidebar />}
        {children}
      </LayoutStyled>
    </ThemeProvider>
  );
}
