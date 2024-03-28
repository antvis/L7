import { getAngle } from '../../src/utils/math';

describe('util.math', () => {
  it('should clamp angle with `getAngle()`', () => {
    expect(getAngle(30)).toBe(30);
    expect(getAngle(361)).toBe(1);
    expect(getAngle(-361)).toBe(-1);
    expect(getAngle(undefined)).toBe(0);
  });
});
