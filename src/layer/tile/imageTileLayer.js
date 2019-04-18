import TileLayer from './tileLayer';
import ImageTile from './imageTile';

export default class ImageTileLayer extends TileLayer {
  _createTile(key, layer) {
    return new ImageTile(key, this.url, layer);
  }

}
