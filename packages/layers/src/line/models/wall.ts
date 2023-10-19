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
import { lodashUtil, rgb2arr } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { ILineLayerStyleOptions } from '../../core/interface';
import { LineTriangulation } from '../../core/triangulation';
import line_frag from '../shaders/wall/wall_frag.glsl';
import line_vert from '../shaders/wall/wall_vert.glsl';
const { isNumber } = lodashUtil;
export default class LineWallModel extends BaseModel {
  protected texture: ITexture2D;
  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
      sourceColor,
      targetColor,
      textureBlend = 'normal',
      heightfixed = false,
      lineTexture = false,
      iconStep = 100,
      iconStepCount = 1,
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;
    if (this.rendererService.getDirty()) {
      this.texture.bind();
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

    const u_heightfixed = Number(heightfixed);
    const u_opacity = isNumber(opacity) ? opacity : 1.0;
    const u_textureBlend = textureBlend === 'normal' ? 0.0 : 1.0;
    const u_line_texture = lineTexture ? 1.0 : 0.0; // 传入线的标;
    const u_iconStepCount = iconStepCount;
    const u_icon_step = iconStep;
    const u_textSize = [1024, this.iconService.canvasHeight || 128];
    // 渐变色支持参数
    const u_linearColor = useLinearColor;
    const u_sourceColor = sourceColorArr;
    const u_targetColor = targetColorArr;

    this.uniformBuffers[0].subData({
      offset: 0,
      data: new Uint8Array(
        new Float32Array([
          // vec4 u_sourceColor;
          // vec4 u_targetColor;
          // vec2 u_textSize;
          // float u_icon_step;
          // float u_heightfixed;
          // float u_linearColor;
          // float u_line_texture;
          // float u_opacity;
          // float u_textureBlend;
          // float u_iconStepCount;
          ...u_sourceColor,
          ...u_targetColor,
          ...u_textSize,
          u_icon_step,
          u_heightfixed,
          u_linearColor,
          u_line_texture,
          u_opacity,
          u_textureBlend,
          u_iconStepCount,
        ]).buffer,
      ),
    });

    return {
      u_heightfixed,
      u_opacity,
      u_textureBlend,
      u_line_texture,
      u_iconStepCount,
      u_icon_step,
      u_textSize,
      u_linearColor,
      u_sourceColor,
      u_targetColor,
    };
  }
  public getAnimateUniforms(): IModelUniform {
    const { animateOption } = this.layer.getLayerConfig() as ILayerConfig;
    return {
      u_animate: this.animateOption2Array(animateOption as IAnimateOption),
      u_time: this.layer.getLayerAnimateTime(),
    };
  }

  public async initModels(): Promise<IModel[]> {
    this.updateTexture();
    this.iconService.on('imageUpdate', this.updateTexture);

    return this.buildModels();
  }

  public clearModels() {
    this.texture?.destroy();
    this.iconService.off('imageUpdate', this.updateTexture);
  }

  public async buildModels(): Promise<IModel[]> {
    this.uniformBuffers.push(
      this.rendererService.createBuffer({
        data: new Float32Array(4 + 4 + 2 + 1 * 7),
        isUBO: true,
      }),
    );

    const model = await this.layer.buildLayerModel({
      moduleName: 'lineWall',
      vertexShader: line_vert,
      fragmentShader: line_frag,
      triangulation: LineTriangulation,
      depth: { enable: false },
      blend: this.getBlend(),
    });
    return [model];
  }
  protected registerBuiltinAttributes() {
    this.styleAttributeService.registerStyleAttribute({
      name: 'distance',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Distance',
        shaderLocation: 12,
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
        ) => {
          return [vertex[3]];
        },
      },
    });
    this.styleAttributeService.registerStyleAttribute({
      name: 'total_distance',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Total_Distance',
        shaderLocation: 11,
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
        shaderLocation: 7,
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (feature: IEncodeFeature) => {
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
        shaderLocation: 9,
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
        shaderLocation: 8,
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
        shaderLocation: 10,
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (feature: IEncodeFeature) => {
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
    this.textures[0] = this.texture;
  };
}
