import { Tile, TilesetManagerOptions } from '@antv/l7-utils';
import { VectorTileLayer } from '@mapbox/vector-tile';
import { Feature } from '@turf/helpers';
import { IParserData, ITileParserCFG } from '../interface';

const DEFAULT_CONFIG: Partial<TilesetManagerOptions> = {
  tileSize: 256,
  minZoom: 0,
  maxZoom: Infinity,
  zoomOffset: 0,
};

export type MapboxVectorTile = {
  layers: { [_: string]: VectorTileLayer & { features: Feature[] } };
};

const getVectorTile = async (tile: Tile): Promise<MapboxVectorTile> => {
  return new Promise((resolve) => {
    const [minLng, minLat, maxLng, maxLat] = tile.bounds;
    // minLng/maxLat ---- maxLng/maxLat
    // |                    |
    // |                    |
    // |                    |
    // minLng/minLat --- maxLng/minLat

    const vectorTile = {
      layers: {
        // Tip: fixed SourceLayer Name
        testTile: ({
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
        } as unknown) as VectorTileLayer & {
          features: Feature[];
        },
      },
    } as MapboxVectorTile;

    resolve(vectorTile);
  });
};

export default function mapboxVectorTile(
  data: string | string[],
  cfg?: ITileParserCFG,
): IParserData {
  const getTileData = (tile: Tile) => getVectorTile(tile);
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
