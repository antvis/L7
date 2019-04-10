// import * as THREE from '../../core/three';
// import Tile from './tile';
// export default class ImageTile extends Tile {
//   constructor(layer, z, x, y) {

//   }
//   requestTileAsync() {
//     // Making this asynchronous really speeds up the LOD framerate
//     setTimeout(() => {
//       if (!this._mesh) {
//         this._mesh = this._createMesh();
//         this._requestTile();
//       }
//     }, 0);
//   }
//   _requestTile() {
//     const urlParams = {
//       x: this._tile[0],
//       y: this._tile[1],
//       z: this._tile[2]
//     };

//     const url = this._getTileURL(urlParams);

//     const image = document.createElement('img');

//     image.addEventListener('load', event => {
//       const texture = new THREE.Texture();

//       texture.image = image;
//       texture.needsUpdate = true;

//       // Silky smooth images when tilted
//       texture.magFilter = THREE.LinearFilter;
//       texture.minFilter = THREE.LinearMipMapLinearFilter;

//       // TODO: Set this to renderer.getMaxAnisotropy() / 4
//       texture.anisotropy = 4;

//       texture.needsUpdate = true;

//       // Something went wrong and the tile or its material is missing
//       //
//       // Possibly removed by the cache before the image loaded
//       if (!this._mesh || !this._mesh.children[0] || !this._mesh.children[0].material) {
//         return;
//       }

//       this._mesh.children[0].material.map = texture;
//       this._mesh.children[0].material.needsUpdate = true;

//       this._texture = texture;
//       this._ready = true;
//     }, false);

//     // image.addEventListener('progress', event => {}, false);
//     // image.addEventListener('error', event => {}, false);

//     image.crossOrigin = '';

//     // Load image
//     image.src = url;

//     this._image = image;
//   }

//   _createMesh() {
//     // Something went wrong and the tile
//     //
//     // Possibly removed by the cache before loaded
//     if (!this._center) {
//       return;
//     }

//     const mesh = new THREE.Object3D();
//     const geom = new THREE.PlaneBufferGeometry(this._side, this._side, 1);

//     let material;
//     if (!this._world._environment._skybox) {
//       material = new THREE.MeshBasicMaterial({
//         depthWrite: false
//       });

//       // const material = new THREE.MeshPhongMaterial({
//       //   depthWrite: false
//       // });
//     } else {
//       // Other MeshStandardMaterial settings
//       //
//       // material.envMapIntensity will change the amount of colour reflected(?)
//       // from the environment map–can be greater than 1 for more intensity

//       material = new THREE.MeshStandardMaterial({
//         depthWrite: false
//       });
//       material.roughness = 1;
//       material.metalness = 0.1;
//       material.envMap = this._world._environment._skybox.getRenderTarget();
//     }

//     const localMesh = new THREE.Mesh(geom, material);
//     localMesh.rotation.x = -90 * Math.PI / 180;

//     localMesh.receiveShadow = true;

//     mesh.add(localMesh);
//     mesh.renderOrder = 0.1;

//     mesh.position.x = this._center[0];
//     mesh.position.z = this._center[1];

//     // const box = new BoxHelper(localMesh);
//     // mesh.add(box);
//     //
//     // mesh.add(this._createDebugMesh());

//     return mesh;
//   }
//   _abortRequest() {
//     if (!this._image) {
//       return;
//     }

//     this._image.src = '';
//   }

//   destroy() {
//     // Cancel any pending requests
//     this._abortRequest();

//     // Clear image reference
//     this._image = null;

//     super.destroy();
//   }

// }
