import { encodePickingColor } from '../color';
import { a_Color, a_filter, a_Position, a_vertexId } from './commonFeatureFunc';
import { IEncodeFeature, IVertexAttributeDescriptor } from './interface';
import { PointFillTriangulation as triangulation } from './triangulation';

export const pointFillModel = async ({
  descriptors,
  features,
  enablePicking,
  shape2d,
}: {
  descriptors: IVertexAttributeDescriptor[];
  features: IEncodeFeature[];
  enablePicking: boolean;
  shape2d: string[];
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
    a_Shape: (feature: IEncodeFeature) => {
      const { shape = 2 } = feature;
      const shapeIndex = shape2d.indexOf(shape as string);
      return [shapeIndex];
    },
    a_Extrude: (
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
    a_Size: (feature: IEncodeFeature) => {
      const { size: pointSize = 5 } = feature;
      return Array.isArray(pointSize) ? [pointSize[0]] : [pointSize];
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
