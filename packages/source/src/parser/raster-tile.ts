import {
  getImage,
  getURLFromTemplate,
  Tile,
  TileLoadParams,
  TilesetManagerOptions,
} from '@antv/l7-utils';
import { IParserData, IRasterTileParserCFG } from '../interface';

const DEFAULT_CONFIG: Partial<TilesetManagerOptions> = {
  tileSize: 256,
  minZoom: 0,
  maxZoom: Infinity,
  zoomOffset: 0,
};

const getTileImage = async (
  url: string,
  tileParams: TileLoadParams,
  tile: Tile,
): Promise<HTMLImageElement | ImageBitmap> => {
  const imgUrl = getURLFromTemplate(url, tileParams);

  return new Promise((resolve, reject) => {
    const xhr = getImage({ url: imgUrl }, (err, img) => {
      if (err) {
        reject(err);
      } else if (img) {
        resolve(img);
      }
    });
    tile.xhrCancel = () => xhr.abort();
  });
};

export default function rasterTile(
  data: string,
  cfg?: IRasterTileParserCFG,
): IParserData {
  const getTileData = (tileParams: TileLoadParams, tile: Tile) =>
    getTileImage(data, tileParams, tile);
  const tilesetOptions = { ...DEFAULT_CONFIG, ...cfg, getTileData };

  return {
    data,
    dataArray: [],
    tilesetOptions,
  };
}
