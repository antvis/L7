import Source from '../src/source';
import Polygon from './data/polygon';

describe('source constructor', () => {
  it('source.constructor', () => {
    const source = new Source(Polygon);
    expect(source.extent).toEqual([
      114.24373626708983,
      30.55560910664438,
      114.32424545288086,
      30.60807236997211,
    ]);
  });
});
