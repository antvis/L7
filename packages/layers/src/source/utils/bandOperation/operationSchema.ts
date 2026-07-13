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
  const length = channelR.length;

  // 预分配数组（3 倍长度用于 RGB）
  const data = new Uint8Array(length * 3);

  const [low, high] = options?.countCut || [2, 98];
  const minMaxR = options?.RMinMax || percentile(channelR, low, high);
  const minMaxG = options?.GMinMax || percentile(channelG, low, high);
  const minMaxB = options?.BMinMax || percentile(channelB, low, high);

  // 使用预分配数组，避免动态扩容
  for (let i = 0; i < length; i++) {
    const idx = i * 3;
    data[idx] = Math.max(0, channelR[i] - minMaxR[0]);
    data[idx + 1] = Math.max(0, channelG[i] - minMaxG[0]);
    data[idx + 2] = Math.max(0, channelB[i] - minMaxB[0]);
  }
  return {
    rasterData: data,
    rMinMax: minMaxR,
    gMinMax: minMaxG,
    bMinMax: minMaxB,
  };
}

// https://gis.stackexchange.com/questions/324888/what-does-cumulative-count-cut-actually-do

/**
 * 快速选择算法 - O(n) 复杂度
 * 找到数组中第 k 小的元素
 */
function quickselect(arr: number[], k: number, left = 0, right = arr.length - 1): number {
  if (left === right) {
    return arr[left];
  }

  // 选择基准值
  const pivotIndex = partition(arr, left, right);

  if (k === pivotIndex) {
    return arr[k];
  } else if (k < pivotIndex) {
    return quickselect(arr, k, left, pivotIndex - 1);
  } else {
    return quickselect(arr, k, pivotIndex + 1, right);
  }
}

/**
 * 分区函数
 */
function partition(arr: number[], left: number, right: number): number {
  const pivot = arr[right];
  let i = left;

  for (let j = left; j < right; j++) {
    if (arr[j] <= pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }

  [arr[i], arr[right]] = [arr[right], arr[i]];
  return i;
}

/**
 * 计算百分位数（优化版本：使用快速选择算法）
 * 从 O(n log n) 优化到 O(n)
 */
export function percentile(data: TypedArray, minPercent: number, maxPercent: number) {
  const dataLength = data.length;
  const minIdx = Math.ceil((dataLength * minPercent) / 100);
  const maxIdx = Math.ceil((dataLength * maxPercent) / 100);

  // 只在需要时复制数组
  const arr = Array.from(data);

  // 使用快速选择算法找到第 k 小的元素
  const min = quickselect(arr, minIdx);
  const max = quickselect(arr, maxIdx);

  return [min, max];
}
