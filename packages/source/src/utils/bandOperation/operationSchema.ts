import { TypedArray, IRasterData,SchemaRGBOption } from '../../interface';

export type operationsType = 'rgb' | 'nd';

export const operationsSchema= {
  nd:{
    type:'operation',
    expression:['/',
    ['-', ['band', 1], ['band', 0]], // R > NIR
    ['+', ['band', 1], ['band', 0]]
  ],
  },
  rgb: {
    type: 'function',
    method:strethRgb2minMax
    },

}

function strethRgb2minMax(bandsData: IRasterData[],options?:SchemaRGBOption) {
  const channelR = bandsData[0].rasterData as Uint8Array;
  const channelG = bandsData[1].rasterData as Uint8Array;
  const channelB = bandsData[2].rasterData as Uint8Array;
  const data = [];
  const minMaxR = percentile(channelR, 2, 98);
  const minMaxG = percentile(channelG, 2, 98);
  const minMaxB = percentile(channelB, 2, 98);

  for (let i = 0; i < channelR.length; i++) {
    data.push(channelR[i] - minMaxR[0]);
    data.push(channelG[i] - minMaxG[0]);
    data.push(channelB[i] - minMaxB[0]);
  }
  return {
    rasterData: data,
    rMinMax:minMaxR,
    gMinMax:minMaxG,
    bMinMax:minMaxB,
  };
}

// https://gis.stackexchange.com/questions/324888/what-does-cumulative-count-cut-actually-do

function percentile(data: TypedArray, minPercent: number, maxPercent: number) {
  // 计算效率问题
  const sortData = data.slice().sort((a, b) => (a - b));
  const dataLength = sortData.length;
  const min = sortData[Math.ceil(dataLength * minPercent / 100)];
  const max = sortData[Math.ceil(dataLength * maxPercent / 100)]
  return [min, max]

}
