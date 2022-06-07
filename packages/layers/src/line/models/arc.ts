import {
  AttributeType,
  gl,
  IAnimateOption,
  IEncodeFeature,
  ILayerConfig,
  IModel,
  IModelUniform,
  ITexture2D,
} from '@antv/l7-core';
import { getMask, rgb2arr } from '@antv/l7-utils';
import { isNumber } from 'lodash';
import BaseModel from '../../core/BaseModel';
import { ILineLayerStyleOptions } from '../../core/interface';
import { LineArcTriangulation } from '../../core/triangulation';
// arc dash line
import arc_dash_frag from '../shaders/dash/arc_dash_frag.glsl';
import arc_dash_vert from '../shaders/dash/arc_dash_vert.glsl';
// arc normal line
import arc_line_frag from '../shaders/line_arc_frag.glsl';
import arc_line_vert from '../shaders/line_arc_vert.glsl';
// arc linear line
import arc_linear_frag from '../shaders/linear/arc_linear_frag.glsl';
import arc_linear_vert from '../shaders/linear/arc_linear_vert.glsl';
const lineStyleObj: { [key: string]: number } = {
  solid: 0.0,
  dash: 1.0,
};
export default class ArcModel extends BaseModel {
  protected texture: ITexture2D;
  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
      sourceColor,
      targetColor,
      textureBlend = 'normal',
      lineType = 'solid',
      dashArray = [10, 5],
      forward = true,
      lineTexture = false,
      iconStep = 100,
      segmentNumber = 30,
      thetaOffset = 0.314,
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;

    if (
      this.dataTextureTest &&
      this.dataTextureNeedUpdate({ opacity, thetaOffset })
    ) {
      this.judgeStyleAttributes({ opacity, thetaOffset });
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

    if (dashArray.length === 2) {
      dashArray.push(0, 0);
    }

    // 转化渐变色
    let useLinearColor = 0; // 默认不生效
    let sourceColorArr = [0, 0, 0, 0];
    let targetColorArr = [0, 0, 0, 0];
    if (sourceColor && targetColor) {
      sourceColorArr = rgb2arr(sourceColor);
      targetColorArr = rgb2arr(targetColor);
      useLinearColor = 1;
    }

    if (this.rendererService.getDirty()) {
      this.texture.bind();
    }

    return {
      u_dataTexture: this.dataTexture, // 数据纹理 - 有数据映射的时候纹理中带数据，若没有任何数据映射时纹理是 [1]
      u_cellTypeLayout: this.getCellTypeLayout(),

      u_thetaOffset: isNumber(thetaOffset) ? thetaOffset : 0.0,
      u_opacity: isNumber(opacity) ? opacity : 1.0,
      u_textureBlend: textureBlend === 'normal' ? 0.0 : 1.0,
      segmentNumber,
      u_line_type: lineStyleObj[lineType || 'solid'],
      u_dash_array: dashArray,
      u_blur: 0.9,
      u_lineDir: forward ? 1 : -1,

      // 纹理支持参数
      u_texture: this.texture, // 贴图
      u_line_texture: lineTexture ? 1.0 : 0.0, // 传入线的标识
      u_icon_step: iconStep,
      u_textSize: [1024, this.iconService.canvasHeight || 128],

      // 渐变色支持参数
      u_linearColor: useLinearColor,
      u_sourceColor: sourceColorArr,
      u_targetColor: targetColorArr,
    };
  }

  public getAnimateUniforms(): IModelUniform {
    const { animateOption } = this.layer.getLayerConfig() as ILayerConfig;
    return {
      u_aimate: this.animateOption2Array(animateOption as IAnimateOption),
      u_time: this.layer.getLayerAnimateTime(),
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

  public getShaders(): { frag: string; vert: string; type: string } {
    const {
      sourceColor,
      targetColor,
      lineType,
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;
    if (lineType === 'dash') {
      return {
        frag: arc_dash_frag,
        vert: arc_dash_vert,
        type: 'dash',
      };
    }

    if (sourceColor && targetColor) {
      // 分离 linear 功能
      return {
        frag: arc_linear_frag,
        vert: arc_linear_vert,
        type: 'linear',
      };
    } else {
      return {
        frag: arc_line_frag,
        vert: arc_line_vert,
        type: 'normal',
      };
    }
  }

  public buildModels(): IModel[] {
    const {
      segmentNumber = 30,
      mask = false,
      maskInside = true,
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;
    const { frag, vert, type } = this.getShaders();
    return [
      this.layer.buildLayerModel({
        moduleName: 'arc2dline' + type,
        vertexShader: vert,
        fragmentShader: frag,
        triangulation: LineArcTriangulation,
        depth: { enable: false },
        blend: this.getBlend(),
        segmentNumber,
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
          const { size = 1 } = feature;
          return Array.isArray(size) ? [size[0]] : [size as number];
        },
      },
    });

    this.styleAttributeService.registerStyleAttribute({
      name: 'instance', // 弧线起始点信息
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Instance',
        buffer: {
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
          return [vertex[3], vertex[4], vertex[5], vertex[6]];
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
