import {
  AttributeType,
  gl,
  IEncodeFeature,
  ILayer,
  TYPES,
  IRendererService,
} from '@antv/l7-core';

import StyleAttribute from '../../../../core/src/services/layer/StyleAttribute'
import { vert, frag } from './fillShader';
export default class FillModel {
  protected layer: ILayer;
  private attributes: any[] = [];

  protected rendererService: IRendererService;

  constructor(layer: ILayer) {
    this.layer = layer;
    this.rendererService = layer
      .getContainer()
      .get<IRendererService>(TYPES.IRendererService);

    this.registerBuiltinAttributes();
  }

  public createAttributesAndIndices(
    features: IEncodeFeature[],
   
  ) {

    function triangulation() {
      const coordinates = [120, 30]
      return {
        vertices: [...coordinates, ...coordinates, ...coordinates, ...coordinates],
        indices: [0, 1, 2, 2, 3, 0],
        size: 2,
      };
    }
  
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
      } = triangulation(feature);

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

        descriptors.forEach((descriptor) => {
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

    descriptors.forEach((descriptor) => {
      if (descriptor) {
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

  public buildLayerModel() {
    const uniforms = {
      u_CameraPosition: [0, 0, 0],
      u_CoordinateSystem: 0,
      u_DevicePixelRatio: 0,
      u_FocalDistance: 0,
      u_ModelMatrix:  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      u_Mvp:  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      u_PixelsPerDegree: [0, 0, 0],
      u_PixelsPerDegree2: [0, 0, 0],
      u_PixelsPerMeter: [0, 0, 0],
      u_ProjectionMatrix: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      u_ViewMatrix: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      u_ViewProjectionMatrix: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      u_ViewportCenter: [0, 0],
      u_ViewportCenterProjection:  [0, 0, 0, 0],
      u_ViewportSize: [0, 0],
      u_Zoom: 1,
      u_ZoomScale: 1
    }
    
    const { createModel } = this.rendererService;
    const { attributes, elements } =this.createAttributesAndIndices(
      [{
        coordinates: [120, 30],
        id: 0,
      }],
    );
    
    const modelOptions = {
      attributes,
      uniforms,
      fs: frag,
      vs: vert,
      elements,
    };
  
    return createModel(modelOptions);
  }


  public buildModels() {
   const model =  this.buildLayerModel();
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
