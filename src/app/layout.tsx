import type { Metadata } from 'next';
import { Barlow } from 'next/font/google';
import '../assets/styles/global-styles.scss';
import { Toaster } from 'react-hot-toast';

import { Web3ModalProvider } from '@/context/Web3Modal';
import { ThemeProvider } from '@/context/theme-provider';
import QueryClientProvider from '@/context/query-provider';

const barlow = Barlow({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: '1kx',
  description: '1kx wallet',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={barlow.className}>
        <QueryClientProvider>
          <ThemeProvider>
            <Toaster />
            <Web3ModalProvider>{children}</Web3ModalProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
