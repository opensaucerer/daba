export function firstCharToUpperCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function convertToSentenceCase(str: string): string {
  return str
    .split(' ')
    .map((word) => firstCharToUpperCase(word))
    .join(' ');
}

export function sortDirection(direction: string): 1 | -1 | 0 {
  return direction.toLowerCase() === 'asc'
    ? 1
    : direction.toLowerCase() === 'desc'
    ? -1
    : 0;
}
