import BaseModel from '../../core/BaseModel';
import type { ICanvasLayer2Options } from '../../core/interface';
import type CanvasLayer2 from '../index';
import { CanvasContextTypeMap } from './constants';

export class CanvasModel extends BaseModel {
  protected canvas: HTMLCanvasElement;
  protected ctx: RenderingContext;
  protected ctxType: string;
  protected prevSize: [number, number];

  constructor(layer: CanvasLayer2) {
    super(layer);

    const modelType = layer.getModelType();
    this.ctxType = CanvasContextTypeMap[modelType];
  }

  public async initModels() {
    this.initCanvas();
    this.renderCanvas();
    this.bindListeners();
    return [];
  }

  public initCanvas() {
    const { zIndex } = this.layer.getLayerConfig() as ICanvasLayer2Options;
    const canvas = document.createElement('canvas');
    this.canvas = canvas;
    canvas.classList.add('l7-canvas-layer');
    canvas.style.pointerEvents = 'none';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = String(zIndex);
    this.resetCanvasSize();
    this.mapService.getContainer()?.appendChild(canvas);
    this.ctx = canvas.getContext(this.ctxType)!;
    this.mapService.on('resize', this.resetCanvasSize.bind(this));
    if (!this.ctx) {
      console.error('Failed to get rendering context for canvas');
    }
  }

  public resetCanvasSize() {
    const canvas = this.canvas;
    const [width, height] = this.mapService.getSize();
    const { width: viewWidth, height: viewHeight } =
      this.rendererService.getViewportSize();
    this.prevSize = [viewWidth, viewHeight];
    canvas.width = viewWidth;
    canvas.height = viewHeight;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
  }

  public renderCanvas() {}

  public bindListeners() {}

  public unbindListeners() {}

  public registerBuiltinAttributes() {}
}
