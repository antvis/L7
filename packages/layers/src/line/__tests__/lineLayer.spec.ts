import LineLayer from '../index';

describe('lineLayer', () => {
  it('lineLayer test', () => {
    const layer = new LineLayer();

    expect(layer.type).toEqual('LineLayer');
  });
});
