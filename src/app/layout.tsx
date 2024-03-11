import type { Metadata } from 'next';
import { Barlow } from 'next/font/google';

import '../assets/styles/global-styles.scss';
import { ContextProvider } from '@/context/Web3Modal';

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
      <body suppressHydrationWarning={true} className={barlow.className}>
        <ContextProvider>{children}</ContextProvider>
      </body>
    </html>
  );
}
