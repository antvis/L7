import { IRasterFileData, IRasterFormat, IBandsOperation, IRgbOperation, IRasterData } from '../../interface';
import { calculate } from './math';
import { operationsSchema } from './operationSchema'

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
export async function bandsOperation(imageDataList: IRasterFileData[], rasterFormat: IRasterFormat, operation: IBandsOperation | undefined) {
  if (imageDataList.length === 0) {
    return {
      rasterData: [0],
      width: 1,
      heigh: 1
    }
  }
  const formatData = (await Promise.all(
    imageDataList.map(({ data, bands = [0] }) => rasterFormat(data, bands)),
  )) as IRasterData[];

  const bandsData: IRasterData[] = [];

  // Tip: rasterFormat 返回值 rasterData|rasterData[]
  formatData.forEach(d => {
    Array.isArray(d) ? bandsData.push(...d) : bandsData.push(d);
  })
  // 多个栅格数据必须是相同大小才能进行相互之间的运算
  const { width, height } = bandsData[0];

  type IOperationResult = HTMLImageElement | Uint8Array | ImageBitmap | null | undefined
  let rasterData: IOperationResult | IOperationResult[] | any ;
  let operationFunc = operation;
  if(typeof  operationFunc === 'string') {
    operationFunc = operationsSchema[operationFunc] as IBandsOperation | undefined;
  }
  switch (typeof operationFunc) {
    case 'function':
      rasterData = operationFunc(bandsData) as Uint8Array;
      break;
    case 'object':
      // 波段计算表达式 - operation
      // operation: ['+', ['band', 0], 1]
      /**
       * operation: {
       *  r: ['+', ['band', 0], 1],
       *  g: ['+', ['band', 0], 1],
       *  b: ['+', ['band', 0], 1],
       * }
       */
      if (!Array.isArray(operationFunc)) { // RGB 三通道
        const rgbBands = getRgbBands(operationFunc as IRgbOperation, bandsData);
        rasterData = combineRGBChannels(rgbBands);
      
      } else { // 数值计算
        rasterData ={ rasterData: calculate(operationFunc as any[], bandsData)};
      }
      break;
  
    default:
      rasterData={ rasterData: bandsData[0].rasterData};
  }
  return {
    ...rasterData,
    width,
    height,
  }
}



  function getRgbBands(operation: IRgbOperation, bandsData: IRasterData[]) {
    if (operation.r === undefined) console.warn('Channel R lost in Operation! Use band[0] to fill!');
    if (operation.g === undefined) console.warn('Channel G lost in Operation! Use band[0] to fill!');
    if (operation.b === undefined) console.warn('Channel B lost in Operation! Use band[0] to fill!');
    const r = calculate(operation.r || ['band', 0], bandsData);
    const g = calculate(operation.g || ['band', 0], bandsData);
    const b = calculate(operation.b || ['band', 0], bandsData);
    return [r, g, b];
  }

  /**
   * 将波段数据进行合并操作（彩色多通道）
   * @param bandsData 
   */
  function combineRGBChannels(bandsData: Uint8Array[]) {
    const channelR = bandsData[0];
    const channelG = bandsData[1];
    const channelB = bandsData[2];
    const data = [];
    let channelRMax = -Infinity;
    let channelGMax = -Infinity;
    let channelBMax = -Infinity;
    for (let i = 0; i < channelR.length; i++) {
      data.push(channelR[i]); channelRMax = Math.max(channelRMax, channelR[i]);
      data.push((channelG)[i]); channelGMax = Math.max(channelGMax, channelR[i]);
      data.push((channelB)[i]); channelBMax = Math.max(channelBMax, channelR[i]);
    }
    return {
      data,
      channelRMax,
      channelGMax,
      channelBMax
    };
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