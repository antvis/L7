import CanvasLayer from '../../src/canvas/index';
describe('CanvasLayer', () => {
  const layer = new CanvasLayer({
    name: 'layer',
  });

  it('init', () => {
    expect(layer.type).toEqual('CanvasLayer');
  });
});
