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
import { LineTriangulation, rgb2arr } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import {
  ILineLayerStyleOptions,
  LinearDir,
  TextureBlend,
} from '../../core/interface';
// import { LineTriangulation } from '../../core/triangulation';
// dash line shader
import line_dash_frag from '../shaders/dash/line_dash_frag.glsl';
import line_dash_vert from '../shaders/dash/line_dash_vert.glsl';
// basic line shader
import line_frag from '../shaders/line_frag.glsl';
import line_vert from '../shaders/line_vert.glsl';
// other function shaders
import linear_line_frag from '../shaders/linear/line_linear_frag.glsl';

const lineStyleObj: { [key: string]: number } = {
  solid: 0.0,
  dash: 1.0,
};
export default class LineModel extends BaseModel {
  private textureEventFlag: boolean = false;
  protected texture: ITexture2D = this.createTexture2D({
    data: [0, 0, 0, 0],
    mag: gl.NEAREST,
    min: gl.NEAREST,
    premultiplyAlpha: false,
    width: 1,
    height: 1,
  });
  public getUninforms(): IModelUniform {
    const {
      // opacity = 1,
      sourceColor,
      targetColor,
      textureBlend = 'normal',
      lineType = 'solid',
      dashArray = [10, 5, 0, 0],
      lineTexture = false,
      iconStep = 100,
      vertexHeightScale = 20.0,
      borderWidth = 0.0,
      borderColor = '#ccc',
      raisingHeight = 0,
      heightfixed = false,
      linearDir = LinearDir.VERTICAL, // 默认纵向
      blur = [1, 1, 1],
      arrow = {
        enable: false,
        arrowWidth: 2,
        arrowHeight: 3,
        tailWidth: 1,
      },
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;
    if (dashArray.length === 2) {
      dashArray.push(0, 0);
    }

    if (this.rendererService.getDirty() && this.texture) {
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

    const u_textureBlend = textureBlend === TextureBlend.NORMAL ? 0.0 : 1.0;
    const u_line_type = lineStyleObj[lineType];
    const u_dash_array = dashArray;
    const u_blur = blur;
    // 纹理支持参数
    // const   u_texture: this.texture, // 贴图
    const u_line_texture = lineTexture ? 1.0 : 0.0; // 传入线的标识
    const u_icon_step = iconStep;
    const u_textSize = [1024, this.iconService.canvasHeight || 128];

    // line border 参数
    const u_borderWidth = borderWidth;
    const u_borderColor = rgb2arr(borderColor);

    // 渐变色支持参数
    const u_linearDir = linearDir === LinearDir.VERTICAL ? 1.0 : 0.0;
    const u_linearColor = useLinearColor;
    const u_sourceColor = sourceColorArr;
    const u_targetColor = targetColorArr;

    // 是否固定高度
    const u_heightfixed = Number(heightfixed);

    // 顶点高度 scale
    const u_vertexScale = vertexHeightScale;
    const u_raisingHeight = Number(raisingHeight);

    // arrow
    const u_arrow = Number(arrow.enable);
    const u_arrowHeight = arrow.arrowHeight || 3;
    const u_arrowWidth = arrow.arrowWidth || 2;
    const u_tailWidth = arrow.tailWidth === undefined ? 1 : arrow.tailWidth;

    const attributes = this.getStyleAttribute();

    this.uniformBuffers[0].subData({
      offset: 0,
      data: new Uint8Array(
        new Float32Array([
          ...attributes.u_stroke,
          ...attributes.u_offsets,
          attributes.u_opacity,
        ]).buffer,
      ),
    });

    this.uniformBuffers[1].subData({
      offset: 0,
      data: new Uint8Array(
        new Float32Array([
          ...u_sourceColor,
          ...u_targetColor,
          ...u_dash_array,
          ...u_borderColor,
          ...u_blur,
          u_icon_step,
          ...u_textSize,
          u_heightfixed,
          u_vertexScale,
          u_raisingHeight,
          u_linearColor,
          u_arrow,
          u_arrowHeight,
          u_arrowWidth,
          u_tailWidth,
          u_textureBlend,
          u_borderWidth,
          u_line_texture,
          u_linearDir,
          u_line_type,
        ]).buffer,
      ),
    });

    return {
      u_sourceColor,
      u_targetColor,
      u_dash_array,
      u_borderColor,
      u_blur,
      u_icon_step,
      u_textSize,
      u_heightfixed,
      u_vertexScale,
      u_raisingHeight,
      u_linearColor,
      u_arrow,
      u_arrowHeight,
      u_arrowWidth,
      u_tailWidth,
      u_textureBlend,
      u_borderWidth,
      u_line_texture,
      u_linearDir,
      u_line_type,
      // 纹理支持参数
      // u_texture: this.texture, // 贴图
      // 渐变色支持参数

      ...attributes,
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
    // this.updateTexture();
    // this.iconService.on('imageUpdate', this.updateTexture);
    if (!this.textureEventFlag) {
      this.textureEventFlag = true;
      this.updateTexture();
      this.iconService.on('imageUpdate', this.updateTexture);
    }
    return this.buildModels();
  }

  public clearModels() {
    this.texture?.destroy();
    this.iconService.off('imageUpdate', this.updateTexture);
  }

  public async buildModels(): Promise<IModel[]> {
    const { depth = false } =
      this.layer.getLayerConfig() as ILineLayerStyleOptions;
    const { frag, vert, type } = this.getShaders();
    // console.log(frag)
    this.layer.triangulation = LineTriangulation;

    this.uniformBuffers.push(
      this.rendererService.createBuffer({
        data: new Float32Array(4 + 2 + 1),
        isUBO: true,
      }),
    );
    this.uniformBuffers.push(
      this.rendererService.createBuffer({
        data: new Float32Array(4 + 4 + 4 + 4 + 3 + 1 + 2 + 1 * 13),
        isUBO: true,
      }),
    );

    const model = await this.layer.buildLayerModel({
      moduleName: 'line' + type,
      vertexShader: vert,
      fragmentShader: frag,
      triangulation: LineTriangulation,
      inject: this.getInject(),
      depth: { enable: depth },
    });
    return [model];
  }

  /**
   * 根据参数获取不同的 shader 代码
   * @returns
   */
  public getShaders(): { frag: string; vert: string; type: string } {
    const { sourceColor, targetColor, lineType } =
      this.layer.getLayerConfig() as ILineLayerStyleOptions;

    if (lineType === 'dash') {
      return {
        frag: line_dash_frag,
        vert: line_dash_vert,
        type: 'Dash',
      };
    }

    if (sourceColor && targetColor) {
      // 分离 linear 功能
      return {
        frag: linear_line_frag,
        vert: line_vert,
        type: 'Linear',
      };
    } else {
      return {
        frag: line_frag,
        vert: line_vert,
        type: '',
      };
    }
  }

  protected registerBuiltinAttributes() {
    this.styleAttributeService.registerStyleAttribute({
      name: 'distanceAndIndex',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_DistanceAndIndex',
        shaderLocation: 12,
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
