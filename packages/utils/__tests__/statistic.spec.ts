import { max, mean, min, mode, sum } from '../src/statistics';
const a = ['1', '2', '3'];
const b = [1, 2, 3];
const c = [1, 2, 3, '1', 2, '3', 3];
describe('statistic', () => {
  it('sum', () => {
    // @ts-ignore
    expect(sum(a)).toEqual(6);
    expect(sum(b)).toEqual(6);
  });
  it('max', () => {
    // @ts-ignore
    expect(max(a)).toEqual(3);
    expect(max(b)).toEqual(3);
  });

  it('min', () => {
    // @ts-ignore
    expect(min(a)).toEqual(1);
    expect(min(b)).toEqual(1);
  });

  it('mean', () => {
    // @ts-ignore
    expect(mean(a)).toEqual(2);
    // @ts-ignore
    expect(mean(b)).toEqual(2);
  });

  it('mode', () => {
    // @ts-ignore
    expect(mode(a)).toEqual(1);
    expect(mode(c)).toEqual(2);
  });
});
