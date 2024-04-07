import type { IBounds } from '../src/geo';
import { boundsContains, padBounds } from '../src/geo';

describe('geo', () => {
  it('padBounds', () => {
    const bounds: IBounds = [
      [112, 30],
      [116, 34],
    ];
    const bounds2 = padBounds(bounds, 0.5);
    expect(bounds2).toEqual([
      [110, 28],
      [118, 36],
    ]);
  });

  it('boundContain', () => {
    const bounds: IBounds = [
      [112, 30],
      [116, 34],
    ];
    const b2: IBounds = [
      [113, 30],
      [115, 33],
    ];
    const b3: IBounds = [
      [110, 30],
      [115, 33],
    ];
    expect(boundsContains(bounds, b2)).toEqual(true);
    expect(boundsContains(bounds, b3)).toEqual(false);
  });
});
