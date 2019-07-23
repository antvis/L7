import BufferBase from '../buffer';

export default class LineBuffer extends BufferBase {


  _buildFeatures() {
    const layerData = this.get('layerData');
    let offsetVertices = 0;
    let offsetIndex = 0;
    let offset = 0;
    layerData.forEach(feature => {
      const { coordinates } = feature;
      coordinates.forEach(coord => {
        const n = coord.length;
        feature.bufferInfo = {
          verticesOffset: offsetVertices
        };
        this._encodeArray(feature, n);
        for (let i = 0; i < n; i++) {
          this.attributes.positions[offsetVertices * 3] = coord[i][0];
          this.attributes.positions[offsetVertices * 3 + 1] = coord[i][1];
          this.attributes.positions[offsetVertices * 3 + 2] = coord[i][2];
          this.indexArray[offsetIndex * 2] = i + offset;
          this.indexArray[offsetIndex * 2 + 1] = i + offset + 1;
          if (i === n - 1) {
            this.indexArray[offsetIndex * 2 + 1] = offsetVertices - n + 1;
          }
          offsetVertices++;
          offsetIndex++;
        }
        offset += n;
      });
    });
  }

  _calculateBufferLength() {
    const layerData = this.get('layerData');
    layerData.forEach(feature => {
      const { coordinates } = feature;
      coordinates.forEach(coord => {
        this.verticesCount += coord.length;
        this.indexCount += (coord.length * 2 - 2);
      });
    });
  }

  _calculateFeatures() {
    const layerData = this.get('layerData');
    layerData.forEach(feature => {
      const { coordinates } = feature;
      coordinates.forEach(coord => {
        this.verticesCount += coord.length;
        this.indexCount += (coord.length * 2);
      });
    });
  }
  _calculateLine(feature) {
    let { indexOffset, verticesOffset } = feature.bufferInfo;
    feature.coordinates.forEach(coord => {
      const n = coord.length;
      this._encodeArray(feature, n);
      for (let i = 0; i < n; i++) {
        this.attributes.positions[(verticesOffset + i) * 3] = coord[i][0];
        this.attributes.positions[(verticesOffset + i) * 3 + 1] = coord[i][1];
        this.attributes.positions[(verticesOffset + i) * 3 + 2] = coord[i][2];
        this.indexArray[(indexOffset + i) * 2] = i + verticesOffset * 2;
        this.indexArray[(indexOffset + i) * 2 + 1] = i + verticesOffset * 2 + 1;
        if (i === n - 1) {
          this.indexArray[(indexOffset + i) * 2 + 1] = verticesOffset + 1;
        }

      }
      verticesOffset += n;
      indexOffset += n;
    });
  }
}
