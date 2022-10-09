import {
  getImage,
  makeXMLHttpRequestPromise,
  ResponseCallback,
  IRasterParser,
  arrayBufferToTiffImage,
  RequestParameters,
  getArrayBuffer,
  getURLFromTemplate,
  Tile,
  TileLoadParams,
} from '@antv/l7-utils';

/**
 * 用于获取 raster data 的瓦片，如 tiff、lerc、dem 等
 * 支持多文件模式
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
  rasterParser: (imageData: ArrayBuffer) => Promise<IRasterParser>,
): Promise<HTMLImageElement | ImageBitmap> => {
  const requestParameters = {
    url: getTileUrl(url, tileParams),
  };

  return new Promise((resolve, reject) => {
    getTiffImage(
      tile,
      requestParameters,
      (err, img) => {
        if (err) {
          reject(err);
        } else if (img) {
          resolve(img);
        }
      },
      rasterParser,
    );
  });
};

const getTiffImage = async (
  tile: Tile,
  requestParameters: RequestParameters,
  callback: ResponseCallback<HTMLImageElement | ImageBitmap | null>,
  rasterParser: any,
) => {
  if (Array.isArray(requestParameters.url)) {
    const imageDataList = [];
    const xhrList: any[] = [];
    const errList = [];
    const urls = requestParameters.url;

    for (let i = 0; i < urls.length; i++) {
      const params = {
        ...requestParameters,
        url: urls[i],
      };
      const { err, data, xhr } = await makeXMLHttpRequestPromise({
        ...params,
        type: 'arrayBuffer',
      });
      if (err) {
        errList.push(err);
      }
      xhrList.push(xhr);
      imageDataList.push(data);
    }
    setTileXHRCancelFunc(tile, xhrList);

    if (errList.length > 0) {
      callback(errList as Error[], null);
      return;
    }

    const { rasterData, width, height } = await rasterParser(imageDataList);
    const defaultMIN = 0;
    const defaultMAX = 8000;
    callback(null, {
      // @ts-ignore
      data: rasterData,
      width,
      height,
      min: defaultMIN,
      max: defaultMAX,
    });
  } else {
    const xhr = getArrayBuffer(requestParameters, (err, imgData) => {
      if (err) {
        callback(err);
      } else if (imgData) {
        arrayBufferToTiffImage(imgData, callback, rasterParser);
      }
    });
    setTileXHRCancelFunc(tile, [xhr]);
  }
};

function setTileXHRCancelFunc(tile: Tile, xhrList: any[]) {
  tile.xhrCancel = () => {
    xhrList.map((xhr) => {
      xhr.abort();
    });
  };
}

function getTileUrl(url: string | string[], tileParams: TileLoadParams) {
  if (Array.isArray(url)) {
    return url.map((src) => getURLFromTemplate(src, tileParams));
  } else {
    return getURLFromTemplate(url, tileParams);
  }
}

export const getTileImage = async (
  url: string | string[],
  tileParams: TileLoadParams,
  tile: Tile,
  responseType?: 'string' | 'json' | 'arrayBuffer',
): Promise<HTMLImageElement | ImageBitmap> => {
  // TODO: 后续考虑支持加载多服务
  const imgUrl = getURLFromTemplate(
    Array.isArray(url) ? url[0] : url,
    tileParams,
  );

  return new Promise((resolve, reject) => {
    const xhr = getImage({ url: imgUrl, type: responseType }, (err, img) => {
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
