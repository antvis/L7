import {
  AttributeType,
  gl,
  IAttribute,
  IElements,
  IEncodeFeature,
  ILayerConfig,
  IModel,
  IModelUniform,
} from '@antv/l7-core';
import { getCullFace } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { IPointLayerStyleOptions } from '../../core/interface';
import { PointFillTriangulation } from '../../core/triangulation';

import point_tile_frag from '../shaders/tile/fill_tile_frag.glsl';
import point_tile_vert from '../shaders/tile/fill_tile_vert.glsl';
export default class FillModel extends BaseModel {

  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
      strokeOpacity = 1,
      strokeWidth = 0,
      stroke = 'rgba(0,0,0,0)',
    
      blend,
      // coord = 'lnglat',
      // tileOrigin,
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;

    return {
      // u_tileOrigin: tileOrigin || [0, 0],
      // u_coord: coord === 'lnglat' ? 1.0 : 0.0,
      
      u_additive: blend === 'additive' ? 1.0 : 0.0,
    
      u_opacity: Number(opacity),
      u_stroke_opacity: Number(strokeOpacity),
      u_stroke_width: Number(strokeWidth),
      u_stroke_color: this.getStrokeColor(stroke),
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

  public initModels(callbackModel: (models: IModel[]) => void) {
    this.buildModels(callbackModel);
  }


  public buildModels(callbackModel: (models: IModel[]) => void) {
    const {
      workerEnabled = false,
      usage
    } = this.layer.getLayerConfig() as Partial<
      ILayerConfig & IPointLayerStyleOptions
    >;
    this.layer.triangulation = PointFillTriangulation;
    this.layer
      .buildLayerModel({
        moduleName: 'pointTile_' + usage,
        vertexShader: point_tile_vert,
        fragmentShader: point_tile_frag,
        triangulation: PointFillTriangulation,
        depth: { enable: false },
        cull: {
          enable: true,
          face: getCullFace(this.mapService.version),
        },
        blend: this.getBlend(),
        workerEnabled,
        workerOptions: {
          modelType: 'pointTile',
        },
        pick: usage !== 'basemap'
      })
      .then((model) => {
        callbackModel([model]);
      })
      .catch((err) => {
        console.warn(err);
        callbackModel([]);
      });
  }

  public clearModels() {
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
        size: 3,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const extrude = [1, 1, 0, -1, 1, 0, -1, -1, 0, 1, -1, 0];

          const extrudeIndex = (attributeIdx % 4) * 3;
          return [
            extrude[extrudeIndex],
            extrude[extrudeIndex + 1],
            extrude[extrudeIndex + 2],
          ];
        },
      },
    });

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
          return Array.isArray(size)
            ? [size[0]]
            : [(size as number)];
        },
      },
    });

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
