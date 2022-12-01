import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModelUniform,
  ILayer,
  TYPES,
  IShaderModuleService,
  IRendererService,
  IStyleAttributeService,
} from '@antv/l7-core';

import pointFillFrag from '../shaders/fill_frag.glsl';
import pointFillVert from '../shaders/fill_vert.glsl';



export default class FillModel {
  protected layer: ILayer;

  protected shaderModuleService: IShaderModuleService;

  protected rendererService: IRendererService;

  protected styleAttributeService: IStyleAttributeService;


  constructor(layer: ILayer) {
    this.layer = layer;
    this.rendererService = layer
      .getContainer()
      .get<IRendererService>(TYPES.IRendererService);
  

    this.shaderModuleService = layer
      .getContainer()
      .get<IShaderModuleService>(TYPES.IShaderModuleService);

    this.styleAttributeService = layer
      .getContainer()
      .get<IStyleAttributeService>(TYPES.IStyleAttributeService);
  
    this.registerBuiltinAttributes();
  }

  public getUninforms(): IModelUniform {
    return {
    };
  }


  public initModels() {
    return this.buildModels();
  }

  public buildLayerModel( options: any ) {
    const {
      moduleName,
      vertexShader,
      fragmentShader,
      triangulation,
      segmentNumber,
      ...rest
    } = options;

    this.shaderModuleService.registerModule(moduleName, {
      vs: vertexShader,
      fs: fragmentShader,
    });
    const { vs, fs, uniforms } = this.shaderModuleService.getModule(moduleName);
    const { createModel } = this.rendererService;
    const { attributes, elements } =
    this.styleAttributeService.createAttributesAndIndices(
      [{
        color: [1, 0, 0, 1],
        coordinates: [120, 30],
        id: 0,
        shape: 'circle',
        size: 16
      }],
      triangulation,
      segmentNumber,
    );
    const modelOptions = {
      attributes,
      uniforms,
      fs,
      vs,
      elements,
      ...rest,
    };
  
  return createModel(modelOptions);
  }


  public buildModels() {
  
    function PointFillTriangulation() {
      const coordinates = [120, 30]
      return {
        vertices: [...coordinates, ...coordinates, ...coordinates, ...coordinates],
        indices: [0, 1, 2, 2, 3, 0],
        size: 2,
      };
    }

   const model =  this
      .buildLayerModel({
        moduleName: 'pointFill',
        vertexShader: pointFillVert,
        fragmentShader: pointFillFrag,
        triangulation: PointFillTriangulation,
      });
      return [model];
  }

  protected registerBuiltinAttributes() {

    this.styleAttributeService.registerStyleAttribute({
      name: 'position',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Position',
        buffer: {
          data: [],
          type: gl.FLOAT,
        },
        size: 3,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
        ) => {
          return vertex.length === 2
            ? [vertex[0], vertex[1], 0]
            : [vertex[0], vertex[1], vertex[2]];
        },
      },
    });

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

  }
}
