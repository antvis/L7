import {
  AttributeType,
  gl,
  IAnimateOption,
  IAttribute,
  IElements,
  IEncodeFeature,
  ILayerConfig,
  IModel,
  IModelUniform,
  ITexture2D
} from '@antv/l7-core';
import { rgb2arr } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { PointFillTriangulation } from '../../core/triangulation';
import pointFillFrag from '../shaders/fill_frag.glsl';
import pointFillVert from '../shaders/fill_vert.glsl';

import { getSize, getUvPosition, initTextureData, initDefaultTextureData } from '../../utils/dataMappingStyle'
import { isNumber } from 'lodash';
interface IPointLayerStyleOptions {
  opacity: any;
  strokeWidth: number;
  stroke: string;
  strokeOpacity: number;
  offsets: [number, number];
}

interface IDataLayout {
  widthCount: number;
  heightCount: number;
  widthStep: number;
  widthStart: number;
  heightStep: number;
  heightStart: number;
}

// 用于判断 opacity 的值是否发生该改变
let curretnOpacity: any = '';
let curretnStrokeOpacity: any = ''

export default class FillModel extends BaseModel {
 
  protected opacityTexture: ITexture2D;

  public dataLayout: IDataLayout = { // 默认值
    widthCount: 1024,
    heightCount: 1,
    widthStep: 1/1024,
    widthStart: 1/2048,
    heightStep: 1,
    heightStart: 0.5
  };

  public getUninforms(): IModelUniform {
    const {
      opacity,
      stroke = 'rgb(0,0,0,0)',
      strokeWidth = 1,
      strokeOpacity = 1,
      offsets = [0, 0],
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;

    if ( curretnOpacity !== JSON.stringify(opacity)) {
      const { createTexture2D } = this.rendererService;
      // 从 encodeData 数据的 opacity 字段上取值，并将值按照排布写入到纹理中
      this.opacityTexture = initTextureData(this.dataLayout.heightCount, createTexture2D, this.layer.getEncodedData(), 'opacity')
      
      curretnOpacity = JSON.stringify(opacity);
    } 


    if(curretnStrokeOpacity !== JSON.stringify(strokeOpacity)) {
     
      curretnStrokeOpacity = JSON.stringify(strokeOpacity)
    }

    return {
      u_opacity_texture: this.opacityTexture,
      u_opacity: opacity ? -1.0 : 1.0,
      u_stroke_width: strokeWidth,
      u_stroke_color: rgb2arr(stroke),
      u_stroke_opacity: isNumber(strokeOpacity)?strokeOpacity: 1.0,
      u_offsets: [-offsets[0], offsets[1]],
    };
  }
  public getAnimateUniforms(): IModelUniform {
    const { animateOption } = this.layer.getLayerConfig() as ILayerConfig;
    return {
      u_aimate: this.animateOption2Array(animateOption as IAnimateOption),
      u_time: this.layer.getLayerAnimateTime(),
    };
  }

  public getAttribute(): {
    attributes: {
      [attributeName: string]: IAttribute;
    };
    elements: IElements;
  } {
    return this.styleAttributeService.createAttributesAndIndices(
      this.layer.getEncodedData(),
      PointFillTriangulation,
    );
  }

  public initEncodeDataLayout(dataLength: number) {
    let { width: widthCount, height: heightCount } = getSize(dataLength)
    this.dataLayout.widthCount = widthCount
    this.dataLayout.heightCount = heightCount

    this.dataLayout.widthStep = 1/widthCount
    this.dataLayout.widthStart = this.dataLayout.widthStep/2
    this.dataLayout.heightStep = 1/heightCount
    this.dataLayout.heightStart = this.dataLayout.heightStep/2
  }

  public initModels(): IModel[] {
    
    this.initEncodeDataLayout(this.layer.getEncodedData().length)

    return this.buildModels();
  }
  public buildModels(): IModel[] {
    return [
      this.layer.buildLayerModel({
        moduleName: 'pointfill',
        vertexShader: pointFillVert,
        fragmentShader: pointFillFrag,
        triangulation: PointFillTriangulation,
        depth: { enable: false },
        blend: this.getBlend(),
      }),
    ];
  }
  protected animateOption2Array(option: IAnimateOption): number[] {
    return [option.enable ? 0 : 1.0, option.speed || 1, option.rings || 3, 0];
  }
  protected registerBuiltinAttributes() {
    this.styleAttributeService.registerStyleAttribute({
      name: 'extrude',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Extrude',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const extrude = [1, 1, -1, 1, -1, -1, 1, -1];
          const extrudeIndex = (attributeIdx % 4) * 2;
          return [extrude[extrudeIndex], extrude[extrudeIndex + 1]];
        },
      },
    });

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
        size: 1,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const { size = 5 } = feature;
          // console.log('featureIdx', featureIdx, feature)
          return Array.isArray(size) ? [size[0]] : [size as number];
        },
      },
    });

    // point feature id
    this.styleAttributeService.registerStyleAttribute({
      name: 'featureId',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_featureId',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          return getUvPosition(
            this.dataLayout.widthStep, 
            this.dataLayout.widthStart, 
            this.dataLayout.heightStep, 
            this.dataLayout.heightStart, 
            featureIdx)
        },
      },
    });

    // point layer size;
    this.styleAttributeService.registerStyleAttribute({
      name: 'shape',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Shape',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const { shape = 2 } = feature;
          const shape2d = this.layer.getLayerConfig().shape2d as string[];
          const shapeIndex = shape2d.indexOf(shape as string);
          return [shapeIndex];
        },
      },
    });
  }
}
