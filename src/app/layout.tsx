import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Web3ModalProvider } from '@/context/Web3Modal';

const cantedComicFont = localFont({
  src: './assets/fonts/canted_comic_bold.otf',
  weight: '700',
});

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
      <body suppressHydrationWarning={true} className={cantedComicFont.className}>
        <Web3ModalProvider>{children}</Web3ModalProvider>
      </body>
    </html>
  );
}
