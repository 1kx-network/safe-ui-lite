'use client';

import { ReactNode } from 'react';
import { ThemeProvider as Provider } from '@emotion/react';

import { themeMuiBase } from '@/assets/styles/theme-mui';

export const ThemeProvider = ({ children }: { children: ReactNode | ReactNode[] }) => {
  return <Provider theme={themeMuiBase}>{children}</Provider>;
};

export default ThemeProvider;
