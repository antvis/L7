import { IEncodeFeature, IVertexAttributeDescriptor } from '@antv/l7-core';

function encodePickingColor(featureIdx: number) {
  return [
    (featureIdx + 1) & 255,
    ((featureIdx + 1) >> 8) & 255,
    (((featureIdx + 1) >> 8) >> 8) & 255,
  ];
}

function isNumber(n: any) {
  return typeof n === 'number';
}

function calculateCentroid(coord: any) {
  if (isNumber(coord[0])) {
    return coord;
  } else if (isNumber(coord[0][0])) {
    throw new Error('当前数据不支持标注');
  } else if (isNumber(coord[0][0][0])) {
    const coords = coord;
    let xSum = 0;
    let ySum = 0;
    let len = 0;
    coords.forEach((coor: any) => {
      coor.forEach((pos: any) => {
        xSum += pos[0];
        ySum += pos[1];
        len++;
      });
    });
    return [xSum / len, ySum / len, 0];
  } else {
    throw new Error('当前数据不支持标注');
  }
}

export const pointFill = async ({
  descriptors,
  features,
  enablePicking,
}: {
  descriptors: IVertexAttributeDescriptor[];
  features: IEncodeFeature[];
  enablePicking: boolean;
}) => {
  const updateFuncs = {
    // fixed func
    a_Color: (feature: IEncodeFeature, featureIdx: number) => {
      const { color } = feature;
      return !color || !color.length ? [1, 1, 1, 1] : color;
    },

    a_Position: (
      feature: IEncodeFeature,
      featureIdx: number,
      vertex: number[],
    ) => {
      return vertex.length === 2
        ? [vertex[0], vertex[1], 0]
        : [vertex[0], vertex[1], vertex[2]];
    },
    filter: (feature: IEncodeFeature, featureIdx: number) => {
      const { filter } = feature;
      return filter ? [1] : [0];
    },
    a_vertexId: (
      feature: IEncodeFeature,
      featureIdx: number,
      vertex: number[],
      attributeIdx: number,
    ) => {
      return [featureIdx];
    },
    a_PickingColor: (feature: IEncodeFeature, featureIdx: number) => {
      const { id } = feature;
      return enablePicking ? encodePickingColor(id as number) : [0, 0, 0];
    },
    a_Shape: (
      feature: IEncodeFeature,
      featureIdx: number,
      vertex: number[],
      attributeIdx: number,
    ) => {
      const { shape = 2 } = feature;
      // var shape2d = this.layer.getLayerConfig().shape2d as string[];
      const shape2d = [
        'circle',
        'triangle',
        'square',
        'pentagon',
        'hexagon',
        'octogon',
        'hexagram',
        'rhombus',
        'vesica',
      ];
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
    a_Size: (
      feature: IEncodeFeature,
      featureIdx: number,
      vertex: number,
      attributeIdx: number[],
    ) => {
      const { size: pointSize = 5 } = feature;
      return Array.isArray(pointSize) ? [pointSize[0]] : [pointSize];
    },
  };
  // triangle
  function triangulation(feature: IEncodeFeature) {
    const coordinates = calculateCentroid(feature.coordinates);
    return {
      vertices: [
        ...coordinates,
        ...coordinates,
        ...coordinates,
        ...coordinates,
      ],
      indices: [0, 1, 2, 2, 3, 0],
      size: coordinates.length,
    };
  }

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
    // console.log('**', descriptors)
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

      descriptors.forEach((descriptor, attributeIdx: number) => {
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
