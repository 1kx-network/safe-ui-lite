import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export const WC_URI_SEARCH_PARAM = 'wc';

export function useWalletConnectSearchParamUri(): [string | null, (wcUri: string | null) => void] {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const wcUri = (searchParams.get(WC_URI_SEARCH_PARAM) || '').toString() || null;

  const setWcUri = useCallback(
    (wcUri: string | null) => {
      const current = new URLSearchParams(Array.from(searchParams.entries())); // -> has to use this form

      if (!wcUri) {
        current.delete(WC_URI_SEARCH_PARAM);
      } else {
        current.set(WC_URI_SEARCH_PARAM, wcUri);
      }

      // cast to string
      const search = current.toString();
      // or const query = `${'?'.repeat(search.length && 1)}${search}`;
      const query = search ? `?${search}` : '';

      router.push(`${pathname}${query}`);
    },
    [router]
  );

  return [wcUri, setWcUri];
}
