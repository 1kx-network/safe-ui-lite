'use client';

import * as React from 'react';
import { ThemeProvider as Provider } from '@emotion/react';

import { themeMuiBase } from '@/assets/styles/theme-mui';

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider theme={themeMuiBase}>{children}</Provider>;
};

export default ThemeProvider;
