import HeatMapLayer from '../index';
describe('HeatMapLayer', () => {
  const layer = new HeatMapLayer({
    name: 'layer',
  });

  it('init', () => {
    expect(layer.type).toEqual('HeatMapLayer');
  });
});
