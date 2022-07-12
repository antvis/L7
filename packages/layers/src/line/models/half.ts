import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
} from '@antv/l7-core';
import { getMask, rgb2arr } from '@antv/l7-utils';
import { isNumber } from 'lodash';
import BaseModel from '../../core/BaseModel';
import { ILineLayerStyleOptions } from '../../core/interface';
import { LineTriangulation } from '../../core/triangulation';
import line_half_frag from '../shaders/half/line_half_frag.glsl';
import line_half_vert from '../shaders/half/line_half_vert.glsl';

export default class LineModel extends BaseModel {
  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
      sourceColor,
      targetColor,
      arrow = {
        enable: false,
        arrowWidth: 2,
        arrowHeight: 3,
        tailWidth: 1,
      },
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;

    // 转化渐变色
    let useLinearColor = 0; // 默认不生效
    let sourceColorArr = [0, 0, 0, 0];
    let targetColorArr = [0, 0, 0, 0];
    if (sourceColor && targetColor) {
      sourceColorArr = rgb2arr(sourceColor);
      targetColorArr = rgb2arr(targetColor);
      useLinearColor = 1;
    }

    if (this.dataTextureTest && this.dataTextureNeedUpdate({ opacity })) {
      this.judgeStyleAttributes({ opacity });
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

      // 渐变色支持参数
      u_linearColor: useLinearColor,
      u_sourceColor: sourceColorArr,
      u_targetColor: targetColorArr,

      // arrow
      u_arrow: Number(arrow.enable),
      u_arrowHeight: arrow.arrowHeight || 3,
      u_arrowWidth: arrow.arrowWidth || 2,
      u_tailWidth: arrow.tailWidth === undefined ? 1 : arrow.tailWidth,
    };
  }

  public initModels(): IModel[] {
    return this.buildModels();
  }

  public clearModels() {
    this.dataTexture?.destroy();
  }

  public buildModels(): IModel[] {
    const {
      mask = false,
      maskInside = true,
      depth = false,
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;
    const { frag, vert } = this.getShaders();
    this.layer.triangulation = LineTriangulation;
    return [
      this.layer.buildLayerModel({
        moduleName: 'line_half',
        vertexShader: vert,
        fragmentShader: frag,
        triangulation: LineTriangulation,
        primitive: gl.TRIANGLES,
        blend: this.getBlend(),
        depth: { enable: depth },
        stencil: getMask(mask, maskInside),
      }),
    ];
  }

  /**
   * 根据参数获取不同的 shader 代码
   * @returns
   */
  public getShaders(): { frag: string; vert: string; type: string } {
    return {
      frag: line_half_frag,
      vert: line_half_vert,
      type: 'normal',
    };
  }

  protected registerBuiltinAttributes() {
    this.styleAttributeService.registerStyleAttribute({
      name: 'distanceAndIndex',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_DistanceAndIndex',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 3,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
          normal: number[],
          vertexIndex?: number,
        ) => {
          return vertexIndex === undefined
            ? [vertex[3], 10, vertex[5]]
            : [vertex[3], vertexIndex, vertex[5]];
        },
      },
    });
    this.styleAttributeService.registerStyleAttribute({
      name: 'dirPoints',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_dirPoints',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 4,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          // console.log(feature)
          const startPoint = (feature.coordinates[0] || [0, 0]) as number[];
          const endPoint = (feature.coordinates[3] || [0, 0]) as number[];

          return [startPoint[0], startPoint[1], endPoint[0], endPoint[1]];
        },
      },
    });

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
        size: 2,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const { size = 1 } = feature;
          return Array.isArray(size) ? [size[0], size[1]] : [size as number, 0];
        },
      },
    });

    // point layer size;
    this.styleAttributeService.registerStyleAttribute({
      name: 'normal',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Normal',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 3,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
          normal: number[],
        ) => {
          return normal;
        },
      },
    });

    this.styleAttributeService.registerStyleAttribute({
      name: 'miter',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Miter',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.STATIC_DRAW,
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
          return [vertex[4]];
        },
      },
    });
  }
}
