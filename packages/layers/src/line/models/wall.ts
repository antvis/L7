import type {
  IAnimateOption,
  IEncodeFeature,
  ILayerConfig,
  IModel,
  ITexture2D,
} from '@antv/l7-core';
import { AttributeType, gl } from '@antv/l7-core';
import { rgb2arr } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import type { ILineLayerStyleOptions } from '../../core/interface';
import { LineTriangulation } from '../../core/triangulation';
import line_frag from '../shaders/wall/wall_frag.glsl';
import line_vert from '../shaders/wall/wall_vert.glsl';
export default class LineWallModel extends BaseModel {
  protected get attributeLocation() {
    return Object.assign(super.attributeLocation, {
      MAX: super.attributeLocation.MAX,
      SIZE: 9,
      NORMAL: 12,
      UV: 13,
      DISTANCE_MITER_TOTAL: 15,
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
      heightfixed = false,
      lineTexture = false,
      iconStep = 100,
      iconStepCount = 1,
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;
    const { animateOption } = this.layer.getLayerConfig() as ILayerConfig;

    if (this.rendererService.getDirty()) {
      this.texture?.bind();
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
    const commonOptions = {
      u_animate: this.animateOption2Array(animateOption as IAnimateOption),
      u_sourceColor: sourceColorArr,
      u_targetColor: targetColorArr,
      u_textSize: [1024, this.iconService.canvasHeight || 128],
      u_icon_step: iconStep,
      u_heightfixed: Number(heightfixed),
      // 渐变色支持参数
      u_linearColor: useLinearColor,
      u_line_texture: lineTexture ? 1.0 : 0.0, // 传入线的标识
      u_textureBlend: textureBlend === 'normal' ? 0.0 : 1.0,
      u_iconStepCount: iconStepCount,
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
    this.updateTexture();
    this.iconService.on('imageUpdate', this.updateTexture);

    return this.buildModels();
  }

  public clearModels() {
    this.texture?.destroy();
    this.iconService.off('imageUpdate', this.updateTexture);
  }

  public async buildModels(): Promise<IModel[]> {
    const model = await this.layer.buildLayerModel({
      moduleName: 'lineWall',
      vertexShader: line_vert,
      fragmentShader: line_frag,
      triangulation: LineTriangulation,
      defines: this.getDefines(),
      inject: this.getInject(),
      depth: { enable: false },
      blend: this.getBlend(),
    });
    return [model];
  }
  protected registerBuiltinAttributes() {
    // 注册 Position 属性 64 位地位部分，经纬度数据开启双精度，避免大于 20层级以上出现数据偏移
    this.registerPosition64LowAttribute();

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
        size: 2,
        update: (feature: IEncodeFeature) => {
          const { size = 1 } = feature;
          return Array.isArray(size) ? [size[0], size[1]] : [size as number, 0];
        },
      },
    });

    this.styleAttributeService.registerStyleAttribute({
      name: 'normal',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Normal',
        shaderLocation: this.attributeLocation.NORMAL,
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
      name: 'distanceAndTotalAndMiter',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Distance_Total_Miter',
        shaderLocation: this.attributeLocation.DISTANCE_MITER_TOTAL,
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 3,
        update: (feature: IEncodeFeature, featureIdx: number, vertex: number[]) => {
          // [distance, miter, total_distance]
          return [vertex[3], vertex[4], vertex[5]];
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
    this.textures = [this.texture];
  };
}
