import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
  IRenderOptions,
  ITexture2D,
  Point,
} from '@antv/l7-core';
import { FrequencyController } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { IWindLayerStyleOptions } from '../../core/interface';
import { RasterImageTriangulation } from '../../core/triangulation';
import WindFrag from '../shaders/wind_frag.glsl';
import WindVert from '../shaders/wind_vert.glsl';
import { IWind, IWindProps, Wind } from './windRender';

const defaultRampColors = {
  0.0: '#3288bd',
  0.1: '#66c2a5',
  0.2: '#abdda4',
  0.3: '#e6f598',
  0.4: '#fee08b',
  0.5: '#fdae61',
  0.6: '#f46d43',
  1.0: '#d53e4f',
};

export default class WindModel extends BaseModel {
  protected texture: ITexture2D;
  private colorModel: IModel;
  private wind: IWind;
  private imageCoords: [Point, Point];
  private sizeScale: number = 0.5;
  // https://mapbox.github.io/webgl-wind/demo/
  // source: 'http://nomads.ncep.noaa.gov',

  private frequency = new FrequencyController(7.2);
  private cacheZoom: number;

  public render(options: Partial<IRenderOptions>) {
    this.drawColorMode(options);
    // Tip: 控制风场的平均更新频率
    this.frequency.run(() => {
      this.drawWind();
    });
  }

  public getUninforms(): IModelUniform {
    throw new Error('Method not implemented.');
  }

  public async initModels(): Promise<IModel[]> {
    const {
      uMin = -21.32,
      uMax = 26.8,
      vMin = -21.57,
      vMax = 21.42,
      fadeOpacity = 0.996,
      speedFactor = 0.25,
      dropRate = 0.003,
      dropRateBump = 0.01,
      rampColors = defaultRampColors,
      sizeScale = 0.5,
      // mask
    } = this.layer.getLayerConfig() as IWindLayerStyleOptions;
    const { createTexture2D } = this.rendererService;
    const source = this.layer.getSource();
    this.texture = createTexture2D({
      height: 0,
      width: 0,
    });
    this.cacheZoom = Math.floor(this.mapService.getZoom());

    const glContext = this.rendererService.getGLContext();
    this.imageCoords = source.data?.dataArray[0].coordinates as [Point, Point];

    source.data?.images?.then((imageData: HTMLImageElement[]) => {
      this.sizeScale = sizeScale * this.getZoomScale();

      const { imageWidth, imageHeight } = this.getWindSize();

      const options: IWindProps = {
        glContext,
        imageWidth,
        imageHeight,
        fadeOpacity,
        speedFactor,
        dropRate,
        dropRateBump,
        rampColors,
      };

      this.wind = new Wind(options);

      // imageData[0] 风场图
      this.wind.setWind({
        uMin,
        uMax,
        vMin,
        vMax,
        image: imageData[0],
      });
      this.texture?.destroy();

      this.texture = createTexture2D({
        width: imageWidth,
        height: imageHeight,
      });

      this.layerService.reRender();
    });

    const model = await this.layer.buildLayerModel({
      moduleName: 'wind',
      vertexShader: WindVert,
      fragmentShader: WindFrag,
      triangulation: RasterImageTriangulation,
      primitive: gl.TRIANGLES,
      depth: { enable: false },
    });
    this.colorModel = model;
    return [model];
  }

  public getWindSize() {
    const p1 = this.mapService.lngLatToPixel(this.imageCoords[0]);
    const p2 = this.mapService.lngLatToPixel(this.imageCoords[1]);

    const imageWidth = Math.min(
      Math.floor((p2.x - p1.x) * this.sizeScale),
      2048,
    );
    const imageHeight = Math.min(
      Math.floor((p1.y - p2.y) * this.sizeScale),
      2048,
    );
    return { imageWidth, imageHeight };
  }

  public async buildModels(): Promise<IModel[]> {
    return this.initModels();
  }

  public clearModels(): void {
    this.texture?.destroy();
    this.wind?.destroy();
  }

  protected registerBuiltinAttributes() {
    // point layer size;
    this.styleAttributeService.registerStyleAttribute({
      name: 'uv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Uv',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
        ) => {
          return [vertex[3], vertex[4]];
        },
      },
    });
  }

  private getZoomScale() {
    return Math.min(((this.cacheZoom + 4) / 30) * 2, 2);
  }

  private drawWind() {
    if (this.wind) {
      const {
        uMin = -21.32,
        uMax = 26.8,
        vMin = -21.57,
        vMax = 21.42,
        numParticles = 65535,
        fadeOpacity = 0.996,
        speedFactor = 0.25,
        dropRate = 0.003,
        dropRateBump = 0.01,
        rampColors = defaultRampColors,
        sizeScale = 0.5,
      } = this.layer.getLayerConfig() as IWindLayerStyleOptions;
      let newNumParticles = numParticles;
      const currentZoom = Math.floor(this.mapService.getZoom());
      if (
        (typeof sizeScale === 'number' && sizeScale !== this.sizeScale) ||
        currentZoom !== this.cacheZoom
      ) {
        const zoomScale = this.getZoomScale();
        this.sizeScale = sizeScale;
        newNumParticles *= zoomScale;
        const { imageWidth, imageHeight } = this.getWindSize();
        this.wind.reSize(imageWidth, imageHeight);
        this.cacheZoom = currentZoom;
      }

      this.wind.updateWindDir(uMin, uMax, vMin, vMax);

      this.wind.updateParticelNum(newNumParticles);

      this.wind.updateColorRampTexture(rampColors);

      this.wind.fadeOpacity = fadeOpacity;
      this.wind.speedFactor = speedFactor;
      this.wind.dropRate = dropRate;
      this.wind.dropRateBump = dropRateBump;

      const { d, w, h } = this.wind.draw();
      // 恢复 L7 渲染流程中 gl 状态
      this.rendererService.setBaseState();
      this.texture.update({
        data: d,
        width: w,
        height: h,
      });
    }
  }

  private drawColorMode(options: Partial<IRenderOptions> = {}) {
    const { opacity } = this.layer.getLayerConfig() as IWindLayerStyleOptions;

    this.layerService.beforeRenderData(this.layer);
    this.layer.hooks.beforeRender.call();
    this.layerService.renderMask(this.layer.masks);
    this.colorModel?.draw({
      uniforms: {
        u_opacity: opacity || 1.0,
        u_texture: this.texture,
      },
      blend: this.getBlend(),
      stencil: this.getStencil(options),
    });

    this.layer.hooks.afterRender.call();
  }
}
