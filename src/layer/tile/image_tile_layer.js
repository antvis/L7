import TileLayer from './tile_layer';
import ImageTile from './image_tile';

export default class ImageTileLayer extends TileLayer {
  constructor(scene, cfg) {
    super(scene, cfg);
    this.type = 'image';
  }
  _createTile(key, layer) {
    return new ImageTile(key, this.url, layer);
  }
}
