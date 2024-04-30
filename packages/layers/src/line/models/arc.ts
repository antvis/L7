import type {
  IAnimateOption,
  IEncodeFeature,
  ILayerConfig,
  IModel,
  ITexture2D,
} from '@antv/l7-core';
import { AttributeType, gl } from '@antv/l7-core';
import { fp64LowPart, rgb2arr } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import type { ILineLayerStyleOptions } from '../../core/interface';
import { LineArcTriangulation } from '../../core/triangulation';
import arc_line_frag from '../shaders/arc/line_arc_frag.glsl';
import arc_line_vert from '../shaders/arc/line_arc_vert.glsl';

const lineStyleObj: { [key: string]: number } = {
  solid: 0.0,
  dash: 1.0,
};
export default class ArcModel extends BaseModel {
  protected get attributeLocation() {
    return Object.assign(super.attributeLocation, {
      MAX: super.attributeLocation.MAX,
      SIZE: 9,
      INSTANCE: 10,
      INSTANCE_64LOW: 11,
      UV: 12,
      THETA_OFFSET: 13,
    });
  }
  protected texture: ITexture2D;
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
      dashArray = [10, 5],
      forward = true,
      lineTexture = false,
      iconStep = 100,
      segmentNumber = 30,
      // thetaOffset = 0.314,
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;

    const { animateOption } = this.layer.getLayerConfig() as ILayerConfig;
    let u_dash_array = dashArray;
    if (lineType !== 'dash') {
      u_dash_array = [0, 0];
    }
    if (u_dash_array.length === 2) {
      u_dash_array.push(0, 0);
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
      this.texture?.bind();
    }
    const commonOptions = {
      u_animate: this.animateOption2Array(animateOption as IAnimateOption),
      u_dash_array,
      u_sourceColor: sourceColorArr,
      u_targetColor: targetColorArr,
      u_textSize: [1024, this.iconService.canvasHeight || 128],
      segmentNumber,
      u_lineDir: forward ? 1 : -1,
      u_icon_step: iconStep,
      u_line_texture: lineTexture ? 1.0 : 0.0, // 传入线的标识
      u_textureBlend: textureBlend === 'normal' ? 0.0 : 1.0,
      u_blur: 0.9,
      u_line_type: lineStyleObj[lineType || 'solid'],
      u_time: this.layer.getLayerAnimateTime() || 0,
      // // 纹理支持参数
      // u_texture: this.texture, // 贴图
      // 渐变色支持参数
      u_linearColor: useLinearColor,
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
    this.updateTexture();
    this.iconService.on('imageUpdate', this.updateTexture);

    return this.buildModels();
  }

  public clearModels() {
    this.texture?.destroy();
    this.iconService.off('imageUpdate', this.updateTexture);
  }

  public getShaders(): { frag: string; vert: string; type: string } {
    return {
      frag: arc_line_frag,
      vert: arc_line_vert,
      type: '',
    };
  }

  public async buildModels(): Promise<IModel[]> {
    this.initUniformsBuffer();
    const { segmentNumber = 30 } = this.layer.getLayerConfig() as ILineLayerStyleOptions;
    const { frag, vert, type } = this.getShaders();
    //
    const model = await this.layer.buildLayerModel({
      moduleName: 'lineArc2d' + type,
      vertexShader: vert,
      fragmentShader: frag,
      defines: this.getDefines(),
      inject: this.getInject(),
      triangulation: LineArcTriangulation,
      depth: { enable: false },
      styleOption: { segmentNumber },
    });
    return [model];
  }

  protected registerBuiltinAttributes() {
    this.styleAttributeService.registerStyleAttribute({
      name: 'size',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Size',
        shaderLocation: this.attributeLocation.SIZE,
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

    // 弧线起始点信息
    this.styleAttributeService.registerStyleAttribute({
      name: 'instance',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Instance',
        shaderLocation: this.attributeLocation.INSTANCE,
        buffer: {
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 4,
        update: (feature: IEncodeFeature, featureIdx: number, vertex: number[]) => {
          return [vertex[3], vertex[4], vertex[5], vertex[6]];
        },
      },
    });

    // save low part for enabled double precision INSTANCE attribute
    this.styleAttributeService.registerStyleAttribute({
      name: 'instance64Low',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Instance64Low',
        shaderLocation: this.attributeLocation.INSTANCE_64LOW,
        buffer: {
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 4,
        update: (feature: IEncodeFeature, featureIdx: number, vertex: number[]) => {
          return [
            fp64LowPart(vertex[3]),
            fp64LowPart(vertex[4]),
            fp64LowPart(vertex[5]),
            fp64LowPart(vertex[6]),
          ];
        },
      },
    });

    this.styleAttributeService.registerStyleAttribute({
      name: 'uv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_iconMapUV',
        shaderLocation: this.attributeLocation.UV,
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

    this.styleAttributeService.registerStyleAttribute({
      name: 'thetaOffset',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_ThetaOffset',
        shaderLocation: this.attributeLocation.THETA_OFFSET,
        buffer: {
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (feature: IEncodeFeature) => {
          const { thetaOffset: op = 1 } = feature;
          return [op];
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
    this.textures = [this.texture];
  };
}
