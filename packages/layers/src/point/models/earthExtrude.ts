import {
  AttributeType,
  gl,
  IEncodeFeature,
  ILayerConfig,
  IModel,
} from '@antv/l7-core';
import { calculateCentroid, getCullFace, rgb2arr } from '@antv/l7-utils';
import { isNumber } from 'lodash';
import BaseModel from '../../core/BaseModel';
import { IPointLayerStyleOptions } from '../../core/interface';
import { PointExtrudeTriangulation } from '../../core/triangulation';
import { lglt2xyz } from '../../earth/utils';
import pointExtrudeFrag from '../shaders/earth/extrude_frag.glsl';
import pointExtrudeVert from '../shaders/earth/extrude_vert.glsl';

export default class ExtrudeModel extends BaseModel {
  private raiseCount: number = 0;
  private raiseRepeat: number = 0;
  public getUninforms() {
    const {
      animateOption = {
        enable: false,
        speed: 0.01,
        repeat: false,
      },
      opacity = 1,

      sourceColor,
      targetColor,

      pickLight = false,
      heightfixed = false,

      opacityLinear = {
        enable: false,
        dir: 'up',
      },

      lightEnable = true,
    } = this.layer.getLayerConfig() as Partial<
      ILayerConfig & IPointLayerStyleOptions
    >;

    // 转化渐变色
    let useLinearColor = 0; // 默认不生效
    let sourceColorArr = [0, 0, 0, 0];
    let targetColorArr = [0, 0, 0, 0];
    if (sourceColor && targetColor) {
      sourceColorArr = rgb2arr(sourceColor);
      targetColorArr = rgb2arr(targetColor);
      useLinearColor = 1;
    }

    if (this.raiseCount < 1 && this.raiseRepeat > 0) {
      if (animateOption.enable) {
        const { speed = 0.01 } = animateOption;
        this.raiseCount += speed;
        if (this.raiseCount >= 1) {
          if (this.raiseRepeat > 1) {
            this.raiseCount = 0;
            this.raiseRepeat--;
          } else {
            this.raiseCount = 1;
          }
        }
      }
    }

    return {
      // 圆柱体的拾取高亮是否要计算光照
      u_pickLight: Number(pickLight),
      // 圆柱体是否固定高度
      u_heightfixed: Number(heightfixed),

      u_r: animateOption.enable && this.raiseRepeat > 0 ? this.raiseCount : 1.0,
      u_opacity: isNumber(opacity) ? opacity : 1.0,
      // 渐变色支持参数
      u_linearColor: useLinearColor,
      u_sourceColor: sourceColorArr,
      u_targetColor: targetColorArr,

      // 透明度渐变
      u_opacitylinear: Number(opacityLinear.enable),
      u_opacitylinear_dir: opacityLinear.dir === 'up' ? 1.0 : 0.0,

      // 光照计算开关
      u_lightEnable: Number(lightEnable),
    };
  }
  public async initModels(): Promise<IModel[]> {
    return this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    // GAODE1.x GAODE2.x MAPBOX
    const {
      animateOption: { repeat = 1 },
    } = this.layer.getLayerConfig() as ILayerConfig;
    this.raiseRepeat = repeat;

    const model = await this.layer.buildLayerModel({
      moduleName: 'pointEarthExtrude',
      vertexShader: pointExtrudeVert,
      fragmentShader: pointExtrudeFrag,
      triangulation: PointExtrudeTriangulation,
      depth: { enable: true },
      cull: {
        enable: true,
        face: getCullFace(this.mapService.version),
      },
      blend: this.getBlend(),
    });
    return [model];
  }

  protected registerBuiltinAttributes() {
    this.styleAttributeService.registerStyleAttribute({
      name: 'size',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Size',
        buffer: {
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 3,
        update: (feature: IEncodeFeature) => {
          const { size } = feature;
          if (size) {
            let buffersize: number[] = [];
            if (Array.isArray(size)) {
              buffersize =
                size.length === 2 ? [size[0], size[0], size[1]] : size;
            }
            if (!Array.isArray(size)) {
              buffersize = [size, size, size];
            }
            return buffersize;
          } else {
            return [2, 2, 2];
          }
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
      name: 'pos',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Pos',
        buffer: {
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 3,
        update: (feature: IEncodeFeature) => {
          const coordinates = calculateCentroid(feature.coordinates);
          return lglt2xyz([coordinates[0], coordinates[1]]) as [
            number,
            number,
            number,
          ];
        },
      },
    });
  }
}
