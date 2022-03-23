import { ILayerConfig, IModelUniform } from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import {
  CanvasUpdateType,
  ICanvasLayerStyleOptions,
  IDrawingOnCanvas,
} from '../../core/interface';

export default class CanvaModel extends BaseModel {
  protected updateMode: CanvasUpdateType = CanvasUpdateType.ALWAYS;
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected prevSize: [number, number];

  public renderUpdate = () => {
    const {
      zIndex = 10,
      update = CanvasUpdateType.ALWAYS,
      animateOption = { enable: false, duration: 20 },
    } = this.layer.getLayerConfig() as Partial<
      ICanvasLayerStyleOptions & ILayerConfig
    >;
    if (+this.canvas.style.zIndex === zIndex) {
      this.canvas.style.zIndex = zIndex + '';
    }
    if (this.updateMode !== update) {
      this.updateMode = update as CanvasUpdateType;
      this.unBindListener();
      this.bindListener();
    }
    if (this.updateMode === CanvasUpdateType.ALWAYS && animateOption.enable) {
      this.renderCanvas();
    }
  };

  public unBindListener = () => {
    this.mapService.off('mapchange', this.renderCanvas);
    this.mapService.off('zoomstart', this.clearCanvas);
    this.mapService.off('zoomend', this.renderCanvas);
    this.mapService.off('movestart', this.clearCanvas);
    this.mapService.off('moveend', this.renderCanvas);
  };

  public bindListener = () => {
    if (this.updateMode === CanvasUpdateType.ALWAYS) {
      this.mapService.on('mapchange', this.renderCanvas);
    } else {
      this.mapService.on('zoomstart', this.clearCanvas);
      this.mapService.on('zoomend', this.renderCanvas);
      this.mapService.on('movestart', this.clearCanvas);
      this.mapService.on('moveend', this.renderCanvas);
    }
  };

  public clearModels(): void {
    if (this.canvas) {
      document.removeChild(this.canvas);
      // @ts-ignore
      this.canvas = null;
    }
    this.unBindListener();
  }

  public initModels() {
    const {
      update = CanvasUpdateType.ALWAYS,
    } = this.layer.getLayerConfig() as ICanvasLayerStyleOptions;
    this.updateMode = update as CanvasUpdateType;
    this.initCanvas();

    this.renderCanvas();

    this.bindListener();

    this.mapService.getContainer();
    return [];
  }

  public initCanvas(): void {
    const { zIndex } = this.layer.getLayerConfig() as ICanvasLayerStyleOptions;
    const size = this.mapService.getSize();
    const [width, height] = size;
    const {
      width: viewWidth,
      height: viewHeight,
    } = this.rendererService.getViewportSize();
    this.prevSize = [viewWidth, viewHeight];

    const canvas = document.createElement('canvas');
    this.canvas = canvas;
    canvas.width = viewWidth;
    canvas.height = viewHeight;
    canvas.style.pointerEvents = 'none';
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = zIndex + '';
    this.mapService.getContainer()?.appendChild(canvas);

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.ctx = ctx;
  }

  public clearCanvas = () => {
    if (this.ctx) {
      const { width: w, height: h } = this.rendererService.getViewportSize();
      this.ctx.clearRect(0, 0, w, h);
    }
  };

  public renderCanvas = () => {
    const {
      width: viewWidth,
      height: viewHeight,
    } = this.rendererService.getViewportSize();
    if (this.prevSize[0] !== viewWidth || this.prevSize[1] !== viewHeight) {
      this.prevSize = [viewWidth, viewHeight];
      const size = this.mapService.getSize();
      const [width, height] = size;
      this.canvas.width = viewWidth;
      this.canvas.height = viewHeight;
      this.canvas.style.width = width + 'px';
      this.canvas.style.height = height + 'px';
    }

    const {
      drawingOnCanvas,
    } = this.layer.getLayerConfig() as ICanvasLayerStyleOptions;

    if (this.ctx) {
      drawingOnCanvas({
        canvas: this.canvas,
        ctx: this.ctx,
        mapService: this.mapService,
        size: [viewWidth, viewHeight],
      });
    }
  };

  public buildModels() {
    return this.initModels();
  }

  protected registerBuiltinAttributes() {
    return;
  }
}
