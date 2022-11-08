import { TypedArray, IRasterData } from '../../interface';
export const operationsSchema = {
  ndvi: ['/',
    ['-', ['band', 1], ['band', 0]], // R > NIR
    ['+', ['band', 1], ['band', 0]]
  ],
  normalizedDifference: ['/',
    ['-', ['band', 1], ['band', 0]], // R > NIR
    ['+', ['band', 1], ['band', 0]]
  ],
  rgb: strethRgb2minMax

}

function strethRgb2minMax(bandsData: IRasterData[]) {
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
    channelRMax: (minMaxR[1] - minMaxR[0]),
    channelGMax: (minMaxG[1] - minMaxG[0]),
    channelBMax: (minMaxB[1] - minMaxB[0]),
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
