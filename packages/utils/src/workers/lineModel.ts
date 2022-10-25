import { encodePickingColor } from '../color';
import { a_Color, a_filter, a_Position, a_vertexId } from './commonFeatureFunc';
import { IEncodeFeature, IVertexAttributeDescriptor } from './interface';
import { LineTriangulation as triangulation } from './triangulation';

export const lineModel = async ({
  descriptors,
  features,
  enablePicking,
  iconMap,
}: {
  descriptors: IVertexAttributeDescriptor[];
  features: IEncodeFeature[];
  enablePicking: boolean;
  iconMap: any;
}) => {
  const updateFuncs = {
    // fixed feature func
    a_Color,
    a_Position,
    filter: a_filter,
    a_vertexId,
    a_PickingColor: (feature: IEncodeFeature) => {
      const { id } = feature;
      return enablePicking ? encodePickingColor(id as number) : [0, 0, 0];
    },

    // pointFill feature func
    a_DistanceAndIndex: (
      feature: IEncodeFeature,
      featureIdx: number,
      vertex: number[],
      attributeIdx: number,
      normal: number[],
      vertexIndex?: number,
    ) => {
      return vertexIndex === undefined
        ? [vertex[3], 10]
        : [vertex[3], vertexIndex];
    },
    a_Total_Distance: (
      feature: IEncodeFeature,
      featureIdx: number,
      vertex: number[],
    ) => {
      return [vertex[5]];
    },
    a_Size: (feature: IEncodeFeature) => {
      const { size: pointSize = 1 } = feature;
      return Array.isArray(pointSize)
        ? [pointSize[0], pointSize[1]]
        : [pointSize as number, 0];
    },
    a_Normal: (
      feature: IEncodeFeature,
      featureIdx: number,
      vertex: number[],
      attributeIdx: number,
      normal: number[],
    ) => {
      return normal;
    },
    a_Miter: (
      feature: IEncodeFeature,
      featureIdx: number,
      vertex: number[],
    ) => {
      return [vertex[4]];
    },
    a_iconMapUV: (feature: IEncodeFeature) => {
      const { texture } = feature;
      const { x, y } = iconMap[texture as string] || { x: 0, y: 0 };
      return [x, y];
    },
  };

  const featureLayout: {
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

  let verticesNum = 0;
  const indices: number[] = [];
  let size = 3;
  features.forEach((feature: IEncodeFeature, featureIdx: number) => {
    const {
      indices: indicesForCurrentFeature,
      vertices: verticesForCurrentFeature,
      // @ts-ignore
      normals: normalsForCurrentFeature,
      size: vertexSize,
      // @ts-ignore
      indexes,
    } = triangulation(feature);
    indicesForCurrentFeature.forEach((i) => {
      indices.push(i + verticesNum);
    });
    size = vertexSize;
    const verticesNumForCurrentFeature =
      verticesForCurrentFeature.length / vertexSize;

    featureLayout.sizePerElement = size;

    featureLayout.elements.push({
      featureIdx,
      vertices: verticesForCurrentFeature,
      normals: normalsForCurrentFeature,
      offset: verticesNum,
    });

    verticesNum += verticesNumForCurrentFeature;
    for (
      let vertexIdx = 0;
      vertexIdx < verticesNumForCurrentFeature;
      vertexIdx++
    ) {
      const normal =
        normalsForCurrentFeature?.slice(vertexIdx * 3, vertexIdx * 3 + 3) || [];
      const vertice = verticesForCurrentFeature.slice(
        vertexIdx * vertexSize,
        vertexIdx * vertexSize + vertexSize,
      );

      let vertexIndex = 0;
      if (indexes && indexes[vertexIdx] !== undefined) {
        vertexIndex = indexes[vertexIdx];
      }

      descriptors.forEach((descriptor) => {
        // @ts-ignore
        if (descriptor && updateFuncs[descriptor.name]) {
          // @ts-ignore
          descriptor.buffer.data.push(
            // @ts-ignore
            ...updateFuncs[descriptor.name](
              feature,
              featureIdx,
              vertice,
              vertexIdx,
              normal,
              vertexIndex,
            ),
          );
        }
      });
    }
  });

  return {
    descriptors,
    featureLayout,
    indices,
  };
};
