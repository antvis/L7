import { TestScene } from '@antv/l7-test-utils';
import LayerControl from '../src/control/layerControl';

describe('layerControl', () => {
  const scene = TestScene();

  it('life cycle', () => {
    const layerControl = new LayerControl();
    scene.addControl(layerControl);

    const container = layerControl.getContainer();
    expect(container.parentElement).toBeInstanceOf(HTMLElement);

    expect(layerControl.getLayerVisible()).toEqual([]);

    scene.removeControl(layerControl);
    expect(container.parentElement).not.toBeInstanceOf(HTMLElement);
  });
});
