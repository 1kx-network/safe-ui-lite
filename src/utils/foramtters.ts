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
