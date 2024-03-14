export const formattedLabel = (label: string) => label?.slice(0, 9) + '...' + label?.slice(-7);

export const updateAccountsListData = (obj: Record<string, string[]>) => {
  const result: { network: number; address: string }[] = [];

  for (const [network, addresses] of Object.entries(obj)) {
    if (addresses.length > 0) {
      addresses.forEach(address => {
        result.push({ network: parseInt(network), address });
      });
    }
  }

  return result;
};
