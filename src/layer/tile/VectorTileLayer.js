import TileLayer from './tileLayer';
import VectorTile from './vectorTile';
export default class VectorTileLayer extends TileLayer {
  _createTile(key, layer) {
    return new VectorTile(key, this.url, layer);
  }
}
