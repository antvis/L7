import { ITileParserCFG } from '@antv/l7-core';
import { SourceTile, TilesetManagerOptions } from '@antv/l7-utils';
import { VectorTileLayer } from '@mapbox/vector-tile';
import { Feature } from '@turf/helpers';
import { IParserData } from '../interface';

const DEFAULT_CONFIG: Partial<TilesetManagerOptions> = {
  tileSize: 256,
  minZoom: 0,
  maxZoom: Infinity,
  zoomOffset: 0,
};

export type MapboxVectorTile = {
  layers: { [_: string]: VectorTileLayer & { features: Feature[] } };
};

const getVectorTile = async (tile: SourceTile): Promise<MapboxVectorTile> => {
  return new Promise((resolve) => {
    const [minLng, minLat, maxLng, maxLat] = tile.bounds;
    // minLng/maxLat ---- maxLng/maxLat
    // |                    |
    // |                    |
    // |                    |
    // minLng/minLat --- maxLng/minLat

    const vectorTile: MapboxVectorTile = {
      layers: {
        // Tip: fixed SourceLayer Name
        testTile: {
          features: [
            {
              type: 'Feature',
              properties: {
                key: tile.x + '/' + tile.y + '/' + tile.z,
                textLng: (minLng + maxLng) / 2,
                textLat: (minLat + maxLat) / 2,
              },
              geometry: {
                type: 'LineString',
                coordinates: [
                  [maxLng, maxLat],
                  [maxLng, minLat],
                  [minLng, minLat],
                  [minLng, minLat],
                ],
              },
            },
          ],
        } as unknown as VectorTileLayer & {
          features: Feature[];
        },
      },
    };

    resolve(vectorTile);
  });
};

export default function mapboxVectorTile(
  data: string | string[],
  cfg?: ITileParserCFG,
): IParserData {
  const getTileData = (tile: SourceTile) => getVectorTile(tile);
  const tilesetOptions = {
    ...DEFAULT_CONFIG,
    ...cfg,
    getTileData,
  };

  return {
    data,
    dataArray: [],
    tilesetOptions,
    isTile: true,
  };
}
