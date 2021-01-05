export function common(): string {
  return 'common';
}

export function isCffNumberFormatValid(cffNumber: string) {
  return cffNumber.match(/[A-Z]\d{2}-\d{4}/) !== null;
}
