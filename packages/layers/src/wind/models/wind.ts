import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
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

  public render() {
    // TODO: 控制风场的平均更新频率
    this.frequency.run(() => {
      this.drawWind();
    });
    this.drawColorMode();
  }

  public getUninforms(): IModelUniform {
    throw new Error('Method not implemented.');
  }

  public initModels() {
    const { createTexture2D } = this.rendererService;

    const source = this.layer.getSource();
    this.texture = createTexture2D({
      height: 0,
      width: 0,
    });

    const glContext = this.rendererService.getGLContext();
    this.imageCoords = source.data.dataArray[0].coordinates as [Point, Point];

    source.data.images.then((imageData: HTMLImageElement[]) => {
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
      } = this.layer.getLayerConfig() as IWindLayerStyleOptions;
      this.sizeScale = sizeScale;

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

      this.texture = createTexture2D({
        data: imageData[0],
        width: imageData[0].width,
        height: imageData[0].height,
      });

      this.layerService.updateLayerRenderList();
      this.layerService.renderLayers();
    });

    this.colorModel = this.layer.buildLayerModel({
      moduleName: 'WindLayer',
      vertexShader: WindVert,
      fragmentShader: WindFrag,
      triangulation: RasterImageTriangulation,
      primitive: gl.TRIANGLES,
      depth: { enable: false },
      blend: this.getBlend(),
    });

    return [this.colorModel];
  }

  public getWindSize() {
    const p1 = this.mapService.lngLatToPixel(this.imageCoords[0]);
    const p2 = this.mapService.lngLatToPixel(this.imageCoords[1]);

    const imageWidth = Math.floor((p2.x - p1.x) * this.sizeScale);
    const imageHeight = Math.floor((p1.y - p2.y) * this.sizeScale);
    return { imageWidth, imageHeight };
  }

  public buildModels() {
    return this.initModels();
  }

  public clearModels(): void {
    this.texture?.destroy();
    this.wind?.destroy();
  }

  protected getConfigSchema() {
    return {
      properties: {
        opacity: {
          type: 'number',
          minimum: 0,
          maximum: 1,
        },
      },
    };
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
          attributeIdx: number,
        ) => {
          return [vertex[3], vertex[4]];
        },
      },
    });
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
      if (typeof sizeScale === 'number' && sizeScale !== this.sizeScale) {
        this.sizeScale = sizeScale;
        const { imageWidth, imageHeight } = this.getWindSize();
        this.wind.reSize(imageWidth, imageHeight);
      }

      this.wind.updateWindDir(uMin, uMax, vMin, vMax);

      this.wind.updateParticelNum(numParticles);

      this.wind.updateColorRampTexture(rampColors);

      this.wind.fadeOpacity = fadeOpacity;
      this.wind.speedFactor = speedFactor;
      this.wind.dropRate = dropRate;
      this.wind.dropRateBump = dropRateBump;

      const { d, w, h } = this.wind.draw();
      // TODO: 恢复 L7 渲染流程中 gl 状态
      this.rendererService.setBaseState();
      this.texture.update({
        data: d,
        width: w,
        height: h,
      });
    }
  }

  private drawColorMode() {
    const { opacity } = this.layer.getLayerConfig() as IWindLayerStyleOptions;
    this.colorModel.draw({
      uniforms: {
        u_opacity: opacity || 1.0,
        u_texture: this.texture,
      },
    });
  }
}
