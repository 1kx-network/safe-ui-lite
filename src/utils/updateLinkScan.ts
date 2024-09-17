export function cleanUrl(url: string): string {
  return url.replace(/api\.?|api/g, '');
}
