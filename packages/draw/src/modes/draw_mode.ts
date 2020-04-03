import { IInteractionTarget, IPopup, Scene } from '@antv/l7';
import { Feature, FeatureCollection } from '@turf/helpers';
import { EventEmitter } from 'eventemitter3';
import { merge } from 'lodash';
import DrawSource from '../source';
import LayerStyles from '../util/layerstyle';

export interface IDrawOption {
  data: FeatureCollection;
  title: string;
  style: any;
}

export type DrawStatus =
  | 'Drawing'
  | 'DrawSelected'
  | 'DrawEdit'
  | 'DrawFinish'
  | 'EditFinish';

let DrawFeatureId = 0;

export default abstract class DrawMode extends EventEmitter {
  public source: DrawSource;
  public scene: Scene;
  public type: string;
  public title: string;
  public isEnable: boolean = false;

  protected options: {
    [key: string]: any;
  } = {
    style: LayerStyles,
  };
  protected drawStatus: DrawStatus = 'Drawing';
  protected currentFeature: Feature | null;
  protected currentVertex: Feature | null;
  protected popup: IPopup;
  constructor(scene: Scene, options: Partial<IDrawOption> = {}) {
    super();
    const { data } = options;
    this.scene = scene;
    this.source = new DrawSource(data);
    this.options = merge(this.options, this.getDefaultOptions(), options);
    this.title = this.getOption('title');
  }
  public enable() {
    if (this.isEnable) {
      return;
    }
    // @ts-ignore
    this.scene.map.dragPan.disable();
    this.scene.on('dragstart', this.onDragStart);
    this.scene.on('dragging', this.onDragging);
    this.scene.on('dragend', this.onDragEnd);
    this.scene.on('click', this.onClick);
    this.setCursor(this.getOption('cursor'));
    this.isEnable = true;
  }

  public disable() {
    if (!this.isEnable) {
      return;
    }
    this.scene.off('dragstart', this.onDragStart);
    this.scene.off('dragging', this.onDragging);
    this.scene.off('dragend', this.onDragEnd);
    this.scene.off('click', this.onClick);
    this.resetCursor();
    // @ts-ignore
    this.scene.map.dragPan.enable();
    this.isEnable = false;
  }
  public setCurrentFeature(feature: Feature) {
    this.currentFeature = feature;
    this.source.setFeatureActive(feature);
  }

  public setCurrentVertex(feature: Feature) {
    this.currentVertex = feature;
  }
  public deleteCurrentFeature() {
    throw new Error('子类未实现该方法');
  }

  public getCurrentVertex(feature: Feature) {
    return this.currentVertex;
  }
  public getCurrentFeature() {
    return this.currentVertex;
  }

  public getOption(key: string) {
    return this.options[key];
  }

  public getStyle(id: string) {
    return this.getOption('style')[id];
  }

  public getUniqId() {
    return DrawFeatureId++;
  }

  public setCursor(cursor: string) {
    const container = this.scene.getMapCanvasContainer();
    if (container) {
      container.style.cursor = cursor;
    }
  }
  public resetCursor() {
    const container = this.scene.getMapCanvasContainer();
    if (container) {
      container.removeAttribute('style');
    }
  }

  protected getDefaultOptions() {
    return {};
  }

  protected abstract onDragStart(e: IInteractionTarget): void;

  protected abstract onDragging(e: IInteractionTarget): void;

  protected abstract onDragEnd(e: IInteractionTarget): void;

  protected onClick(e: IInteractionTarget): any {
    return null;
  }
}
