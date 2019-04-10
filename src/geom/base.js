
export const GeomBase = {
  color: 'updateDraw',
  size: 'repaint',
  filter: 'updateDraw',
  layer: '',
  pickable: true,
  setLayer(layer) {
    this.layer = layer;
    this.style = layer.get('styleOption');
  },
  getShape(type) {
    return type;
  },
  draw() {
    const shape = this.getShape();
    this.Mesh = shape.Mesh();
  },
  // 更新geometry buffer;
  updateDraw() {

  },
  repaint() {

  }
};
export const shapeBae = {
  geometryBuffer() {
  },

  geometry() {},

  material() {},

  mesh() {

  }
};
