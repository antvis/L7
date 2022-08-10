import ImageLayer from '../index';

describe('ImageLayer', () => {
  it('ImageLayer test', () => {
    const layer = new ImageLayer();

    expect(layer.type).toEqual('ImageLayer');
  });
});
