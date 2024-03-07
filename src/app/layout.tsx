import type { Metadata } from 'next';
import { Barlow } from 'next/font/google';

const barlow = Barlow({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

import { Web3ModalProvider } from '@/context/Web3Modal';

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
      <body suppressHydrationWarning={true} className={barlow.className} style={{ margin: 0 }}>
        <Web3ModalProvider>{children}</Web3ModalProvider>
      </body>
    </html>
  );
}
