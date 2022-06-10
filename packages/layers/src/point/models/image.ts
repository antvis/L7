import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
  ITexture2D,
} from '@antv/l7-core';
import { getMask } from '@antv/l7-utils';
import { isNumber } from 'lodash';
import BaseModel from '../../core/BaseModel';
import { IPointLayerStyleOptions } from '../../core/interface';
import { PointImageTriangulation } from '../../core/triangulation';
import pointImageFrag from '../shaders/image_frag.glsl';
import pointImageVert from '../shaders/image_vert.glsl';
export default class ImageModel extends BaseModel {
  private texture: ITexture2D;

  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
      offsets = [0, 0],
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;
    if (this.rendererService.getDirty()) {
      this.texture.bind();
    }

    if (
      this.dataTextureTest &&
      this.dataTextureNeedUpdate({
        opacity,
        offsets,
      })
    ) {
      this.judgeStyleAttributes({
        opacity,
        offsets,
      });
      const encodeData = this.layer.getEncodedData();
      const { data, width, height } = this.calDataFrame(
        this.cellLength,
        encodeData,
        this.cellProperties,
      );
      this.rowCount = height; // 当前数据纹理有多少行

      this.dataTexture =
        this.cellLength > 0 && data.length > 0
          ? this.createTexture2D({
              flipY: true,
              data,
              format: gl.LUMINANCE,
              type: gl.FLOAT,
              width,
              height,
            })
          : this.createTexture2D({
              flipY: true,
              data: [1],
              format: gl.LUMINANCE,
              type: gl.FLOAT,
              width: 1,
              height: 1,
            });
    }
    return {
      u_dataTexture: this.dataTexture, // 数据纹理 - 有数据映射的时候纹理中带数据，若没有任何数据映射时纹理是 [1]
      u_cellTypeLayout: this.getCellTypeLayout(),

      u_texture: this.texture,
      u_textSize: [1024, this.iconService.canvasHeight || 128],
      u_opacity: isNumber(opacity) ? opacity : 1.0,
      u_offsets: this.isOffsetStatic(offsets)
        ? (offsets as [number, number])
        : [0, 0],
    };
  }

  public initModels(): IModel[] {
    this.registerBuiltinAttributes();
    this.updateTexture();
    this.iconService.on('imageUpdate', this.updateTexture);
    return this.buildModels();
  }

  public clearModels() {
    this.texture?.destroy();
    this.dataTexture?.destroy();
    this.iconService.off('imageUpdate', this.updateTexture);
  }

  public buildModels(): IModel[] {
    const {
      mask = false,
      maskInside = true,
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;
    return [
      this.layer.buildLayerModel({
        moduleName: 'pointImage',
        vertexShader: pointImageVert,
        fragmentShader: pointImageFrag,
        triangulation: PointImageTriangulation,
        primitive: gl.POINTS,
        depth: { enable: false },
        blend: this.getBlend(),
        stencil: getMask(mask, maskInside),
      }),
    ];
  }
  protected registerBuiltinAttributes() {
    // point layer size;
    this.styleAttributeService.registerStyleAttribute({
      name: 'size',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Size',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const { size = 5 } = feature;
          return Array.isArray(size) ? [size[0]] : [size as number];
        },
      },
    });

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
          const iconMap = this.iconService.getIconMap();
          const { shape } = feature;
          const { x, y } = iconMap[shape as string] || { x: 0, y: 0 };
          return [x, y];
        },
      },
    });
  }

  private updateTexture = () => {
    const { createTexture2D } = this.rendererService;
    if (this.texture) {
      this.texture.update({
        data: this.iconService.getCanvas(),
        mag: 'linear',
        min: 'linear mipmap nearest',
        mipmap: true,
      });
      // TODO: 更新完纹理后在更新的图层的时候需要更新所有的图层
      this.layer.renderLayers();
      return;
    }
    this.texture = createTexture2D({
      data: this.iconService.getCanvas(),
      mag: gl.LINEAR,
      min: gl.LINEAR_MIPMAP_LINEAR,
      premultiplyAlpha: false,
      width: 1024,
      height: this.iconService.canvasHeight || 128,
      mipmap: true,
    });
  };
}
