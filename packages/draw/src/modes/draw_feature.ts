import { IInteractionTarget, Scene } from '@antv/l7';
import { Feature, FeatureCollection } from '@turf/helpers';
import { merge, throttle } from 'lodash';
import DrawSource from '../source';
import LayerStyles from '../util/layerstyle';

export interface IDrawOption {
  data: FeatureCollection;
  style: any;
}

export type DrawStatus =
  | 'Drawing'
  | 'DrawSelected'
  | 'DrawEdit'
  | 'DrawFinish'
  | 'EditFinish';

export default abstract class DrawFeature {
  protected source: DrawSource;
  protected scene: Scene;
  protected options: {
    [key: string]: any;
  } = {
    style: LayerStyles,
  };
  protected drawStatus: DrawStatus = 'Drawing';
  private isEnable: boolean = false;
  constructor(scene: Scene, options: Partial<IDrawOption> = {}) {
    const { data } = options;
    this.scene = scene;
    this.source = new DrawSource(data);
    this.options = merge(this.options, this.getDefaultOptions(), options);
  }
  public enable() {
    if (this.isEnable) {
      return;
    }
    this.scene.on('dragstart', this.onDragStart);
    this.scene.on('dragging', this.onDragging);
    this.scene.on('dragend', this.onDragEnd);
    // this.scene.on('click', this.onClick);
    this.setCursor('crosshair');
  }

  public disable() {
    this.scene.off('dragstart', this.onDragStart);
    this.scene.off('dragging', this.onDragging);
    this.scene.off('dragend', this.onDragEnd);
    // this.scene.off('click', this.onClick);
    this.resetCursor();
  }
  protected getDefaultOptions() {
    return {};
  }

  protected abstract onDragStart(e: IInteractionTarget): void;

  protected abstract onDragging(e: IInteractionTarget): void;

  protected abstract onDragEnd(e: IInteractionTarget): void;

  protected abstract onClick(): void;
  protected getOption(key: string) {
    return this.options[key];
  }
  protected getStyle(id: string) {
    return this.getOption('style')[id];
  }

  protected setCursor(cursor: string) {
    const container = this.scene.getContainer();
    if (container) {
      container.style.cursor = cursor;
    }
  }
  protected resetCursor() {
    const container = this.scene.getContainer();
    if (container) {
      container.style.cursor = 'default';
    }
  }
}
