import csv from '../../src/parser/csv';
import csvData from '../data/csv';
describe('parser.json', () => {
  it('parser json x, y ', () => {
    const result = csv(csvData, {
      type: 'json',
      x: 'lng',
      y: 'lat',
    });
    expect(result.dataArray.length).toEqual(21);
  });
});
