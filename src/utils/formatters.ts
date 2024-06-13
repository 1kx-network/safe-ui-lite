import type { BigNumberish } from 'ethers';
import { formatUnits, parseUnits } from 'ethers';

import { ISafeNetworksObj, safeNetworksObj } from '@/constants/networks';
import { TYPE_SIGN_TRX } from '@/constants/type-sign';

import { formatAmount } from './formatNumber';

const GWEI = 'gwei';

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
  const parsedNetworkList: ISafeNetworksObj =
    (localList && JSON.parse(localList)) || safeNetworksObj;

  if (!chainId) {
    throw new Error('<-- Chain Id is undefined -->');
  }

  owners.forEach(address => {
    if (parsedNetworkList[chainId]) {
      if (parsedNetworkList[chainId][address]) {
        // Ensure that the safe is not duplicated
        if (!parsedNetworkList[chainId][address].includes(addressAccount)) {
          // If the chainId exists and the address key exists within it, push addressAccount to the array
          parsedNetworkList[chainId][address].push(addressAccount);
        }
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
        ...new Set([...((data && data[chainId]) ?? []), ...localListParsed[chainId][address]]),
      ];

      const activeAddress = listAccount.find(elem => elem === safeAddress);

      return {
        activeSafeAddress: activeAddress ?? localListParsed[chainId][address][0],
        accountList: listAccount,
      };
    } else {
      if (data && data[chainId]) {
        const activeAddress = data[chainId].find((elem: string) => elem === safeAddress);

        return {
          activeSafeAddress: activeAddress ?? data[chainId][0] ?? null,
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

export const _removeTrailingZeros = (value: string): string => {
  // Match `.000` or `.01000`
  return value.replace(/\.0+$/, '').replace(/(\..*?)0+$/, '$1');
};

/**
 * Converts value to raw, specified decimal precision
 * @param value value in unspecified unit
 * @param decimals decimals of the specified value or unit name
 * @returns value at specified decimals, i.e. 0.000000000000000001
 */
export const safeFormatUnits = (value: BigNumberish, decimals: number | string = GWEI): string => {
  try {
    const formattedAmount = formatUnits(value, decimals);

    // ethers' `formatFixed` doesn't remove trailing 0s and using `parseFloat` can return exponentials
    return _removeTrailingZeros(formattedAmount);
  } catch (err) {
    console.error('Error formatting units', err);
    return '';
  }
};

/**
 * Converts value to formatted (https://github.com/5afe/safe/wiki/How-to-format-amounts), specified decimal precision
 * @param value value in unspecified unit
 * @param decimals decimals of the specified value or unit name
 * @returns value at specified decimals, formatted, i.e. -< 0.00001
 */
export const formatVisualAmount = (
  value: BigNumberish,
  decimals: number | string = GWEI,
  precision?: number
): string => {
  return formatAmount(safeFormatUnits(value, decimals), precision);
};

export const safeParseUnits = (
  value: string,
  decimals: number | string = GWEI
): bigint | undefined => {
  try {
    return parseUnits(value, decimals);
  } catch (err) {
    console.error('Error parsing units', err);
    return;
  }
};

export const shortenAddress = (address: string, length = 4): string => {
  if (!address) {
    return '';
  }

  return `${address.slice(0, length + 2)}...${address.slice(-length)}`;
};

export const shortenText = (text: string, length = 10, separator = '...'): string => {
  return `${text.slice(0, length)}${separator}`;
};

export const dateString = (date: number) => {
  const formatterOptions: Intl.DateTimeFormatOptions = {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };
  return new Intl.DateTimeFormat(undefined, formatterOptions).format(new Date(date));
};

export const camelCaseToSpaces = (str: string): string => {
  return str.replace(/[a-z0-9](?=[A-Z])/g, str => str + ' ');
};

export const ellipsis = (str: string, length: number): string => {
  return str.length > length ? `${str.slice(0, length)}...` : str;
};

export const capitalize = (str: string): string => {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
};

// Format the error message
export const formatError = (error: Error & { reason?: string }): string => {
  let { reason } = error;
  if (!reason) return '';
  if (!reason.endsWith('.')) reason += '.';
  return ` ${capitalize(reason)}`;
};
