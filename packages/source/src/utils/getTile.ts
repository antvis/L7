import {
  getImage,
  makeXMLHttpRequestPromise,
  ResponseCallback,
  IRasterParser,
  arrayBufferToTiffImage,
  RequestParameters,
  getArrayBuffer,
  getURLFromTemplate,
  getMultiURLFromTemplate,
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
  rasterParser: (imageData: ArrayBuffer) => Promise<IRasterParser>,
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

export const getMultiTileBuffer = async (
  url: string[],
  tileParams: TileLoadParams,
  tile: Tile,
  rasterParser: (
    imageData: ArrayBuffer | ArrayBuffer[],
  ) => Promise<IRasterParser>,
): Promise<HTMLImageElement | ImageBitmap> => {
  const imgMultiUrls = getMultiURLFromTemplate(url, tileParams);

  return new Promise((resolve, reject) => {
    getMultiTiffImage(
      { url: imgMultiUrls }, // requestParameters
      (err, img) => {
        // callback
        if (err) {
          reject(err);
        } else if (img) {
          resolve(img);
        }
      },
      rasterParser, // rasterParser
      tile,
    );
  });
};

export const getMultiTiffImage = async (
  requestParameters: RequestParameters,
  callback: (err?: Error[] | null, image?: any) => void,
  rasterParser: (
    imageData: ArrayBuffer | ArrayBuffer[],
  ) => Promise<IRasterParser>,
  tile: Tile,
) => {
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
  tile.xhrCancel = () => {
    xhrList.map((xhr) => {
      xhr.abort();
    });
  };
  if (errList.length > 0) {
    callback(errList, null);
    return;
  }

  const { rasterData, width, height } = await rasterParser(imageDataList);
  const defaultMIN = 0;
  const defaultMAX = 8000;
  callback(null, {
    data: rasterData,
    width,
    height,
    min: defaultMIN,
    max: defaultMAX,
  });
};

const getTiffImage = (
  requestParameters: RequestParameters,
  callback: ResponseCallback<HTMLImageElement | ImageBitmap | null>,
  rasterParser: any,
) => {
  return getArrayBuffer(requestParameters, (err, imgData) => {
    if (err) {
      callback(err);
    } else if (imgData) {
      arrayBufferToTiffImage(imgData, callback, rasterParser);
    }
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
