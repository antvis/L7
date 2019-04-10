// const r2d = 180 / Math.PI;
// const tileURLRegex = /\{([zxy])\}/g;
// export class Tile {
//   constructor(layer, z, x, y) {
//     this.layer = layer;
//     this._tile = [ z, x, y ];

//   }
//   _createMesh() {}
//   _createDebugMesh() {}

//   _getTileURL(urlParams) {
//     if (!urlParams.s) {
//       // Default to a random choice of a, b or c
//       urlParams.s = String.fromCharCode(97 + Math.floor(Math.random() * 3));
//     }

//     tileURLRegex.lastIndex = 0;
//     return this._path.replace(tileURLRegex, function(value, key) {
//       // Replace with paramter, otherwise keep existing value
//       return urlParams[key];
//     });
//   }

//   _tileBoundsFromWGS84(boundsWGS84) {
//     const sw = this._layer._world.latLonToPoint(LatLon(boundsWGS84[1], boundsWGS84[0]));
//     const ne = this._layer._world.latLonToPoint(LatLon(boundsWGS84[3], boundsWGS84[2]));

//     return [sw.x, sw.y, ne.x, ne.y];
//   }

//   // Get tile bounds in WGS84 coordinates
//   _tileBoundsWGS84(tile) {
//     const e = this._tile2lon(tile[0] + 1, tile[2]);
//     const w = this._tile2lon(tile[0], tile[2]);
//     const s = this._tile2lat(tile[1] + 1, tile[2]);
//     const n = this._tile2lat(tile[1], tile[2]);
//     return [ w, s, e, n ];
//   }

//   _tile2lon(x, z) {
//     return x / Math.pow(2, z) * 360 - 180;
//   }

//   _tile2lat(y, z) {
//     const n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
//     return r2d * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
//   }

//   _boundsToCenter(bounds) {
//     const x = bounds[0] + (bounds[2] - bounds[0]) / 2;
//     const y = bounds[1] + (bounds[3] - bounds[1]) / 2;

//     return [ x, y ];
//   }
//   destory() {

//   }
// }
