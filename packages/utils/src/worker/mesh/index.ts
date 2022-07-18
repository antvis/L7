import { getTriangulation } from '../../triangulation';
import { IModelType, IWorkOptions } from '../interface';
import { encodePickingColor, utils } from './common';

const meshTask = `
    ${utils}

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
  const { modelType, attributesUpdateFunctions } = options;
  // get triangulation
  const triangulation = getTriangulation(modelType);

  const customFuncs = `
  a_Shape: ( feature, featureIdx, vertex, attributeIdx ) => {
    var { shape = 2 } = feature;
    // var shape2d = this.layer.getLayerConfig().shape2d as string[];
    var shape2d = ['circle', 'triangle', 'square', 'pentagon', 'hexagon', 'octogon', 'hexagram', 'rhombus', 'vesica'];
    var shapeIndex = shape2d.indexOf(shape);
    return [shapeIndex];
  },


  a_Extrude: ( feature, featureIdx, vertex, attributeIdx ) => {
    let extrude = [1, 1, 0, -1, 1, 0, -1, -1, 0, 1, -1, 0];
    var extrudeIndex = (attributeIdx % 4) * 3;
    return [
      extrude[extrudeIndex],
      extrude[extrudeIndex + 1],
      extrude[extrudeIndex + 2],
    ];
  },

  a_Size: ( feature, featureIdx, vertex, attributeIdx ) => {
    var { size = 5 } = feature;
    return Array.isArray(size) ? [size[0]] : [size];
  },
  `;

  const triangulationStr = `
  function triangulation(feature) {
    var coordinates = calculateCentroid(feature.coordinates);
    return {
      vertices: [...coordinates, ...coordinates, ...coordinates, ...coordinates],
      indices: [0, 1, 2, 2, 3, 0],
      size: coordinates.length,
    };
  }
  `;

  return meshTask
    .replace('$customFuncs$', customFuncs)
    .replace('$triangulation$', triangulationStr);
}
