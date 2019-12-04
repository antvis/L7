import Source from '../src/source';
import Point from './data/point';
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
  it('source.cluster', () => {
    const source = new Source(Point, {
      cluster: true,
      clusterOptions: {
        method: 'sum',
        field: 'mag',
      },
    });
    source.updateClusterData(2, [10, 0, 130, 75]);
  });
});
