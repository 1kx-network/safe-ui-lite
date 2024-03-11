import * as React from 'react';
import { ThemeProvider } from '@emotion/react';

import { Sidebar } from '@/components';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import { AuthProvider } from '@/context/AuthProvider';

import { LayoutStyled } from './wallet-layout.styles';

interface IWalletLayoutProps {
  children: React.ReactNode;
  hideSidebar?: boolean;
}

export function WalletLayout({ children, hideSidebar }: IWalletLayoutProps) {
  return (
    <AuthProvider>
      <ThemeProvider theme={themeMuiBase}>
        <LayoutStyled>
          {!hideSidebar && <Sidebar />}
          {children}
        </LayoutStyled>
      </ThemeProvider>
    </AuthProvider>
  );
}
