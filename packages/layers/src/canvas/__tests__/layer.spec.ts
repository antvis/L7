import CanvasLayer from '../index';
describe('CanvasLayer', () => {
  const layer = new CanvasLayer({
    name: 'layer',
  });

  it('init', () => {
    expect(layer.type).toEqual('CanvasLayer');
  });
});
