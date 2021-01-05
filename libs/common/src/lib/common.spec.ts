import { common, isCffNumberFormatValid } from './common';

describe('isCffNumberFormatValid', () => {
  it('valid CFF format', () => {
    expect(isCffNumberFormatValid("C06-0516")).toBe(true)
    expect(isCffNumberFormatValid("E06-1234")).toBe(true)
    expect(isCffNumberFormatValid("Z00-0000")).toBe(true)
  });
  it('invalid CFF format', () => {
    expect(isCffNumberFormatValid("06-0516")).toBe(false)
    expect(isCffNumberFormatValid("E061234")).toBe(false)
    expect(isCffNumberFormatValid("Z00-000")).toBe(false)
  });
});
