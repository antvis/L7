import BaseLayer from '../BaseLayer';
describe('BaseLayer', () => {
  const layer = new BaseLayer({
    name: 'BaseLayer',
  });

  it('init', () => {
    expect(layer.name).toEqual('BaseLayer');
  });
});
