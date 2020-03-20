import { ILayer } from '@antv/l7';
import DrawFeature from './draw_feature';

export default class DrawCircle extends DrawFeature {
  private center: [number, number];
  private drawCircleLayer: ILayer;
  protected onDragStart() {
    // @ts-ignore
    this.scene.map.dragdrag.disable();
  }
  protected onDragging() {
    return;
  }

  protected onDragEnd() {
    return;
  }

  protected onClick() {
    return;
  }
}
