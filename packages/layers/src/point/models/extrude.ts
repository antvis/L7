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
import pointExtrudeFrag from '../shaders/extrude/extrude_frag.glsl';
import pointExtrudeVert from '../shaders/extrude/extrude_vert.glsl';

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
    if (
      this.dataTextureTest &&
      this.dataTextureNeedUpdate({
        opacity,
      })
    ) {
      this.judgeStyleAttributes({
        opacity,
      });
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

      u_dataTexture: this.dataTexture, // 数据纹理 - 有数据映射的时候纹理中带数据，若没有任何数据映射时纹理是 [1]
      u_cellTypeLayout: this.getCellTypeLayout(),

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
      depth = true,
      animateOption: { repeat = 1 },
    } = this.layer.getLayerConfig() as ILayerConfig;
    this.raiseRepeat = repeat;

    const model = await this.layer.buildLayerModel({
      moduleName: 'pointExtrude',
      vertexShader: pointExtrudeVert,
      fragmentShader: pointExtrudeFrag,
      triangulation: PointExtrudeTriangulation,
      cull: {
        enable: true,
        face: getCullFace(this.mapService.version),
      },
      depth: {
        enable: depth,
      },
    });
    return [model];
  }
  public clearModels() {
    this.dataTexture?.destroy();
  }
  protected registerBuiltinAttributes() {
    // point layer size;
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
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 3,
        update: (feature: IEncodeFeature) => {
          const coordinates = calculateCentroid(feature.coordinates);
          return [coordinates[0], coordinates[1], 0];
        },
      },
    });
  }
}
