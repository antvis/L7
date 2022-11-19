import { VectorTile } from '@mapbox/vector-tile';
import { Feature, Properties } from '@turf/helpers';
import Protobuf from 'pbf';
import { ITileSource } from '../interface';
export default class VectorSource implements ITileSource {
  private vectorTile: VectorTile;
  private vectorLayerCache: {
    [key: string]: Array<Feature<GeoJSON.Geometry, Properties>>;
  } = {};
  private x: number;
  private y: number;
  private z: number;

  constructor(data: ArrayBuffer, x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.vectorTile = new VectorTile(new Protobuf(data)) as VectorTile;
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

    // @ts-ignore
    if (Array.isArray(vectorTile.features)) {
      // 数据不需要被解析 geojson-vt 类型
      // @ts-ignore
      this.vectorLayerCache[sourceLayer] = vectorTile.features;
      // @ts-ignore
      return vectorTile.features;
    }

    const features: Array<Feature<GeoJSON.Geometry, Properties>> = [];
    for (let i = 0; i < vectorTile.length; i++) {
      const vectorTileFeature = vectorTile.feature(i);
      const feature = vectorTileFeature.toGeoJSON(this.x, this.y, this.z);

      features.push({
        ...feature,
        properties: {
          id: feature.id,
          ...feature.properties,
        },
      });
    }
    this.vectorLayerCache[sourceLayer] = features;
    return features;
  }
  public getFeatureById() {
    throw new Error('Method not implemented.');
  }
}
