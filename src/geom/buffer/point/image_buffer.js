export default function ImageBuffer(layerData, opt) {
  const attributes = {
    vertices: [],
    colors: [],
    sizes: [],
    shapes: [],
    pickingIds: [],
    uv: []
  };
  layerData.forEach(item => {
    const { color = [ 0, 0, 0, 0 ], size, id, shape, coordinates } = item;
    const { x, y } = opt.imagePos[shape];
    attributes.vertices.push(...coordinates);
    attributes.colors.push(...color);
    attributes.pickingIds.push(id);
    attributes.sizes.push(size * window.devicePixelRatio); //
    attributes.uv.push(x, y);
    attributes.shapes.push(shape);
  });


  return attributes;
}
