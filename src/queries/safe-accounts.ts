import { useQuery } from '@tanstack/react-query';

import { baseURL } from '@/config';

export const useOwnerList = (account?: `0x${string}`) => {
  return useQuery({
    queryKey: ['owners-list', account],
    queryFn: () => fetch(`${baseURL}/owners/${account}/safes`).then(res => res.json()),
    enabled: Boolean(account),
  });
};
