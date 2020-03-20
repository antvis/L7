import { Scene } from '@antv/l7';
import { Feature, FeatureCollection } from '@turf/helpers';
import DrawSource from '../source';

export interface IDrawOption {
  data: FeatureCollection;
}

export type DrawStatus = 'Drawing' | 'Selected' | 'Edit' | 'Finish';

export default abstract class DrawFeature {
  private source: DrawSource;
  private scene: Scene;
  constructor(scene: Scene, options: IDrawOption) {
    const { data } = options;
    this.scene = scene;
    this.source = new DrawSource(data);
  }
  public enable() {
    this.scene.on('dragstart', this.onDragStart);
    this.scene.on('drag', this.onDragging);
    this.scene.on('dragend', this.onDragEnd);
    this.scene.on('click', this.onClick);
  }

  public disable() {
    this.scene.off('dragstart', this.onDragStart);
    this.scene.off('drag', this.onDragging);
    this.scene.off('dragend', this.onDragEnd);
    this.scene.off('click', this.onClick);
  }

  protected abstract onDragStart(): any;

  protected abstract onDragging(): any;

  protected abstract onDragEnd(): any;

  protected abstract onClick(): any;
}
