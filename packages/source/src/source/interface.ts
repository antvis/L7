import { VectorTileLayer } from '@mapbox/vector-tile';
import { Feature } from '@turf/helpers';
export interface ITileSource {
  getTileData(layer: string): any;
}

export type MapboxVectorTile = {
  layers: { [_: string]: VectorTileLayer & { features: Feature[] } };
};
