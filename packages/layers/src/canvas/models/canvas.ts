import BaseModel from '../../core/BaseModel';
import { CanvasUpdateType, type ICanvasLayerOptions } from '../../core/interface';
import type { CanvasModelType } from './constants';
import { CanvasContextTypeMap } from './constants';

export class CanvasModel extends BaseModel {
  public canvas: HTMLCanvasElement | null = null;
  public ctx: any;
  public ctxType: string;
  public viewportSize: [number, number];

  public get layerConfig() {
    return this.layer.getLayerConfig() as ICanvasLayerOptions;
  }

  public async initModels() {
    this.renderCanvas();
    return [];
  }

  public initCanvas = () => {
    const { zIndex, getContext } = this.layerConfig;
    const canvas = document.createElement('canvas');
    const modelType = this.layer.getModelType() as CanvasModelType;
    this.canvas = canvas;
    canvas.classList.add('l7-canvas-layer');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = String(zIndex);

    this.resetCanvasSize();
    const container =
      this.mapService.getCanvasOverlays?.() ?? this.mapService.getMapCanvasContainer?.();
    container?.appendChild(canvas);
    this.ctx = getContext
      ? getContext(canvas)
      : canvas.getContext(CanvasContextTypeMap[modelType])!;
    if (!this.ctx) {
      console.error('Failed to get rendering context for canvas');
    }
    this.bindListeners();
  };

  public resetViewportSize = () => {
    const { width: viewWidth, height: viewHeight } = this.rendererService.getViewportSize();
    this.viewportSize = [viewWidth, viewHeight];
  };

  public resetCanvasSize = () => {
    const canvas = this.canvas;
    if (!canvas) {
      return;
    }
    this.resetViewportSize();
    const [width, height] = this.mapService.getSize();
    const [viewWidth, viewHeight] = this.viewportSize;
    canvas.width = viewWidth;
    canvas.height = viewHeight;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
  };

  public renderCanvas = () => {
    if (!this.canvas) {
      this.initCanvas();
    }
    const { draw, drawingOnCanvas } = this.layerConfig;
    const [width, height] = this.viewportSize;
    const bounds = this.mapService.getBounds();
    (draw ?? drawingOnCanvas)?.({
      canvas: this.canvas!,
      ctx: this.ctx,
      container: {
        width,
        height,
        bounds,
      },
      size: [width, height],
      utils: {
        lngLatToContainer: this.lngLatToContainer,
      },
      mapService: this.mapService,
    });
  };

  public removeCanvas = () => {
    if (this.canvas) {
      this.canvas.parentElement?.removeChild(this.canvas);
      this.canvas = null;
    }
    this.unbindListeners();
  };

  public onMapResize = () => {
    requestAnimationFrame(() => {
      this.resetCanvasSize();
      this.renderCanvas();
    });
  };

  public bindListeners() {
    this.mapService.on('resize', this.onMapResize);
    const { trigger, update } = this.layerConfig;
    if (update === CanvasUpdateType.ALWAYS || trigger === 'change') {
      this.mapService.on('mapchange', this.renderCanvas);
    } else {
      this.mapService.on('zoomstart', this.removeCanvas);
      this.mapService.on('zoomend', this.renderCanvas);
      this.mapService.on('movestart', this.removeCanvas);
      this.mapService.on('moveend', this.renderCanvas);
    }
  }

  public unbindListeners() {
    this.mapService.off('resize', this.onMapResize);
    this.mapService.off('mapchange', this.renderCanvas);
    this.mapService.off('zoomstart', this.removeCanvas);
    this.mapService.off('zoomend', this.renderCanvas);
    this.mapService.off('movestart', this.removeCanvas);
    this.mapService.off('moveend', this.renderCanvas);
  }

  public lngLatToContainer = (lngLat: [number, number]) => {
    const { x, y } = this.mapService.lngLatToContainer(lngLat);
    return {
      x: x * window.devicePixelRatio,
      y: y * window.devicePixelRatio,
    };
  };

  public registerBuiltinAttributes() {}
}
