import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { gl } from '../renderer/gl';
import { IAttribute } from '../renderer/IAttribute';
import { IElements } from '../renderer/IElements';
import { IRendererService } from '../renderer/IRendererService';
import { IParseDataItem } from '../source/ISourceService';
import { ILayer } from './ILayerService';
import {
  IEncodeFeature,
  IStyleAttribute,
  IStyleAttributeInitializationOptions,
  IStyleAttributeService,
  IStyleAttributeUpdateOptions,
  IVertexAttributeDescriptor,
  Triangulation,
} from './IStyleAttributeService';
import StyleAttribute from './StyleAttribute';

const bytesPerElementMap = {
  [gl.FLOAT]: 4,
  [gl.UNSIGNED_BYTE]: 1,
  [gl.UNSIGNED_SHORT]: 2,
};

let counter = 0;

/**
 * 每个 Layer 都拥有一个，用于管理样式属性的注册和更新
 */
@injectable()
export default class StyleAttributeService implements IStyleAttributeService {
  @inject(TYPES.IRendererService)
  private readonly rendererService: IRendererService;

  private attributes: IStyleAttribute[] = [];

  private c = counter++;

  private featureLayout: {
    sizePerElement: number;
    elements: Array<{
      featureIdx: number;
      vertices: number[];
      normals: number[];
      offset: number;
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
  ): {
    attributes: {
      [attributeName: string]: IAttribute;
    };
    elements: IElements;
  } {
    const descriptors = this.attributes.map((attr) => attr.descriptor);
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
      } = triangulation(feature);
      indices.push(...indicesForCurrentFeature.map((i) => i + verticesNum));
      vertices.push(...verticesForCurrentFeature);
      if (normalsForCurrentFeature) {
        normals.push(...normalsForCurrentFeature);
      }
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
        descriptors.forEach((descriptor, attributeIdx) => {
          if (descriptor && descriptor.update) {
            const normal =
              normalsForCurrentFeature?.slice(
                vertexIdx * 3,
                vertexIdx * 3 + 3,
              ) || [];
            (descriptor.buffer.data as number[]).push(
              ...descriptor.update(
                feature,
                featureIdx,
                verticesForCurrentFeature.slice(
                  vertexIdx * vertexSize,
                  vertexIdx * vertexSize + vertexSize,
                ),
                vertexIdx, // 当前顶点所在feature索引
                normal,
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

    return {
      attributes,
      elements,
    };
  }

  public clearAllAttributes() {
    // 销毁关联的 vertex attribute buffer objects
    this.attributes.forEach((attribute) => {
      if (attribute.vertexAttribute) {
        attribute.vertexAttribute.destroy();
      }
    });
    this.attributes = [];
  }
}
