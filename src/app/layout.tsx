import type { Metadata } from 'next';
import localFont from 'next/font/local';

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
      <body className={cantedComicFont.className}>{children}</body>
    </html>
  );
}
