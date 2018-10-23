class Geometry extends BufferGeometry {
  constructor() {
    super();
  }
  updateAttribute(name, startIndex, size, value) {
    const attribute = this.attributes[name];
    for (let i = 0; i < size; i++) {
      attribute.array[startIndex + i] = value[i];
    }
  }
}
