import {
  getImage,
  ITileBand,
  getURLFromTemplate,
  getWMTSURLFromTemplate,
  SourceTile,
  TileLoadParams,
} from '@antv/l7-utils';
import { getTileUrl } from './request';
import { ITileParserCFG } from '@antv/l7-core'
import { IRasterFormat, IBandsOperation } from '../../interface';
import { getRasterFile } from './getRasterData';

/**
 * 用于获取 raster data 的瓦片，如 tiff、lerc、dem 等
 * 支持多文件模式
 * @param url
 * @param tileParams
 * @param tile
 * @param rasterFormat
 * @returns
 */
export const getTileBuffer = async (
  url: string | string[] | ITileBand[],
  tileParams: TileLoadParams,
  tile: SourceTile,
  rasterFormat: IRasterFormat,
  operation?: IBandsOperation,
): Promise<HTMLImageElement | ImageBitmap> => {
  const requestParameters = {
    // getTileUrl 将原始的 url 路径进行转化（多服务器）
    url: getTileUrl(url, tileParams),
  };
  return new Promise((resolve, reject) => {
    getRasterFile(
      tile,
      requestParameters,
      (err, img) => {
        if (err) {
          reject(err);
        } else if (img) {
          resolve(img);
        }
      },
      rasterFormat,
      operation,
    );
  });
};
/**
 * 获取图片格式的文件 jpg、png 等
 * @param url 
 * @param tileParams 
 * @param tile 
 * @returns 
 */
export const getTileImage = async (
  url: string | string[],
  tileParams: TileLoadParams,
  tile: SourceTile,
  cfg: Partial<ITileParserCFG>
): Promise<HTMLImageElement | ImageBitmap> => {
  // TODO: 后续考虑支持加载多服务
  let imageUrl:string;
  const templateUrl = Array.isArray(url) ? url[0] : url;
  if(cfg.wmtsOptions) {
    imageUrl = getWMTSURLFromTemplate(templateUrl, {
       ...tileParams,
      ...cfg.wmtsOptions
    })
  } else {
    imageUrl = getURLFromTemplate(
      Array.isArray(url) ? url[0] : url,
      tileParams,
    );
  }

  return new Promise((resolve, reject) => {
    console.log(imageUrl);
    const xhr = getImage({ url: imageUrl }, (err, img) => {
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
