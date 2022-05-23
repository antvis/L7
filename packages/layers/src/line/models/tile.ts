import {
  AttributeType,
  gl,
  IEncodeFeature,
  ILayerConfig,
  IModel,
  IModelUniform,
  ITexture2D,
} from '@antv/l7-core';

import { getMask, rgb2arr } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { ILineLayerStyleOptions } from '../../core/interface';
import { LineTriangulation } from '../../core/triangulation';

import line_tile_frag from '../shaders/tile/line_tile_frag.glsl';
import line_tile_vert from '../shaders/tile/line_tile_vert.glsl';

export default class LineModel extends BaseModel {
  protected texture: ITexture2D;
  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
      textureBlend = 'normal',
      lineTexture = false,
      iconStep = 100,
      vertexHeightScale = 20.0,
      borderWidth = 0.0,
      borderColor = '#ccc',
      heightfixed = false,
      arrow = {
        enable: false,
        arrowWidth: 2,
        arrowHeight: 3,
        tailWidth: 1,
      },
      coord = 'lnglat',
      tileOrigin,
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;

    if (this.rendererService.getDirty()) {
      this.texture.bind();
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
      u_tileOrigin: tileOrigin || [0, 0],
      u_coord: coord === 'lnglat' ? 1.0 : 0.0,
      u_dataTexture: this.dataTexture, // 数据纹理 - 有数据映射的时候纹理中带数据，若没有任何数据映射时纹理是 [1]
      u_cellTypeLayout: this.getCellTypeLayout(),
      u_opacity: Number(opacity),
      u_textureBlend: textureBlend === 'normal' ? 0.0 : 1.0,

      // 纹理支持参数
      u_texture: this.texture, // 贴图
      u_line_texture: lineTexture ? 1.0 : 0.0, // 传入线的标识
      u_icon_step: iconStep,
      u_textSize: [1024, this.iconService.canvasHeight || 128],

      // line border 参数
      u_borderWidth: borderWidth,
      u_borderColor: rgb2arr(borderColor),

      // 是否固定高度
      u_heightfixed: Number(heightfixed),

      // 顶点高度 scale
      u_vertexScale: vertexHeightScale,

      // arrow
      u_arrow: Number(arrow.enable),
      u_arrowHeight: arrow.arrowHeight || 3,
      u_arrowWidth: arrow.arrowWidth || 2,
      u_tailWidth: arrow.tailWidth === undefined ? 1 : arrow.tailWidth,
    };
  }

  public initModels(): IModel[] {
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
      depth = false,
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;
    const { frag, vert, type } = this.getShaders();
    this.layer.triangulation = LineTriangulation;
    return [
      this.layer.buildLayerModel({
        moduleName: type,
        vertexShader: vert,
        fragmentShader: frag,
        triangulation: LineTriangulation,
        primitive: gl.TRIANGLES,
        blend: this.getBlend(),
        depth: { enable: depth },
        // depth: { enable: true },
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
      frag: line_tile_frag,
      vert: line_tile_vert,
      type: 'line_tile',
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

    this.styleAttributeService.registerStyleAttribute({
      name: 'uv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_iconMapUV',
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
          const { texture } = feature;
          const { x, y } = iconMap[texture as string] || { x: 0, y: 0 };
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
      });
      this.layer.render();
      return;
    }
    this.texture = createTexture2D({
      data: this.iconService.getCanvas(),
      mag: gl.NEAREST,
      min: gl.NEAREST,
      premultiplyAlpha: false,
      width: 1024,
      height: this.iconService.canvasHeight || 128,
    });
  };
}
