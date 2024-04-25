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
import { EARTH_RADIUS } from '../../earth/utils';
// arc3d line layer
import arc3d_line_frag from '../shaders/arc3d/line_arc_3d_frag.glsl';
import arc3d_line_vert from '../shaders/arc3d/line_arc_3d_vert.glsl';

const lineStyleObj: { [key: string]: number } = {
  solid: 0.0,
  dash: 1.0,
};
export default class Arc3DModel extends BaseModel {
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
  // public enableShaderEncodeStyles = ['opacity'];
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
      lineTexture = false,
      iconStep = 100,
      segmentNumber = 30,
      globalArcHeight = 10,
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;
    const { animateOption } = this.layer.getLayerConfig() as ILayerConfig;

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
      this.texture?.bind();
    }

    const commonOptions = {
      u_animate: this.animateOption2Array(animateOption as IAnimateOption),
      u_dash_array: dashArray,
      u_sourceColor: sourceColorArr,
      u_targetColor: targetColorArr,
      u_textSize: [1024, this.iconService.canvasHeight || 128],
      u_globel: this.mapService.version === 'GLOBEL' ? 1 : 0,
      u_globel_radius: EARTH_RADIUS, // 地球半径
      u_global_height: globalArcHeight,
      segmentNumber,
      u_line_type: lineStyleObj[lineType as string] || 0.0,
      u_icon_step: iconStep,
      u_line_texture: lineTexture ? 1.0 : 0.0, // 传入线的标识
      u_textureBlend: textureBlend === 'normal' ? 0.0 : 1.0,
      u_time: this.layer.getLayerAnimateTime() || 0,
      u_linearColor: useLinearColor, //是否使用渐变色
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
      frag: arc3d_line_frag,
      vert: arc3d_line_vert,
      type: '',
    };
  }

  public async buildModels(): Promise<IModel[]> {
    const { segmentNumber = 30 } = this.layer.getLayerConfig() as ILineLayerStyleOptions;
    const { frag, vert, type } = this.getShaders();

    const model = await this.layer.buildLayerModel({
      moduleName: 'lineArc3d' + type,
      vertexShader: vert,
      fragmentShader: frag,
      defines: this.getDefines(),
      inject: this.getInject(),
      triangulation: LineArcTriangulation,
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
