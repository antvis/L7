// 提供常见的数据计算方法

export function isNumber(n: any) {
  return typeof n === 'number';
}

export function floorArray(nums: number[]) {
  return nums.map((v) => Math.floor(v));
}
