import BaseLayer from '../../src/core/BaseLayer';
describe('BaseLayer', () => {
  const layer = new BaseLayer({
    name: 'BaseLayer',
  });

  it('init', () => {
    expect(layer.name).toEqual('BaseLayer');
  });
});
