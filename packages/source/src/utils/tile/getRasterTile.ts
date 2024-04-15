import type { ITileParserCFG } from '@antv/l7-core';
import type { ITileBand, SourceTile, TileLoadParams } from '@antv/l7-utils';
import { getImage, getURLFromTemplate, getWMTSURLFromTemplate } from '@antv/l7-utils';
import { getRasterFile } from './getRasterData';
import { getTileUrl } from './request';

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
  cfg: Partial<ITileParserCFG>,
): Promise<HTMLImageElement | ImageBitmap> => {
  const { format = defaultFormat, operation, requestParameters = {} } = cfg;
  const reqParams = {
    ...requestParameters,
    url: getTileUrl(url, tileParams), // getTileUrl 将原始的 url 路径进行转化（多服务器）
  };

  return new Promise((resolve, reject) => {
    getRasterFile(
      tile,
      reqParams,
      (err: any, img: any) => {
        if (err) {
          reject(err);
        } else if (img) {
          resolve(img);
        }
      },
      format,
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
  cfg: Partial<ITileParserCFG>,
): Promise<HTMLImageElement | ImageBitmap> => {
  // TODO: 后续考虑支持加载多服务
  let imageUrl: string;
  const templateUrl = Array.isArray(url) ? url[0] : url;
  if (cfg.wmtsOptions) {
    const getWMTSURLFromTemplateNew = cfg?.getURLFromTemplate || getWMTSURLFromTemplate;
    imageUrl = getWMTSURLFromTemplateNew(templateUrl, {
      ...tileParams,
      ...cfg.wmtsOptions,
    });
  } else {
    const getURLFromTemplateNew = cfg?.getURLFromTemplate || getURLFromTemplate;
    imageUrl = getURLFromTemplateNew(templateUrl, tileParams);
  }

  return new Promise((resolve, reject) => {
    const xhr = getImage(
      {
        ...cfg?.requestParameters,
        url: imageUrl,
        type: cfg?.requestParameters?.type || 'arrayBuffer',
      },
      (err, img) => {
        if (err) {
          reject(err);
        } else if (img) {
          resolve(img);
        }
      },
      cfg.transformResponse,
    );
    tile.xhrCancel = () => xhr.cancel();
  });
};

export const defaultFormat = () => {
  return {
    rasterData: new Uint8Array([0]),
    width: 1,
    height: 1,
  };
};
