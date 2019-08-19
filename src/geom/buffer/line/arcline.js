import BufferBase from '../buffer';
export default class ArcLineBuffer extends BufferBase {
  _buildFeatures() {
    const layerData = this.get('layerData');
    layerData.forEach((feature, index) => {
      this._calculateArc(feature, index);
    });
    this.hasPattern = layerData.some(layer => {
      return layer.pattern;
    });
  }
  _initAttributes() {
    super._initAttributes();
    this.attributes.instanceArray = new Float32Array(this.verticesCount * 4);
  }
  _calculateArc(feature, offset) {
    const { segNum = 30 } = this.get('style');
    const { coordinates } = feature;
    for (let i = 0; i < segNum; i++) {
      this.attributes.positions.set([ i, 1, i, i, -1, i ], offset * segNum * 6 + i * 6);
      this.attributes.instanceArray.set([ coordinates[0][0], coordinates[0][1], coordinates[1][0], coordinates[1][1],
        coordinates[0][0], coordinates[0][1], coordinates[1][0], coordinates[1][1] ], offset * segNum * 8 + i * 8);
      if (i !== segNum - 1) {
        const indexArray = [ 0, 1, 2, 1, 3, 2 ].map(v => { return offset * segNum * 2 + i * 2 + v; });
        this.indexArray.set(indexArray, offset * segNum * 6 + i * 6 - offset * 6);
      }
    }
    feature.bufferInfo = { verticesOffset: offset * segNum * 2 };
    this._encodeArray(feature, segNum * 2);

  }
  _calculateFeatures() {
    const layerData = this.get('layerData');
    const segNum = this.get('segNum') || 30;
    this.verticesCount = layerData.length * segNum * 2;
    this.indexCount = this.verticesCount * 3 - layerData.length * 6;
  }
}
