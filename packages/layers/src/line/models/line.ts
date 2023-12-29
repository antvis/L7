import type {
  IAnimateOption,
  IEncodeFeature,
  ILayerConfig,
  IModel,
  ITexture2D} from '@antv/l7-core';
import {
  AttributeType,
  gl
} from '@antv/l7-core';
import { LineTriangulation, rgb2arr } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import type {
  ILineLayerStyleOptions} from '../../core/interface';
import {
  LinearDir,
  TextureBlend,
} from '../../core/interface';
// import { LineTriangulation } from '../../core/triangulation';

import { ShaderLocation } from '../../core/CommonStyleAttribute';
import line_frag from '../shaders/line/line_frag.glsl';
import line_vert from '../shaders/line/line_vert.glsl';

const lineStyleObj: { [key: string]: number } = {
  solid: 0.0,
  dash: 1.0,
};
export default class LineModel extends BaseModel {
  private textureEventFlag: boolean = false;
  protected texture: ITexture2D = this.createTexture2D({
    data: new Uint8Array([0, 0, 0, 0]),
    width: 1,
    height: 1,
  });
  protected getCommonUniformsInfo(): {
    uniformsArray: number[];
    uniformsLength: number;
    uniformsOption: { [key: string]: any };
  } {
    const {
      sourceColor,
      targetColor,
      textureBlend = 'normal',
      lineType = 'solid',
      dashArray = [10, 5, 0, 0],
      lineTexture = false,
      iconStep = 100,
      vertexHeightScale = 20.0,
      strokeWidth = 0.0,
      raisingHeight = 0,
      heightfixed = false,
      linearDir = LinearDir.VERTICAL, // 默认纵向
      blur = [1, 1, 1, 0],
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;
    let u_dash_array = dashArray;
    if (lineType !== 'dash') {
      u_dash_array = [0, 0, 0, 0];
    }
    if (u_dash_array.length === 2) {
      u_dash_array.push(0, 0);
    }
    if (this.rendererService.getDirty() && this.texture) {
      this.texture.bind();
    }
    const { animateOption } = this.layer.getLayerConfig() as ILayerConfig;
    // 转化渐变色
    let useLinearColor = 0; // 默认不生效
    let sourceColorArr = [0, 0, 0, 0];
    let targetColorArr = [0, 0, 0, 0];
    if (sourceColor && targetColor) {
      sourceColorArr = rgb2arr(sourceColor);
      targetColorArr = rgb2arr(targetColor);
      useLinearColor = 1;
    }
    const commonOptions = {
      u_animate: this.animateOption2Array(animateOption as IAnimateOption),
      u_dash_array,
      u_blur: blur,
      u_sourceColor: sourceColorArr,
      u_targetColor: targetColorArr,
      u_textSize: [1024, this.iconService.canvasHeight || 128],
      u_icon_step: iconStep,
      // 是否固定高度
      u_heightfixed: Number(heightfixed),
      // 顶点高度 scale
      u_vertexScale: vertexHeightScale,
      u_raisingHeight: Number(raisingHeight),
      // line border 参数
      u_strokeWidth: strokeWidth,
      u_textureBlend: textureBlend === TextureBlend.NORMAL ? 0.0 : 1.0,
      u_line_texture: lineTexture ? 1.0 : 0.0, // 传入线的标识
      u_linearDir: linearDir === LinearDir.VERTICAL ? 1.0 : 0.0,
      u_linearColor: useLinearColor,
      u_time: this.layer.getLayerAnimateTime() || 0,
    };

    const commonBufferInfo = this.getUniformsBufferInfo(commonOptions);
    return commonBufferInfo;
  }
  // public getAnimateUniforms(): IModelUniform {
  //   const { animateOption } = this.layer.getLayerConfig() as ILayerConfig;
  //   return {
  //     u_animate: this.animateOption2Array(animateOption as IAnimateOption),
  //     u_time: this.layer.getLayerAnimateTime(),
  //   };
  // }
  public async initModels(): Promise<IModel[]> {
    this.initUniformsBuffer();
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
    return {
      frag: line_frag,
      vert: line_vert,
      type: '',
    };
  }
  protected registerBuiltinAttributes() {
    this.styleAttributeService.registerStyleAttribute({
      name: 'distanceAndIndex',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_DistanceAndIndex',
        shaderLocation: 10,
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
        shaderLocation: ShaderLocation.SIZE,
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
        shaderLocation: ShaderLocation.NORMAL,
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
        shaderLocation: 15,
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
        shaderLocation: ShaderLocation.UV,
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
    if (this.textures.length === 0) {
      this.textures = [this.texture];
    }
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
