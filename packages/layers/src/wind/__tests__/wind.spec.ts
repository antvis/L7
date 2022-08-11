import WindLayer from '../index';

describe('WindLayer', () => {
  it('WindLayer', () => {
    const layer = new WindLayer();

    expect(layer.type).toEqual('WindLayer');
  });
});
