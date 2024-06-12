import { ISafeNetworksObj, safeNetworksObj } from '@/constants/networks';
import { TYPE_SIGN_TRX } from '@/constants/type-sign';

export const formattedLabel = (label: string, start: number = 9, end: number = 7) =>
  label?.slice(0, start) + '...' + label?.slice(-end);

export const formattedName = (text: string) => {
  const txt = TYPE_SIGN_TRX.TR_BUILD === text ? 'TRANSACTION_BUILDER' : text;

  return txt
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/^\w/, c => c.toUpperCase());
};

export function updateSafeAccounts(
  chainId: number | string,
  owners: string[],
  addressAccount: string,
  localList: string | null
) {
  console.log(localList);

  const parsedNetworkList: ISafeNetworksObj =
    (localList && JSON.parse(localList)) || safeNetworksObj;

  if (!chainId) {
    throw new Error('<-- Chain Id is undefined -->');
  }

  owners.forEach(address => {
    if (parsedNetworkList[chainId]) {
      if (parsedNetworkList[chainId][address]) {
        // If the chainId exists and the address key exists within it, push addressAccount to the array
        parsedNetworkList[chainId][address].push(addressAccount);
      } else {
        // If the chainId exists but the address key does not, create a new address key and add an array containing addressAccount
        parsedNetworkList[chainId][address] = [addressAccount];
      }
    } else {
      // If the chainId does not exist, create a new object with the chainId key and a nested object containing the address key and an array with addressAccount
      parsedNetworkList[chainId] = {
        [address]: [addressAccount],
      };
    }
  });

  // Update the local storage
  localStorage.setItem('createdSafes', JSON.stringify(parsedNetworkList));
  localStorage.setItem('safeAddress', addressAccount);
}

interface IupdateAddressSafe {
  localListParsed: ISafeNetworksObj;
  chainId: number;
  address: string;
  safeAddress: string | null;
  data: any;
}

export const updateAddressSafe = ({
  localListParsed,
  chainId,
  address,
  safeAddress,
  data,
}: IupdateAddressSafe) => {
  if (localListParsed[chainId]) {
    if (localListParsed[chainId][address]) {
      const listAccount = [
        ...((data && data[chainId]) ?? []),
        ...localListParsed[chainId][address],
      ];

      const activeAddress = listAccount.find(elem => elem === safeAddress);

      return {
        activeSafeAddress: activeAddress ?? localListParsed[chainId][address][0],
        accountList: listAccount,
      };
    } else {
      if (data && data[chainId]) {
        const activeAddress = data[chainId].find((elem: string) => elem === safeAddress);
        console.log('___1___', safeAddress, activeAddress);
        console.log('___2___', { activeSafeAddress: activeAddress ?? data[chainId][0] });

        return {
          activeSafeAddress: activeAddress ?? data[chainId][0],
          accountList: data[chainId],
        };
      }
      return { activeSafeAddress: null, accountList: [] };
    }
  } else {
    return { activeSafeAddress: null, accountList: [] };
  }
};

export const importSafeAccount = () => {};
