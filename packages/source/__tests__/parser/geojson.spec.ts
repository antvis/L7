import geojson from '../../src/parser/geojson';
import polygon from '../data/polygon';

describe('parser.geojson', () => {
  it('parser json', () => {
    const result = geojson(polygon);
    expect(result.dataArray.length).toEqual(3);
  });
  it('parser json hash id ', () => {
    const result = geojson(polygon, {
      idField: 'name',
    });
    expect(result.dataArray.length).toEqual(3);
    if (result.featureKeys) {
      expect(Object.keys(result.featureKeys)).toEqual([
        '408534',
        '410464',
        '431974',
      ]);
    }
  });
});
