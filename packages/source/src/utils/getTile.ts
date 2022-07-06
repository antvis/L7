import {
  getImage,
  getTiffImage,
  getURLFromTemplate,
  Tile,
  TileLoadParams,
} from '@antv/l7-utils';

/**
 * 用于获取 raster data 的瓦片，如 tiff、lerc、dem 等
 * @param url
 * @param tileParams
 * @param tile
 * @param rasterParser
 * @returns
 */
export const getTileBuffer = async (
  url: string | string[],
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

export const getTileImage = async (
  url: string | string[],
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

export const defaultFormat = () => {
  return {
    rasterData: new Uint8Array([0]),
    width: 1,
    height: 1,
  };
};
