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
import { rgb2arr } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { ILineLayerStyleOptions } from '../../core/interface';
import { LineArcTriangulation } from '../../core/triangulation';
import { EARTH_RADIUS } from '../../earth/utils';
// arc3d line layer
import arc3d_line_frag from '../shaders/line_arc_3d_frag.glsl';
import arc3d_line_vert from '../shaders/line_arc_3d_vert.glsl';
// arc3d linear layer
import arc3d_linear_frag from '../shaders/linear/arc3d_linear_frag.glsl';
import arc3d_linear_vert from '../shaders/linear/arc3d_linear_vert.glsl';

const lineStyleObj: { [key: string]: number } = {
  solid: 0.0,
  dash: 1.0,
};
export default class Arc3DModel extends BaseModel {
  protected texture: ITexture2D;
  public getUninforms(): IModelUniform {
    const {
      sourceColor,
      targetColor,
      textureBlend = 'normal',
      lineType = 'solid',
      dashArray = [10, 5],
      lineTexture = false,
      iconStep = 100,
      segmentNumber = 30,
      globalArcHeight = 10,
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

    const u_globel = this.mapService.version === 'GLOBEL' ? 1 : 0;
    const u_globel_radius = EARTH_RADIUS; // 地球半径
    const u_global_height = globalArcHeight;
    const u_textureBlend = textureBlend === 'normal' ? 0.0 : 1.0;
    const u_line_type = lineStyleObj[lineType as string] || 0.0;
    const u_dash_array = dashArray;

    // 纹理支持参数
    const u_line_texture = lineTexture ? 1.0 : 0.0; // 传入线的标识
    const u_icon_step = iconStep;
    const u_textSize = [1024, this.iconService.canvasHeight || 128];

    // 渐变色支持参数
    const u_linearColor = useLinearColor;
    const u_sourceColor = sourceColorArr;
    const u_targetColor = targetColorArr;

    const uniforms = this.getStyleAttribute();

    this.uniformBuffers[0].subData({
      offset: 0,
      data: new Uint8Array(
        new Float32Array([
          ...uniforms.u_stroke,
          ...uniforms.u_offsets,
          uniforms.u_opacity,
        ]),
      ),
    });

    this.uniformBuffers[1].subData({
      offset: 0,
      data: new Uint8Array(
        new Float32Array([
          ...u_sourceColor,
          ...u_targetColor,
          ...u_dash_array,
          ...u_textSize,
          u_linearColor,
          u_line_texture,
          u_icon_step,
          u_globel,
          u_globel_radius,
          u_global_height,
          u_textureBlend,
          u_line_type,
          segmentNumber,
        ]).buffer,
      ),
    });

    return {
      u_sourceColor,
      u_targetColor,
      u_dash_array,
      u_textSize,
      u_linearColor,
      u_line_texture,
      u_icon_step,
      u_globel,
      u_globel_radius,
      u_global_height,
      u_textureBlend,
      u_line_type,
      segmentNumber,
      ...uniforms,
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
    const { sourceColor, targetColor } =
      this.layer.getLayerConfig() as ILineLayerStyleOptions;

    if (sourceColor && targetColor) {
      // 分离 linear 功能
      return {
        frag: arc3d_linear_frag,
        vert: arc3d_linear_vert,
        type: 'Linear',
      };
    } else {
      return {
        frag: arc3d_line_frag,
        vert: arc3d_line_vert,
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
        data: new Float32Array(4 + 2 + 1),
        isUBO: true,
      }),
    );
    this.uniformBuffers.push(
      this.rendererService.createBuffer({
        data: new Float32Array(4 + 4 + 4 + 2 + 1 * 9),
        isUBO: true,
      }),
    );

    const model = await this.layer.buildLayerModel({
      moduleName: 'lineArc3d' + type,
      vertexShader: vert,
      fragmentShader: frag,
      inject: this.getInject(),
      triangulation: LineArcTriangulation,
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
