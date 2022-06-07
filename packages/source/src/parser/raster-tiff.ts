import { getTiffImage } from '@antv/l7-utils';
import { IParserData, IRasterTileParserCFG } from '../interface';
import {
  getURLFromTemplate,
  Tile,
  TileLoadParams,
  TilesetManagerOptions,
} from '../tileset-manager';

const DEFAULT_CONFIG: Partial<TilesetManagerOptions> = {
  tileSize: 256,
  minZoom: 0,
  maxZoom: Infinity,
  zoomOffset: 0,
};

const getTiffData = async (
  url: string,
  tileParams: TileLoadParams,
  tile: Tile,
  rasterParser: any,
): Promise<HTMLImageElement | ImageBitmap> => {
  const imgUrl = getURLFromTemplate(url, tileParams);

  return new Promise((resolve, reject) => {
    const xhr = getTiffImage(
      { url: imgUrl },
      (err, img) => {
        if (err) {
          reject(err);
        } else if (img) {
          resolve(img);
        }
      },
      rasterParser,
    );
    tile.xhrCancel = () => xhr.abort();
  });
};

export default function rasterTiff(
  data: string,
  cfg?: IRasterTileParserCFG,
): IParserData {
  const getTileData = (tileParams: TileLoadParams, tile: Tile) => {
    const tiledata = getTiffData(data, tileParams, tile, cfg?.rasterParser);
    return tiledata;
  };
  const tilesetOptions = { ...DEFAULT_CONFIG, ...cfg, getTileData };

  return {
    data,
    dataArray: [],
    tilesetOptions,
    isTile: true,
  };
}
