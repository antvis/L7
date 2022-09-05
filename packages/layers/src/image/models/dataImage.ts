import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
  ITexture2D,
} from '@antv/l7-core';
import { generateColorRamp, getMask, IColorRamp, isMini } from '@antv/l7-utils';
import { isEqual } from 'lodash';
import BaseModel from '../../core/BaseModel';
import { IImageLayerStyleOptions } from '../../core/interface';
import { RasterImageTriangulation } from '../../core/triangulation';
import ImageFrag from '../shaders/dataImage_frag.glsl';
import ImageVert from '../shaders/image_vert.glsl';

export default class ImageDataModel extends BaseModel {
  protected texture: ITexture2D;
  protected colorTexture: ITexture2D;
  private rampColors: any;
  public getUninforms(): IModelUniform {
    const {
      opacity,
      clampLow = true,
      clampHigh = true,
      noDataValue = -9999999,
      domain = [0, 1],
      rampColors,

      pixelConstant = 0.0,
      pixelConstantR = 256 * 256,
      pixelConstantG = 256,
      pixelConstantB = 1,
      pixelConstantRGB = 0.1,
    } = this.layer.getLayerConfig() as IImageLayerStyleOptions;

    if (!isEqual(this.rampColors, rampColors)) {
      this.updateColorTexure();
      this.rampColors = rampColors;
    }
    return {
      u_opacity: opacity || 1,
      u_texture: this.texture,

      u_pixelConstant: pixelConstant,
      u_pixelConstantR: pixelConstantR,
      u_pixelConstantG: pixelConstantG,
      u_pixelConstantB: pixelConstantB,
      u_pixelConstantRGB: pixelConstantRGB,

      u_domain: domain,
      u_clampLow: clampLow,
      u_clampHigh: typeof clampHigh !== 'undefined' ? clampHigh : clampLow,
      u_noDataValue: noDataValue,
      u_colorTexture: this.colorTexture,
    };
  }
  public initModels(callbackModel: (models: IModel[]) => void) {
    const {
      mask = false,
      maskInside = true,
      rampColorsData,
      rampColors,
    } = this.layer.getLayerConfig() as IImageLayerStyleOptions;

    const source = this.layer.getSource();
    const { createTexture2D } = this.rendererService;
    this.texture = createTexture2D({
      height: 0,
      width: 0,
    });

    if (isMini) {
      // @ts-ignore
      const canvas = this.layerService.sceneService.getSceneConfig().canvas;
      const img = canvas.createImage();
      img.crossOrigin = 'anonymous';
      img.src = source.data.originData;

      img.onload = () => {
        this.texture = createTexture2D({
          data: img,
          width: img.width,
          height: img.height,
        });
        this.layerService.reRender();
      };
    } else {
      source.data.images.then(
        (imageData: Array<HTMLImageElement | ImageBitmap>) => {
          this.texture = createTexture2D({
            data: imageData[0],
            width: imageData[0].width,
            height: imageData[0].height,
          });
          this.layerService.reRender();
        },
      );
    }

    const rampImageData = rampColorsData
      ? rampColorsData
      : generateColorRamp(rampColors as IColorRamp);
    this.colorTexture = createTexture2D({
      data: rampImageData.data,
      width: rampImageData.width,
      height: rampImageData.height,
      flipY: false,
    });

    this.layer
      .buildLayerModel({
        moduleName: 'RasterImage',
        vertexShader: ImageVert,
        fragmentShader: ImageFrag,
        triangulation: RasterImageTriangulation,
        primitive: gl.TRIANGLES,
        depth: { enable: false },
        blend: this.getBlend(),
        stencil: getMask(mask, maskInside),
      })
      .then((model) => {
        callbackModel([model]);
      })
      .catch((err) => {
        console.warn(err);
        callbackModel([]);
      });
  }

  public clearModels(): void {
    this.texture?.destroy();
    this.colorTexture?.destroy();
  }

  public buildModels(callbackModel: (models: IModel[]) => void) {
    this.initModels(callbackModel);
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

  private updateColorTexure() {
    const { createTexture2D } = this.rendererService;
    const {
      rampColors,
    } = this.layer.getLayerConfig() as IImageLayerStyleOptions;
    const imageData = generateColorRamp(rampColors as IColorRamp);
    this.colorTexture = createTexture2D({
      data: imageData.data,
      width: imageData.width,
      height: imageData.height,
      flipY: false,
    });
  }
}
