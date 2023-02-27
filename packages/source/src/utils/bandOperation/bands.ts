import {
  IBandsOperation,
  IRasterData,
  IRasterFileData,
  IRasterFormat,
  IRgbOperation,
  SchemaOperationType,
} from '../../interface';
import { calculate } from './math';
import { operationsSchema } from './operationSchema';

import { ResponseCallback } from '@antv/l7-utils';

/**
 * 执行波段计算 format + operation
 * @param imageDataList
 * @param rasterFormat
 * @param operation
 * @returns
 */
export async function bandsOperation(
  imageDataList: IRasterFileData[],
  rasterFormat: IRasterFormat,
  operation: IBandsOperation | undefined,
) {
  if (imageDataList.length === 0) {
    return {
      rasterData: [0],
      width: 1,
      heigh: 1,
    };
  }

  const formatData = (await Promise.all(
    imageDataList.map(({ data, bands = [0] }) => rasterFormat(data, bands)),
  )) as IRasterData[];

  const bandsData: IRasterData[] = [];

  // Tip: rasterFormat 返回值 rasterData|rasterData[]
  formatData.forEach((d) => {
    Array.isArray(d) ? bandsData.push(...d) : bandsData.push(d);
  });
  // 多个栅格数据必须是相同大小才能进行相互之间的运算
  const { width, height } = bandsData[0];
  type IOperationResult =
    | HTMLImageElement
    | Uint8Array
    | ImageBitmap
    | null
    | undefined;
  let rasterData: IOperationResult | IOperationResult[] | any;

  switch (typeof operation) {
    case 'function':
      rasterData = operation(bandsData) as Uint8Array;
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
      if (!Array.isArray(operation)) {
        // RGB 三通道
        rasterData = processSchemaOperation(
          operation as SchemaOperationType,
          bandsData,
        );
      } else {
        // 数值计算
        rasterData = { rasterData: calculate(operation as any[], bandsData) };
      }
      break;

    default:
      rasterData = { rasterData: bandsData[0].rasterData };
  }
  return {
    ...rasterData,
    width,
    height,
  };
}

function processSchemaOperation(
  operation: SchemaOperationType,
  bandsData: IRasterData[],
) {
  const schema = operationsSchema[operation.type];

  if (schema.type === 'function') {
    // @ts-ignore
    return schema.method(bandsData, operation?.options as any);
  } else if (schema.type === 'operation') {
    if (operation.type === 'rgb') {
      // TODO 临时处理
      // @ts-ignore
      return getRgbBands(schema.expression, bandsData);
    } else {
      // @ts-ignore
      return { rasterData: calculate(schema.expression as any[], bandsData) };
    }
  }
}
function getRgbBands(operation: IRgbOperation, bandsData: IRasterData[]) {
  if (operation.r === undefined) {
    console.warn('Channel R lost in Operation! Use band[0] to fill!');
  }
  if (operation.g === undefined) {
    console.warn('Channel G lost in Operation! Use band[0] to fill!');
  }
  if (operation.b === undefined) {
    console.warn('Channel B lost in Operation! Use band[0] to fill!');
  }
  const r = calculate(operation.r || ['band', 0], bandsData);
  const g = calculate(operation.g || ['band', 0], bandsData);
  const b = calculate(operation.b || ['band', 0], bandsData);
  return [r, g, b];
}

/**
 * 处理每个请求得到的栅格文件数据
 */
export async function processRasterData(
  rasterFiles: IRasterFileData[],
  rasterFormat: IRasterFormat,
  operation: IBandsOperation | undefined,
  callback: ResponseCallback<any>,
) {
  const rasterData = await bandsOperation(rasterFiles, rasterFormat, operation);
  // 目前 max｜min 没有生效

  callback(null, { data: rasterData });
}
