import { AttributeType, gl, IEncodeFeature, IModel } from '@antv/l7-core';
import { isNumber } from 'lodash';
import BaseModel, { styleOffset, styleSingle } from '../../core/BaseModel';
import { PointExtrudeTriangulation } from '../../core/triangulation';
import { calculteCentroid } from '../../utils/geo';
import pointExtrudeFrag from '../shaders/extrude_frag.glsl';
import pointExtrudeVert from '../shaders/extrude_vert.glsl';
interface IPointLayerStyleOptions {
  opacity: styleSingle;
  offsets: styleOffset;
}
export default class ExtrudeModel extends BaseModel {
  public getUninforms() {
    const {
      opacity = 1,
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;
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
        this.cellLength > 0
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
    return {
      u_dataTexture: this.dataTexture, // 数据纹理 - 有数据映射的时候纹理中带数据，若没有任何数据映射时纹理是 [1]
      u_cellTypeLayout: this.getCellTypeLayout(),
      // u_opacity: opacity || 1.0,
      // u_offsets: offsets || [0, 0],
      u_opacity: isNumber(opacity) ? opacity : 1.0,
    };
  }
  public initModels(): IModel[] {
    return this.buildModels();
  }

  public buildModels(): IModel[] {
    return [
      this.layer.buildLayerModel({
        moduleName: 'pointExtrude2',
        vertexShader: pointExtrudeVert,
        fragmentShader: pointExtrudeFrag,
        triangulation: PointExtrudeTriangulation,
        blend: this.getBlend(),
      }),
    ];
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
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 3,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const { size } = feature;
          if (size) {
            let buffersize: number[] = [];
            if (Array.isArray(size)) {
              buffersize =
                size.length === 2 ? [size[0], size[0], size[1]] : size;
            }
            if (!Array.isArray(size)) {
              buffersize = [size];
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
        update: (feature: IEncodeFeature, featureIdx: number) => {
          const coordinates = calculteCentroid(feature.coordinates);
          return [coordinates[0], coordinates[1], 0];
        },
      },
    });
  }
}
