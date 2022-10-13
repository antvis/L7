import { encodePickingColor } from '../color';
import { a_Color, a_filter, a_Position, a_vertexId } from './commonFeatureFunc';
import { IEncodeFeature, IVertexAttributeDescriptor } from './interface';
import { polygonFillTriangulation as triangulation } from './triangulation';

export const polygonFillModel = async ({
  descriptors,
  features,
  enablePicking,
}: {
  descriptors: IVertexAttributeDescriptor[];
  features: IEncodeFeature[];
  enablePicking: boolean;
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

    // polygonFill feature func
    // empty
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
