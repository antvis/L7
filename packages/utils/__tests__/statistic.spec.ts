import { sum } from '../src/statistics';
describe('sum', () => {
  it('sum string array', () => {
    const a = ['1', '2', '3'];
    const b = [1, 2, 3];
    // @ts-ignore
    expect(sum(a)).toEqual(6);
    expect(sum(b)).toEqual(6);
  });
});
