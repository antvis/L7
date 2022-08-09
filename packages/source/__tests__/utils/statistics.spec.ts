import * as stas from '../../src/utils/statistics';
describe('source-utils-statisics', () => {
  it('statisics.max', () => {
    expect(stas.max([4, 6, 8])).toEqual(8);
  });
  it('statisics.min', () => {
    expect(stas.min([4, 6, 8])).toEqual(4);
  });
  it('statisics.sum', () => {
    expect(stas.sum([4, 6, 8])).toEqual(18);
  });
  it('statisics.mean', () => {
    expect(stas.mean([4, 6, 8])).toEqual(6);
  });
});
