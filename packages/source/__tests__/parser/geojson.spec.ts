import geojson from '../../src/parser/geojson';
import multiLine from '../data/multiLine';
import multiPolygon from '../data/multipolygon';
import polygon from '../data/polygon';
describe('parser.geojson', () => {
  it('parser json', () => {
    const result = geojson(polygon);
    expect(result.dataArray.length).toEqual(3);
  });
  it('parser multiPolygon', () => {
    const result = geojson(multiPolygon);
    expect(result.dataArray.length).toEqual(1);
    expect(result.dataArray[0]._id).toEqual(0);
  });
  it('parset multiLine', () => {
    const result = geojson(multiLine);
    expect(result.dataArray.length).toEqual(2);
  });
});
