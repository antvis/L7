import { IRasterFormat, IBandsOperation, IRasterFileData } from '../../interface';
import { getTileBandParams } from './band';
import { bandsOperation } from '../bandOperation/bands'
import {
    makeXMLHttpRequestPromise,
    ResponseCallback,
    ITileBand,
    RequestParameters,
    getArrayBuffer,
    Tile,
} from '@antv/l7-utils';

export const getRasterFile = async (
  tile: Tile,
  requestParameters: RequestParameters,
  callback: ResponseCallback<HTMLImageElement | ImageBitmap | null>,
  rasterFormat: IRasterFormat,
  operation?: IBandsOperation,
) => {
  // Tip: 至少存在一个请求文件的 url
  const tileBandParams = getTileBandParams(requestParameters.url);
  
  if(tileBandParams.length > 1) {// 同时请求多文件
    const { imageDataList, xhrList, errList } = await getMultiRasterFile(tileBandParams, requestParameters);
    setTileXHRCancelFunc(tile, xhrList);
    if (errList.length > 0) {
      callback(errList as Error[], null);
      return;
    }

    disposeRasterArrayBuffer(imageDataList, rasterFormat, operation, callback);
  } else {
    const xhr = getArrayBuffer(requestParameters, (err, imgData) => {
      if (err) {
        callback(err);
      } else if (imgData) {
        const imageDataList = [{
          data: imgData,
          bands: tileBandParams[0].bands
        }];
        disposeRasterArrayBuffer(imageDataList, rasterFormat, operation, callback);
      }
    });
    setTileXHRCancelFunc(tile, [xhr]);
  }
};

/**
 * get multi raster files async
 * @param tileBandParams 
 * @param requestParameters 
 * @returns 
 */
async function getMultiRasterFile(tileBandParams: ITileBand[], requestParameters: RequestParameters) {
  const imageDataList: IRasterFileData[] = [];
  const xhrList: any[] = [];
  const errList = [];

  for (let i = 0; i < tileBandParams.length; i++) {
    const tileBandParam = tileBandParams[i]
    const params = {
        ...requestParameters,
        url: tileBandParam.url,
    };
    
    const bands = tileBandParam.bands;
    const { err, data, xhr } = await makeXMLHttpRequestPromise({
        ...params,
        type: 'arrayBuffer',
    });
    if (err) {
        errList.push(err);
    }
    xhrList.push(xhr);
    imageDataList.push({
        data,
        bands,
    });
  }

  return { imageDataList, xhrList, errList }
}
  
/**
 * 处理每个请求得到的栅格文件数据
 */
async function disposeRasterArrayBuffer(
    imageDataList: IRasterFileData[], 
    rasterFormat: IRasterFormat, 
    operation: IBandsOperation | undefined, 
    callback: ResponseCallback<any>
) {
    const { rasterData, width, height } = await bandsOperation(imageDataList, rasterFormat, operation)
    const defaultMIN = 0;
    const defaultMAX = 8000;
    callback(null, {
      data: rasterData,
      width,
      height,
      min: defaultMIN,
      max: defaultMAX,
    });
  }
/**
 * 设置 tile 文件请求的取消函数
 * @param tile 
 * @param xhrList 
 */
function setTileXHRCancelFunc(tile: Tile, xhrList: any[]) {
    tile.xhrCancel = () => {
      xhrList.map((xhr) => {
        xhr.abort();
      });
    };
}