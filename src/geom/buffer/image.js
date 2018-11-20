import BufferBase from './bufferBase';
import Util from '../../util';
import * as THREE from '../../core/three';

export default class ImageBuffer extends BufferBase {
  geometryBuffer() {
    const coordinates = this.get('coordinates');
    const images = this.get('image');
    const positions = [ ...coordinates[0],
      coordinates[1][0], coordinates[0][1], 0,
      ...coordinates[1],
      ...coordinates[0],
      ...coordinates[1],
      coordinates[0][0], coordinates[1][1], 0
    ];
    let image = images;
    if (Util.isArray(images)) {
      image = images[0];
      const textures = images.map(img => { return this._getTexture(img); });
      this.u_rasters = textures;
    }
    const uv = [ 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0 ];
    const texture = new THREE.Texture(image);
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    const attributes = {
      vertices: new Float32Array(positions),
      uvs: new Float32Array(uv)
    };
    this.attributes = attributes;
    this.texture = texture;

  }
  _getTexture(image) {
    const texture = new THREE.Texture(image);
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearFilter;


  }
}
