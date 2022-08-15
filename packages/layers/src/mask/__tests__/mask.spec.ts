import MaskLayer from '../index';

describe('MaskLayer', () => {
  it('MaskLayer', () => {
    const layer = new MaskLayer();

    expect(layer.type).toEqual('MaskLayer');
  });
});
