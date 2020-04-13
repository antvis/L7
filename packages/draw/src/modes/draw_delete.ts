import { IInteractionTarget, ILngLat, Scene } from '@antv/l7';
import { Feature } from '@turf/helpers';
import { DrawEvent } from '../util/constant';
import { IDrawFeatureOption } from './draw_feature';
import DrawFeature, { IDrawOption } from './draw_mode';
export default class DrawDelete extends DrawFeature {
  // 绘制完成之后显示
  constructor(scene: Scene, options: Partial<IDrawFeatureOption> = {}) {
    super(scene, options);
  }

  public enable() {
    this.emit(DrawEvent.DELETE, '');
  }
  public disable() {
    return null;
  }
  protected getDefaultOptions(): Partial<IDrawFeatureOption> {
    return {
      ...super.getDefaultOptions(),
      title: '删除图形',
    };
  }

  protected onDragStart(e: any): void {
    throw new Error('Method not implemented.');
  }
  protected onDragging = (e: IInteractionTarget) => {
    return;
  };

  protected onDragEnd = () => {
    throw new Error('Method not implemented.');
  };
  protected onClick = () => {
    return null;
  };
}
