import {
  AttributeType,
  gl,
  IEncodeFeature,
  ILayer,
  TYPES,
  IShaderModuleService,
  IRendererService,
  IStyleAttributeService,
} from '@antv/l7-core';

import pointFillFrag from '../shaders/fill_frag.glsl';
import pointFillVert from '../shaders/fill_vert.glsl';

import StyleAttribute from '../../../../core/src/services/layer/StyleAttribute'

export default class FillModel {
  protected layer: ILayer;
  private attributes: any[] = [];

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

  public createAttributesAndIndices(
    features: IEncodeFeature[],
    triangulation: Triangulation,
    segmentNumber: number,
  ) {
  
    const descriptors = this.attributes.map((attr) => {
      attr.resetDescriptor();
      return attr.descriptor;
    });
    let verticesNum = 0;
    let vecticesCount = 0; // 在不使用 element 的时候记录顶点、图层所有顶点的总数
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const vertices: number[] = [];
    const indices: number[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const normals: number[] = [];
    let size = 3;
    features.forEach((feature, featureIdx) => {
      // 逐 feature 进行三角化
      const {
        indices: indicesForCurrentFeature,
        vertices: verticesForCurrentFeature,
        normals: normalsForCurrentFeature,
        size: vertexSize,
        indexes,
        count,
      } = triangulation(feature, segmentNumber);

      if (typeof count === 'number') {
        vecticesCount += count;
      }

      indicesForCurrentFeature.forEach((i) => {
        indices.push(i + verticesNum);
      });
      size = vertexSize;
      const verticesNumForCurrentFeature =
        verticesForCurrentFeature.length / vertexSize;


      verticesNum += verticesNumForCurrentFeature;
      // 根据 position 顶点生成其他顶点数据
      for (
        let vertexIdx = 0;
        vertexIdx < verticesNumForCurrentFeature;
        vertexIdx++
      ) {
        const normal =
          normalsForCurrentFeature?.slice(vertexIdx * 3, vertexIdx * 3 + 3) ||
          [];
        const vertice = verticesForCurrentFeature.slice(
          vertexIdx * vertexSize,
          vertexIdx * vertexSize + vertexSize,
        );

        let vertexIndex = 0;
        if (indexes && indexes[vertexIdx] !== undefined) {
          vertexIndex = indexes[vertexIdx];
        }

        descriptors.forEach((descriptor, attributeIdx) => {
          if (descriptor && descriptor.update) {
            (descriptor.buffer.data as number[]).push(
              ...descriptor.update(
                feature,
                featureIdx,
                vertice,
                vertexIdx, // 当前顶点所在feature索引
                normal,
                vertexIndex,
                // 传入顶点索引 vertexIdx
              ),
            );
          } // end if
        }); // end for each
      } // end for
    }); // end features for Each
    const {
      createAttribute,
      createBuffer,
      createElements,
    } = this.rendererService;

    const attributes = {};

    descriptors.forEach((descriptor, attributeIdx) => {
      if (descriptor) {
        // IAttribute 参数透传
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { buffer, update, name, ...rest } = descriptor;

        const vertexAttribute = createAttribute({
          // IBuffer 参数透传
          buffer: createBuffer(buffer),
          ...rest,
        });
        attributes[descriptor.name || ''] = vertexAttribute;

     
      }
    });

    const elements = createElements({
      data: indices,
      type: gl.UNSIGNED_INT,
      count: indices.length,
    });
    const attributesAndIndices = {
      attributes,
      elements,
      count: vecticesCount,
    };
    return attributesAndIndices;
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
    const { attributes, elements } =this.createAttributesAndIndices(
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

  public registerStyleAttribute(
    options: any
  ) {
    const attributeToUpdate = new StyleAttribute(options);
    this.attributes.push(attributeToUpdate);
  }

  protected registerBuiltinAttributes() {

    this.registerStyleAttribute({
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

    this.registerStyleAttribute({
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
