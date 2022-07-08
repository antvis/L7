import { IMeshType, IWorkOptions } from '../interface';
import { encodePickingColor, utils } from './common';
import {
  customFuncs as PointFillCustomFincs,
  params as PointFillParams,
  setValues as PointFillSetValues,
  triangulation as PointFillTriangulation,
} from './pointLayer/fill';

const MeshList = {
  PointFill: {
    customFuncs: PointFillCustomFincs,
    triangulation: PointFillTriangulation,
    params: PointFillParams, // 参数
    setValues: PointFillSetValues,
  },
};

const meshTask = `
    ${utils}
    // Mesh params
    $params$

    // encode picking color
    ${encodePickingColor}

    // arrtibute 固定方法
    var updateFuncs = {
      // fixed func
      a_Color: (feature, featureIdx) => {
        const { color } = feature;
        return !color || !color.length ? [1, 1, 1, 1] : color;
      },

      a_Position: (feature, featureIdx, vertex ) => {
        return vertex.length === 2
          ? [vertex[0], vertex[1], 0]
          : [vertex[0], vertex[1], vertex[2]];
      },

      filter: (feature, featureIdx) => {
        const { filter } = feature;
        return filter ? [1] : [0];
      },

      a_vertexId: ( feature, featureIdx, vertex, attributeIdx ) => {
        return [featureIdx];
      },
      a_PickingColor: (feature, featureIdx) => {
        var { id } = feature;
        var enablePicking = true;
        return enablePicking ? encodePickingColor(id) : [0, 0, 0];
      },

      // custom func
      $customFuncs$
    }
    // triangle
    $triangulation$

    self.addEventListener('message', function (e) {
      var data = JSON.parse(e.data);
      var descriptors = data.descriptors;
      var features = data.features;
      var segmentNumber = data.segmentNumber;
      var featureLayout = {
        sizePerElement: 0,
        elements: [],
      };

      enablePicking = data.enablePicking;

      $setValues$

      var verticesNum = 0;
      var indices = [];
      var size = 3;
      features.forEach((feature, featureIdx) => {
        var {
          indices: indicesForCurrentFeature,
          vertices: verticesForCurrentFeature,
          normals: normalsForCurrentFeature,
          size: vertexSize,
          indexes,
        } = triangulation(feature, segmentNumber);
        indicesForCurrentFeature.forEach((i) => {
          indices.push(i + verticesNum);
        });
        size = vertexSize;
        var verticesNumForCurrentFeature = verticesForCurrentFeature.length / vertexSize;
  
        featureLayout.sizePerElement = size;
        featureLayout.elements.push({
          featureIdx,
          vertices: verticesForCurrentFeature,
          normals: normalsForCurrentFeature,
          offset: verticesNum,
        });
  
        verticesNum += verticesNumForCurrentFeature;
        for ( var vertexIdx = 0; vertexIdx < verticesNumForCurrentFeature; vertexIdx++ ) {
          var normal = normalsForCurrentFeature?.slice(vertexIdx * 3, vertexIdx * 3 + 3) || [];
          var vertice = verticesForCurrentFeature.slice(
            vertexIdx * vertexSize,
            vertexIdx * vertexSize + vertexSize,
          );
  
          var vertexIndex = 0;
          if (indexes && indexes[vertexIdx] !== undefined) {
            vertexIndex = indexes[vertexIdx];
          }
  
          descriptors.forEach((descriptor, attributeIdx) => {
            if (descriptor && updateFuncs[descriptor.name]) {
              (descriptor.buffer.data).push(
                ...updateFuncs[descriptor.name](
                  feature,
                  featureIdx,
                  vertice,
                  vertexIdx,
                  normal,
                  vertexIndex,
                )
              );
            };
          });
        };
      });
      self.postMessage({
        descriptors,
        featureLayout,
        indices
      })
    }, false);
`;

export default function getMeshTask(options: IWorkOptions) {
  const { meshType } = options;
  return meshTask
    .replace('$customFuncs$', MeshList[meshType].customFuncs)
    .replace('$triangulation$', MeshList[meshType].triangulation)
    .replace('$params$', MeshList[meshType].params)
    .replace('$setValues$', MeshList[meshType].setValues);
}
