import type { IRasterData, SchemaRGBOption, TypedArray } from '../../interface';

export type operationsType = 'rgb' | 'nd';

export const operationsSchema = {
  nd: {
    type: 'operation',
    expression: [
      '/',
      ['-', ['band', 1], ['band', 0]], // R > NIR
      ['+', ['band', 1], ['band', 0]],
    ],
  },
  rgb: {
    type: 'function',
    method: strethRgb2minMax,
  },
};

function strethRgb2minMax(bandsData: IRasterData[], options?: SchemaRGBOption) {
  const channelR = bandsData[0].rasterData as Uint8Array;
  const channelG = bandsData[1].rasterData as Uint8Array;
  const channelB = bandsData[2].rasterData as Uint8Array;
  const data = [];
  const [low, high] = options?.countCut || [2, 98];
  const minMaxR = options?.RMinMax || percentile(channelR, low, high);
  const minMaxG = options?.GMinMax || percentile(channelG, low, high);
  const minMaxB = options?.BMinMax || percentile(channelB, low, high);

  for (let i = 0; i < channelR.length; i++) {
    data.push(Math.max(0, channelR[i] - minMaxR[0]));
    data.push(Math.max(0, channelG[i] - minMaxG[0]));
    data.push(Math.max(0, channelB[i] - minMaxB[0]));
  }
  return {
    rasterData: data,
    rMinMax: minMaxR,
    gMinMax: minMaxG,
    bMinMax: minMaxB,
  };
}

// https://gis.stackexchange.com/questions/324888/what-does-cumulative-count-cut-actually-do

export function percentile(data: TypedArray, minPercent: number, maxPercent: number) {
  // 计算效率问题
  const sortData = data.slice().sort((a, b) => a - b);
  const dataLength = sortData.length;
  const min = sortData[Math.ceil((dataLength * minPercent) / 100)];
  const max = sortData[Math.ceil((dataLength * maxPercent) / 100)];
  return [min, max];
}
