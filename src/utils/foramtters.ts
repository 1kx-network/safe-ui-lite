export const formattedLabel = (label: string, start: number = 9, end: number = 7) =>
  label?.slice(0, start) + '...' + label?.slice(-end);

export const formattedName = (text: string) =>
  text
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/^\w/, c => c.toUpperCase());
