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
const { isNumber } = lodashUtil;
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

    const u_thetaOffset = thetaOffset;
    const u_opacity = isNumber(opacity) ? opacity : 1;
    const  u_textureBlend = textureBlend === 'normal' ? 0.0 : 1.0;
    const u_line_type = lineStyleObj[lineType || 'solid'];
    const u_dash_array = dashArray;
    const u_blur = 0.9;
    const u_lineDir = forward ? 1 : -1;

    // 纹理支持参数
    const u_line_texture = lineTexture ? 1.0 : 0.0; // 传入线的标识
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
          // vec4 u_dash_array;
          // vec2 u_textSize;
          // float u_thetaOffset;
          // float u_opacity;
          // float u_textureBlend;
          // float segmentNumber;
          // float u_line_type;
          // float u_blur;
          // float u_lineDir;
          // float u_line_texture;
          // float u_icon_step;
          // float u_linearColor;
          ...u_sourceColor,
          ...u_targetColor,
          ...u_dash_array,
          ...u_textSize,
          u_thetaOffset,
          u_opacity,
          u_textureBlend,
          segmentNumber,
          u_line_type,
          u_blur,
          u_lineDir,
          u_line_texture,
          u_icon_step,
          u_linearColor,
        ]).buffer,
      ),
    });

    return {
      u_sourceColor,
      u_targetColor,
      u_dash_array,
      u_textSize,
      u_thetaOffset,
      u_opacity,
      u_textureBlend,
      segmentNumber,
      u_line_type,
      u_blur,
      u_lineDir,
      u_line_texture,
      u_icon_step,
      u_linearColor,
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

  public getShaders(): { frag: string; vert: string; type: string } {
    const { sourceColor, targetColor, lineType } =
      this.layer.getLayerConfig() as ILineLayerStyleOptions;
    if (lineType === 'dash') {
      return {
        frag: arc_dash_frag,
        vert: arc_dash_vert,
        type: 'Dash',
      };
    }

    if (sourceColor && targetColor) {
      // 分离 linear 功能
      return {
        frag: arc_linear_frag,
        vert: arc_linear_vert,
        type: 'Linear',
      };
    } else {
      return {
        frag: arc_line_frag,
        vert: arc_line_vert,
        type: '',
      };
    }
  }

  public async buildModels(): Promise<IModel[]> {
    const { segmentNumber = 30 } =
      this.layer.getLayerConfig() as ILineLayerStyleOptions;
    const { frag, vert, type } = this.getShaders();

    this.uniformBuffers.push(
      this.rendererService.createBuffer({
        data: new Float32Array(4 + 4 + 4 + 2 + 1 * 10),
        isUBO: true,
      }),
    );

    const model = await this.layer.buildLayerModel({
      moduleName: 'lineArc2d' + type,
      vertexShader: vert,
      fragmentShader: frag,
      triangulation: LineArcTriangulation,
      depth: { enable: false },
      segmentNumber,
    });
    return [model];
  }

  protected registerBuiltinAttributes() {
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
        size: 1,
        update: (feature: IEncodeFeature) => {
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
        shaderLocation: 8,
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
        shaderLocation: 9,
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
