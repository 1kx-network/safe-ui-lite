'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider as QueryProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

const QueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  return <QueryProvider client={queryClient}>{children}</QueryProvider>;
};

export default QueryClientProvider;
