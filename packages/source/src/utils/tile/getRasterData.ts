import { IRasterFormat, IBandsOperation, IRasterFileData } from '../../interface';
import { getTileBandParams, bindCancel } from './request';
import {
    makeXMLHttpRequestPromise,
    ResponseCallback,
    ITileBand,
    RequestParameters,
    getArrayBuffer,
    SourceTile,
} from '@antv/l7-utils';
import { processRasterData } from '../bandOperation/bands';

export const getRasterFile = async (
  tile: SourceTile,
  requestParameters: RequestParameters,
  callback: ResponseCallback<HTMLImageElement | ImageBitmap | null>,
  rasterFormat: IRasterFormat,
  operation?: IBandsOperation,
) => {
  // Tip: 至少存在一个请求文件的 url，处理得到标准的 ITileBand[] url 路径和 bands 参数
  const tileBandParams: ITileBand[] = getTileBandParams(requestParameters.url);
  if(tileBandParams.length > 1) {// 同时请求多文件
    const { rasterFiles, xhrList, errList } = await getMultiArrayBuffer(tileBandParams, requestParameters);
    // 多波段计算
    bindCancel(tile, xhrList);
    if (errList.length > 0) {
      callback(errList as Error[], null);
      return;
    }
    processRasterData(rasterFiles, rasterFormat, operation, callback);
  } else { 
    const xhr = getArrayBuffer(requestParameters, (err, imgData) => {
      if (err) {
        callback(err);
      } else if (imgData) {
        const rasterFiles = [{
          data: imgData,
          bands: tileBandParams[0].bands
        }];
        processRasterData(rasterFiles, rasterFormat, operation, callback);
      }
    });
    bindCancel(tile, [xhr]);
  }
};

/**
 * get multi raster files async
 * @param tileBandParams 
 * @param requestParameters 
 * @returns 
 */
async function getMultiArrayBuffer(tileBandParams: ITileBand[], requestParameters: RequestParameters) {
  const rasterFiles: IRasterFileData[] = [];
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
    rasterFiles.push({
        data,
        bands,
    });
  }

  return { rasterFiles, xhrList, errList }
}