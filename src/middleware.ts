import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import routes from './app/routes';

function parseCookie(cookieHeader: string | null): Record<string, string> {
  const cookies: Record<string, string> = {};

  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      cookies[parts[0].trim()] = parts[1].trim();
    });
  }

  return cookies;
}

const PUBLIC_FILE = /\.(.*)$/;

export function middleware({ url, headers, nextUrl: { pathname } }: NextRequest) {
  const cookieHeader = headers.get('cookie');
  const cookies = parseCookie(cookieHeader);

  const hasAddressUser = cookies['addressUser'];

  if (pathname.startsWith('/_next') || pathname.includes('/api/') || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  const urlObject = new URL(url);
  // Get queries from urlObject.searchParams
  const { chainId, amount, destinationAddress } = Object.fromEntries(
    urlObject.searchParams.entries()
  );

  // Check conditions allowed for page sign-transaction or not
  const isSign =
    chainId &&
    chainId.length > 0 &&
    amount &&
    amount.length > 0 &&
    destinationAddress &&
    destinationAddress.length > 0;
  // safeTxHash &&
  // safeTxHash.length > 0;

  const notUser = !hasAddressUser || hasAddressUser.trim() === '';
  const isUser =
    hasAddressUser && hasAddressUser.trim() !== '' && pathname !== routes.signTransaction;

  // --- //
  const isSettings = pathname === routes.settings;
  const isTransactions = pathname === routes.transactions;

  if (isUser) {
    if (isSettings) {
      return NextResponse.redirect(new URL(routes.settingsOwnersList, url));
    }

    if (isTransactions) {
      return NextResponse.redirect(new URL(routes.transactionsHistory, url));
    }

    return NextResponse.next();
  }

  if (notUser) {
    if (pathname === routes.home) {
      return NextResponse.next();
    } else {
      return NextResponse.rewrite(new URL(routes.home, url));
    }
  }

  if (isSign) {
    if (pathname === routes.signTransaction) {
      return NextResponse.next();
    }
  }

  return NextResponse.rewrite(new URL(routes.home, url));
}
