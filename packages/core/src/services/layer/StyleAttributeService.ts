import { inject, injectable, optional } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../../types';
import { gl } from '../renderer/gl';
import { IAttribute } from '../renderer/IAttribute';
import { IElements } from '../renderer/IElements';
import { IRendererService } from '../renderer/IRendererService';
import { IParseDataItem } from '../source/ISourceService';
import { ILayer } from './ILayerService';
import {
  IAttributeScale,
  IEncodeFeature,
  IStyleAttribute,
  IStyleAttributeInitializationOptions,
  IStyleAttributeService,
  IStyleAttributeUpdateOptions,
  IVertexAttributeDescriptor,
  Triangulation,
} from './IStyleAttributeService';
import StyleAttribute from './StyleAttribute';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const bytesPerElementMap = {
  [gl.FLOAT]: 4,
  [gl.UNSIGNED_BYTE]: 1,
  [gl.UNSIGNED_SHORT]: 2,
};

/**
 * 每个 Layer 都拥有一个，用于管理样式属性的注册和更新
 */
@injectable()
export default class StyleAttributeService implements IStyleAttributeService {
  public attributesAndIndices: {
    attributes: {
      [attributeName: string]: IAttribute;
    };
    elements: IElements;
  };
  @inject(TYPES.IRendererService)
  private readonly rendererService: IRendererService;

  private attributes: IStyleAttribute[] = [];
  private triangulation: Triangulation;

  private featureLayout: {
    sizePerElement: number;
    elements: Array<{
      featureIdx: number;
      vertices: number[];
      normals: number[];
      offset: number;
      indexes?: number[];
    }>;
  } = {
    sizePerElement: 0,
    elements: [],
  };
  public registerStyleAttribute(
    options: Partial<IStyleAttributeInitializationOptions>,
  ) {
    let attributeToUpdate = this.getLayerStyleAttribute(options.name || '');
    if (attributeToUpdate) {
      attributeToUpdate.setProps(options);
    } else {
      attributeToUpdate = new StyleAttribute(options);
      this.attributes.push(attributeToUpdate);
    }
    return attributeToUpdate;
  }

  public updateStyleAttribute(
    attributeName: string,
    options: Partial<IStyleAttributeInitializationOptions>,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ) {
    let attributeToUpdate = this.getLayerStyleAttribute(attributeName);
    if (!attributeToUpdate) {
      attributeToUpdate = this.registerStyleAttribute({
        ...options,
        name: attributeName,
      });
    }
    const { scale } = options;
    if (scale && attributeToUpdate) {
      // TODO: 需要比较新旧值确定是否需要 rescale
      // 需要重新 scale，肯定也需要重新进行数据映射
      attributeToUpdate.scale = scale;
      attributeToUpdate.needRescale = true;
      attributeToUpdate.needRemapping = true;
      attributeToUpdate.needRegenerateVertices = true;
      if (updateOptions && updateOptions.featureRange) {
        attributeToUpdate.featureRange = updateOptions.featureRange;
      }
    }
  }

  public getLayerStyleAttributes(): IStyleAttribute[] | undefined {
    return this.attributes;
  }

  public getLayerStyleAttribute(
    attributeName: string,
  ): IStyleAttribute | undefined {
    return this.attributes.find(
      (attribute) => attribute.name === attributeName,
    );
  }

  public getLayerAttributeScale(name: string) {
    const attribute = this.getLayerStyleAttribute(name);
    const scale = attribute?.scale?.scalers as IAttributeScale[];
    if (scale && scale[0]) {
      return scale[0].func;
    }
    return null;
  }

  public updateAttributeByFeatureRange(
    attributeName: string,
    features: IEncodeFeature[],
    startFeatureIdx: number = 0,
    endFeatureIdx?: number,
  ) {
    const attributeToUpdate = this.attributes.find(
      (attribute) => attribute.name === attributeName,
    );
    if (attributeToUpdate && attributeToUpdate.descriptor) {
      const { descriptor } = attributeToUpdate;
      const { update, buffer, size = 0 } = descriptor;
      const bytesPerElement = bytesPerElementMap[buffer.type || gl.FLOAT];
      if (update) {
        const { elements, sizePerElement } = this.featureLayout;
        // 截取待更新的 feature 范围
        const featuresToUpdate = elements.slice(startFeatureIdx, endFeatureIdx);
        // [n, n] 中断更新
        if (!featuresToUpdate.length) {
          return;
        }
        const { offset } = featuresToUpdate[0];
        // 以 byte 为单位计算 buffer 中的偏移
        const bufferOffsetInBytes = offset * size * bytesPerElement;
        const updatedBufferData = featuresToUpdate
          .map(({ featureIdx, vertices, normals }, attributeIdx) => {
            const verticesNumForCurrentFeature =
              vertices.length / sizePerElement;
            const featureData: number[] = [];
            for (
              let vertexIdx = 0;
              vertexIdx < verticesNumForCurrentFeature;
              vertexIdx++
            ) {
              const normal = normals
                ? normals!.slice(vertexIdx * 3, vertexIdx * 3 + 3)
                : [];
              featureData.push(
                ...update(
                  features[featureIdx],
                  featureIdx,
                  vertices.slice(
                    vertexIdx * sizePerElement,
                    vertexIdx * sizePerElement + sizePerElement,
                  ),
                  attributeIdx,
                  normal,
                ),
              );
            }
            return featureData;
          })
          .reduce((prev, cur) => {
            prev.push(...cur);
            return prev;
          }, []);

        // 更新底层 IAttribute 中包含的 IBuffer，使用 subdata
        attributeToUpdate.vertexAttribute.updateBuffer({
          data: updatedBufferData,
          offset: bufferOffsetInBytes,
        });
      }
    }
  }

  public createAttributesAndIndices(
    features: IEncodeFeature[],
    triangulation: Triangulation,
    segmentNumber: number,
  ): {
    attributes: {
      [attributeName: string]: IAttribute;
    };
    elements: IElements;
  } {
    // 每次创建的初始化化 LayerOut
    this.featureLayout = {
      sizePerElement: 0,
      elements: [],
    };
    if (triangulation) {
      this.triangulation = triangulation;
    }
    const descriptors = this.attributes.map((attr) => {
      attr.resetDescriptor();
      return attr.descriptor;
    });
    let verticesNum = 0;
    const vertices: number[] = [];
    const indices: number[] = [];
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
      } = this.triangulation(feature, segmentNumber);
      indicesForCurrentFeature.forEach((i) => {
        indices.push(i + verticesNum);
      });
      size = vertexSize;
      const verticesNumForCurrentFeature =
        verticesForCurrentFeature.length / vertexSize;

      // 记录三角化结果，用于后续精确更新指定 feature
      this.featureLayout.sizePerElement = size;
      this.featureLayout.elements.push({
        featureIdx,
        vertices: verticesForCurrentFeature,
        normals: normalsForCurrentFeature as number[],
        offset: verticesNum,
      });

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
                // TODO: 传入顶点索引 vertexIdx
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

    const attributes: {
      [attributeName: string]: IAttribute;
    } = {};
    descriptors.forEach((descriptor, attributeIdx) => {
      if (descriptor) {
        // IAttribute 参数透传
        const { buffer, update, name, ...rest } = descriptor;

        const vertexAttribute = createAttribute({
          // IBuffer 参数透传
          buffer: createBuffer(buffer),
          ...rest,
        });
        attributes[descriptor.name || ''] = vertexAttribute;

        // 在 StyleAttribute 上保存对 VertexAttribute 的引用
        this.attributes[attributeIdx].vertexAttribute = vertexAttribute;
      }
    });

    const elements = createElements({
      data: indices,
      type: gl.UNSIGNED_INT,
      count: indices.length,
    });
    this.attributesAndIndices = {
      attributes,
      elements,
    };
    return this.attributesAndIndices;
  }

  public createAttributes(
    features: IEncodeFeature[],
    triangulation: Triangulation,
  ): {
    attributes: {
      [attributeName: string]: IAttribute;
    };
  } {
    // 每次创建的初始化化 LayerOut
    this.featureLayout = {
      sizePerElement: 0,
      elements: [],
    };
    if (triangulation) {
      this.triangulation = triangulation;
    }
    const descriptors = this.attributes.map((attr) => {
      attr.resetDescriptor();
      return attr.descriptor;
    });
    let verticesNum = 0;
    const indices: number[] = [];
    let size = 3;
    features.forEach((feature, featureIdx) => {
      // 逐 feature 进行三角化
      const {
        indices: indicesForCurrentFeature,
        vertices: verticesForCurrentFeature,
        normals: normalsForCurrentFeature,
        size: vertexSize,
        indexes,
      } = this.triangulation(feature);
      indicesForCurrentFeature.forEach((i) => {
        indices.push(i + verticesNum);
      });
      size = vertexSize;
      const verticesNumForCurrentFeature =
        verticesForCurrentFeature.length / vertexSize;

      // 记录三角化结果，用于后续精确更新指定 feature
      this.featureLayout.sizePerElement = size;
      this.featureLayout.elements.push({
        featureIdx,
        vertices: verticesForCurrentFeature,
        normals: normalsForCurrentFeature as number[],
        offset: verticesNum,
      });

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
                // TODO: 传入顶点索引 vertexIdx
              ),
            );
          } // end if
        }); // end for each
      } // end for
    }); // end features for Each
    const { createAttribute, createBuffer } = this.rendererService;

    const attributes: {
      [attributeName: string]: IAttribute;
    } = {};
    descriptors.forEach((descriptor, attributeIdx) => {
      if (descriptor) {
        // IAttribute 参数透传
        const { buffer, update, name, ...rest } = descriptor;

        const vertexAttribute = createAttribute({
          // IBuffer 参数透传
          buffer: createBuffer(buffer),
          ...rest,
        });
        attributes[descriptor.name || ''] = vertexAttribute;

        // 在 StyleAttribute 上保存对 VertexAttribute 的引用
        this.attributes[attributeIdx].vertexAttribute = vertexAttribute;
      }
    });
    return {
      attributes,
    };
  }

  public clearAllAttributes() {
    // 销毁关联的 vertex attribute buffer objects
    this.attributes.forEach((attribute) => {
      if (attribute.vertexAttribute) {
        attribute.vertexAttribute.destroy();
      }
    });

    this.attributesAndIndices?.elements.destroy();
    this.attributes = [];
  }
}
