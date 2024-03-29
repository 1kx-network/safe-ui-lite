export const formattedLabel = (label: string, start: number = 9, end: number = 7) =>
  label?.slice(0, start) + '...' + label?.slice(-end);
