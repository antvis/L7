import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
  ITexture2D,
} from '@antv/l7-core';
import { generateColorRamp, getMask, IColorRamp } from '@antv/l7-utils';
import { isNumber } from 'lodash';
import BaseModel from '../../core/BaseModel';
import { ILineLayerStyleOptions } from '../../core/interface';
import { LineTriangulation } from '../../core/triangulation';
import linear_line_frag from '../shaders/linearLine/line_linear_frag.glsl';
import linear_line_vert from '../shaders/linearLine/line_linear_vert.glsl';

export default class LinearLineModel extends BaseModel {
  protected colorTexture: ITexture2D;
  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
      vertexHeightScale = 20.0,
      raisingHeight = 0,
      heightfixed = false,
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;

    if (this.rendererService.getDirty()) {
      this.colorTexture.bind();
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
      // 纹理支持参数
      u_texture: this.colorTexture, // 贴图

      // 是否固定高度
      u_heightfixed: Number(heightfixed),

      // 顶点高度 scale
      u_vertexScale: vertexHeightScale,
      u_raisingHeight: Number(raisingHeight),
    };
  }

  public initModels(): IModel[] {
    this.updateTexture();
    return this.buildModels();
  }

  public clearModels() {
    this.colorTexture?.destroy();
    this.dataTexture?.destroy();
  }

  public buildModels(): IModel[] {
    const {
      mask = false,
      maskInside = true,
      depth = false,
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;
    const { frag, vert, type } = this.getShaders();
    this.layer.triangulation = LineTriangulation;
    return [
      this.layer.buildLayerModel({
        moduleName: 'line_' + type,
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
      frag: linear_line_frag,
      vert: linear_line_vert,
      type: 'linear_rampColors',
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
        size: 2,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
          normal: number[],
          vertexIndex?: number,
        ) => {
          return vertexIndex === undefined
            ? [vertex[3], 10]
            : [vertex[3], vertexIndex];
        },
      },
    });
    this.styleAttributeService.registerStyleAttribute({
      name: 'total_distance',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Total_Distance',
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
          return [vertex[5]];
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
        // @ts-ignore
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

  private updateTexture = () => {
    const { createTexture2D } = this.rendererService;
    if (this.colorTexture) {
      this.colorTexture.destroy();
    }
    const {
      rampColors,
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;
    const imageData = generateColorRamp(rampColors as IColorRamp);
    this.colorTexture = createTexture2D({
      data: new Uint8Array(imageData.data),
      width: imageData.width,
      height: imageData.height,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
      min: gl.NEAREST,
      mag: gl.NEAREST,
      flipY: false,
    });
  };
}
