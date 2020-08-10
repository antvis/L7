import json from '../../src/parser/json';
import { data1, data2 } from '../data/json';
describe('parser.json', () => {
  it('parser json x, y ', () => {
    const result = json(data1, {
      type: 'json',
      x: 'lng',
      y: 'lat',
    });
    expect(result.dataArray.length).toEqual(2);
  });
  it('parser json coordinate', () => {
    const result = json(data2, {
      type: 'json',
      coordinates: 'coord',
    });
    expect(result.dataArray.length).toEqual(2);
  });
});
