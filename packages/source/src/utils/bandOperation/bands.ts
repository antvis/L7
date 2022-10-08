import { IRasterFileData, IRasterFormat, IBandsOperation, IRasterData } from '../../interface';
import { calculate } from './math';
import {
    ResponseCallback,
} from '@antv/l7-utils';

/**
 * 执行波段计算 format + operation
 * @param imageDataList 
 * @param rasterFormat 
 * @param operation 
 * @returns 
 */
export async function bandsOperation(imageDataList: IRasterFileData[], rasterFormat: IRasterFormat, operation: IBandsOperation|undefined) {
    if(imageDataList.length === 0) {
      return {
        rasterData: [0],
        width: 1,
        heigh: 1
      }
    }

    let bandsData = (await Promise.all(
    imageDataList.map(({ data, bands = [0] }) => rasterFormat(data, bands)),
    )) as IRasterData[];
    // @ts-ignore 
    bandsData = bandsData.flat();
    // Tip: rasterFormat 返回值 rasterData|rasterData[]

    // 多个栅格数据必须是相同大小才能进行相互之间的运算
    const { width, height } = bandsData[0];
    let rasterData: HTMLImageElement | Uint8Array | ImageBitmap | null | undefined;
    switch (typeof operation) {
      case 'function':
        rasterData = operation(bandsData) as Uint8Array;
        break;
      case 'object':
        // 波段计算表达式 - operation
        rasterData = calculate(operation, bandsData) ;
        break;
      default:
        rasterData = bandsData[0].rasterData;
    }
    return {
        rasterData,
        width,
        height
    }
}

/**
 * 处理每个请求得到的栅格文件数据
 */
 export async function handleRasterFiles(
    rasterFiles: IRasterFileData[], 
    rasterFormat: IRasterFormat, 
    operation: IBandsOperation | undefined, 
    callback: ResponseCallback<any>
) {
    const { rasterData, width, height } = await bandsOperation(rasterFiles, rasterFormat, operation)
    // 目前 max｜min 没有生效
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