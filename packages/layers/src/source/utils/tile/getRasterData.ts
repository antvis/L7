import type { ITileBand, RequestParameters, ResponseCallback, SourceTile } from '@antv/l7-utils';
import { getArrayBuffer, makeXMLHttpRequestPromise } from '@antv/l7-utils';
import type { IBandsOperation, IRasterFileData, IRasterFormat } from '../../interface';
import { processRasterData } from '../bandOperation/bands';
import { bindCancel, getTileBandParams } from './request';

export const getRasterFile = async (
  tile: SourceTile,
  requestParameters: RequestParameters,
  callback: ResponseCallback<HTMLImageElement | ImageBitmap | null>,
  rasterFormat: IRasterFormat,
  operation?: IBandsOperation,
) => {
  // Tip: 至少存在一个请求文件的 url，处理得到标准的 ITileBand[] url 路径和 bands 参数
  const tileBandParams: ITileBand[] = getTileBandParams(requestParameters.url);
  if (tileBandParams.length > 1) {
    // 同时请求多文件
    const { rasterFiles, xhrList, errList } = await getMultiArrayBuffer(
      tileBandParams,
      requestParameters,
    );
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
        const rasterFiles = [
          {
            data: imgData,
            bands: tileBandParams[0].bands,
          },
        ];
        processRasterData(rasterFiles, rasterFormat, operation, callback);
      }
    });
    bindCancel(tile, [xhr]);
  }
};

/**
 * get multi raster files async (并行请求优化版本)
 * 使用 Promise.all 并行请求多个波段文件，减少网络等待时间
 * @param tileBandParams
 * @param requestParameters
 * @returns
 */
async function getMultiArrayBuffer(
  tileBandParams: ITileBand[],
  requestParameters: RequestParameters,
) {
  // 并行请求所有波段文件
  const promises = tileBandParams.map(async (tileBandParam) => {
    const params = {
      ...requestParameters,
      url: tileBandParam.url,
    };

    const { err, data, xhr } = await makeXMLHttpRequestPromise({
      ...params,
      type: 'arrayBuffer',
    });

    return {
      err,
      data,
      xhr,
      bands: tileBandParam.bands,
    };
  });

  // 并行执行所有请求
  const results = await Promise.all(promises);

  const rasterFiles: IRasterFileData[] = [];
  const xhrList: any[] = [];
  const errList: Error[] = [];

  // 处理结果
  for (const result of results) {
    if (result.err) {
      // err 可能是单个 Error 或 Error[]
      if (Array.isArray(result.err)) {
        errList.push(...result.err);
      } else {
        errList.push(result.err);
      }
    }
    xhrList.push(result.xhr);
    rasterFiles.push({
      data: result.data,
      bands: result.bands,
    });
  }

  return { rasterFiles, xhrList, errList };
}
