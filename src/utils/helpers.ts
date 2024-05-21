export function invariant<T>(condition: T, error: string): asserts condition {
  if (condition) {
    return;
  }

  throw new Error(error);
}

export const isEmptyHexData = (encodedData: string): boolean =>
  encodedData !== '' && isNaN(parseInt(encodedData, 16));

export const numberToHex = (value: number) => `0x${value.toString(16)}`;

export const parseSearchParams = (params: string | null) => {
  if (!params) return null;
  return JSON.parse(params);
};
