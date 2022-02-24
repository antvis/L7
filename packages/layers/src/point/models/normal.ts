import {
  AttributeType,
  BlendType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
} from '@antv/l7-core';
import { getMask } from '@antv/l7-utils';
import { isNumber } from 'lodash';
import BaseModel from '../../core/BaseModel';
import { IPointLayerStyleOptions } from '../../core/interface';
import normalFrag from '../shaders/normal_frag.glsl';
import normalVert from '../shaders/normal_vert.glsl';

export function PointTriangulation(feature: IEncodeFeature) {
  const coordinates = feature.coordinates as number[];
  return {
    vertices: [...coordinates],
    indices: [0],
    size: coordinates.length,
  };
}

export default class NormalModel extends BaseModel {
  public getDefaultStyle(): Partial<IPointLayerStyleOptions> {
    return {
      blend: 'additive',
    };
  }
  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
      offsets = [0, 0],
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;

    if (
      this.dataTextureTest &&
      this.dataTextureNeedUpdate({
        opacity,
        offsets,
      })
    ) {
      // 判断当前的样式中哪些是需要进行数据映射的，哪些是常量，同时计算用于构建数据纹理的一些中间变量
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
      u_opacity: isNumber(opacity) ? opacity : 1.0,
      u_offsets: this.isOffsetStatic(offsets)
        ? (offsets as [number, number])
        : [0, 0],
    };
  }

  public initModels(): IModel[] {
    return this.buildModels();
  }

  public buildModels(): IModel[] {
    const {
      mask = false,
      maskInside = true,
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;
    return [
      this.layer.buildLayerModel({
        moduleName: 'normalpoint',
        vertexShader: normalVert,
        fragmentShader: normalFrag,
        triangulation: PointTriangulation,
        depth: { enable: false },
        primitive: gl.POINTS,
        blend: this.getBlend(),
        stencil: getMask(mask, maskInside),
      }),
    ];
  }

  public clearModels() {
    this.dataTexture?.destroy();
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
          const { size = 1 } = feature;
          return Array.isArray(size) ? [size[0]] : [size as number];
        },
      },
    });
  }

  private defaultStyleOptions(): Partial<IPointLayerStyleOptions> {
    return {
      blend: BlendType.additive,
    };
  }
}
