import type { ITileSource, MapboxVectorTile } from '../interface';
export default class VectorSource implements ITileSource {
  private vectorTile: MapboxVectorTile;
  private vectorLayerCache: {
    [key: string]: Array<GeoJSON.Feature>;
  } = {};
  private x: number;
  private y: number;
  private z: number;

  constructor(vector: MapboxVectorTile, x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.vectorTile = vector;
  }

  public getTileData(sourceLayer: string) {
    if (!sourceLayer || !this.vectorTile.layers[sourceLayer]) {
      return [];
    }
    // 优先走缓存
    if (this.vectorLayerCache[sourceLayer]) {
      return this.vectorLayerCache[sourceLayer];
    }

    const vectorTile = this.vectorTile.layers[sourceLayer];

    return vectorTile.features;
  }
  public getFeatureById() {
    throw new Error('Method not implemented.');
  }
}
