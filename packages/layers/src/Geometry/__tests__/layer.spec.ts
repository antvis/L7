import GeometryLayer from '../index';
describe('GeometryLayer', () => {
  const layer = new GeometryLayer({
    name: 'layer',
  });

  it('init', () => {
    expect(layer.type).toEqual('GeometryLayer');
  });
});
