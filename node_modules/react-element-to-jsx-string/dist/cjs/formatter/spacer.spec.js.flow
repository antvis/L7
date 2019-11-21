/* @flow */

import spacer from './spacer';

describe('spacer', () => {
  it('should generate a spaced string', () => {
    expect(spacer(0, 1)).toEqual('');
    expect(spacer(0, 2)).toEqual('');
    expect(spacer(0, 3)).toEqual('');

    expect(spacer(1, 1)).toEqual(' ');
    expect(spacer(1, 2)).toEqual('  ');
    expect(spacer(1, 3)).toEqual('   ');

    expect(spacer(2, 1)).toEqual('  ');
    expect(spacer(2, 2)).toEqual('    ');
    expect(spacer(2, 3)).toEqual('      ');
  });
});
