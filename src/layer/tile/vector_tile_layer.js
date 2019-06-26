import TileLayer from './tile_layer';
import VectorTile from './vector_tile';
export default class VectorTileLayer extends TileLayer {
  _createTile(key, layer) {
    return new VectorTile(key, this.url, layer);
  }
}
