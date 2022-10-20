import { TestScene } from '@antv/l7-test-utils';
import LayerSwitch from '../src/control/layerSwitch';

describe('layerSwitch', () => {
  const scene = TestScene();

  it('life cycle', () => {
    const layerSwitch = new LayerSwitch();
    scene.addControl(layerSwitch);

    const container = layerSwitch.getContainer();
    expect(container.parentElement).toBeInstanceOf(HTMLElement);

    expect(layerSwitch.getLayerVisible()).toEqual([]);

    scene.removeControl(layerSwitch);
    expect(container.parentElement).not.toBeInstanceOf(HTMLElement);
  });
});
