import { getImage, getURLFromTemplate, TileLoadParams, TilesetManagerOptions } from '@antv/l7-utils';
import { IParserData, IRasterTileParserCFG } from '../interface';

const DEFAULT_CONFIG: Partial<TilesetManagerOptions> = {
  tileSize: 256,
  minZoom: 0,
  maxZoom: Infinity,
  zoomOffset: 0,
};

const getTileImage = async (
  url: string,
  tile: TileLoadParams,
): Promise<HTMLImageElement> => {
  const imgUrl = getURLFromTemplate(url, tile);

  return new Promise((resolve, reject) => {
    getImage({ url: imgUrl }, (err: any, img: HTMLImageElement) => {
      if (err) {
        reject(err);
      } else {
        resolve(img);
      }
    });
  });
};

export default function rasterTile(
  data: string,
  cfg?: IRasterTileParserCFG,
): IParserData {
  const getTileData = (tile: TileLoadParams) => getTileImage(data, tile);
  const tilesetOptions = { ...DEFAULT_CONFIG, ...cfg, getTileData };

  return {
    data,
    dataArray: [],
    tilesetOptions,
  };
}
