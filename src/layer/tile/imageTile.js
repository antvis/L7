
import Tile from './tile';
import ImageBuffer from '../../geom/buffer/image';
import DrawImage from '../render/image/drawImage';
export default class ImageTile extends Tile {
  requestTileAsync() {
    // Making this asynchronous really speeds up the LOD framerate
    setTimeout(() => {
      if (!this._mesh) {
       // this._mesh = this._createMesh();
        this._requestTile();
      }
    }, 0);
  }
  _requestTile() {
    const urlParams = {
      x: this._tile[0],
      y: this._tile[1],
      z: this._tile[2]
    };

    const url = this._getTileURL(urlParams);
    const image = document.createElement('img');

    image.addEventListener('load', () => {
      this._isLoaded = true;
      this._createMesh(image);
      this._ready = true;
    }, false);

    // image.addEventListener('progress', event => {}, false);
    // image.addEventListener('error', event => {}, false);

    image.crossOrigin = '';

    // Load image
    image.src = url;

    this._image = image;
  }
  _getBufferData(images) {
    const NW = this._tileBounds.getTopLeft();
    const SE = this._tileBounds.getBottomRight();
    const coordinates = [[ NW.x, NW.y, 0 ], [ SE.x, SE.y, 0 ]];
    return [{
      coordinates,
      images
    }];
  }
  _createMesh(image) {
    if (!this._center) {
      return;
    }
    this._layerData = this._getBufferData(image);
    const buffer = new ImageBuffer({
      layerData: this._layerData
    });
    buffer.attributes.texture = buffer.texture;
    const style = this.layer.get('styleOptions');
    const mesh = DrawImage(buffer.attributes, style);
    this._object3D.add(mesh);
    return this._object3D;
  }
  _abortRequest() {
    if (!this._image) {
      return;
    }

    this._image.src = '';
  }

  destroy() {
    // Cancel any pending requests
    this._abortRequest();

    // Clear image reference
    this._image = null;

    super.destroy();
  }

}
