export const customFuncs = `
a_Shape: ( feature, featureIdx, vertex, attributeIdx ) => {
  var { shape = 2 } = feature;
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

export const triangulation = `
function triangulation(feature) {
  var coordinates = calculateCentroid(feature.coordinates);
  return {
    vertices: [...coordinates, ...coordinates, ...coordinates, ...coordinates],
    indices: [0, 1, 2, 2, 3, 0],
    size: coordinates.length,
  };
}
`;

export const params = `
var shape2d = [];
`;

export const setValues = `
shape2d = data.shape2d;
`;
