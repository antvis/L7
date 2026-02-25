/**
 * 六边形分箱算法
 * 用于替代 d3-hexbin 的功能
 * 使用 pointy-top 方向（尖角朝上）和 odd-r 偏移（奇数行偏移）
 */

export interface HexbinBin<T> extends Array<T> {
  x: number;
  y: number;
}

export interface Hexbin<T> {
  (data: T[]): HexbinBin<T>[];
  radius(r: number): Hexbin<T>;
  x(x: (d: T, i: number, data: T[]) => number): Hexbin<T>;
  y(y: (d: T, i: number, data: T[]) => number): Hexbin<T>;
}

// 常量：π/3
const THIRD_PI = Math.PI / 3;

/**
 * 创建六边形分箱器
 * 完全兼容 d3-hexbin 的实现
 */
export function hexbin<T = any>(): Hexbin<T> {
  let r = 1;
  // d3-hexbin 的网格参数
  // dx = r * 2 * sin(π/3) = r * √3
  // dy = r * 1.5
  let dx = r * 2 * Math.sin(THIRD_PI);
  let dy = r * 1.5;
  let xAccessor: (d: T, i: number, data: T[]) => number = (d: any) => d[0];
  let yAccessor: (d: T, i: number, data: T[]) => number = (d: any) => d[1];

  const hexbinImpl = (data: T[]): HexbinBin<T>[] => {
    const binsById = new Map<string, HexbinBin<T>>();

    for (let i = 0; i < data.length; i++) {
      const point = data[i];
      let px = xAccessor(point, i, data);
      let py = yAccessor(point, i, data);

      // 跳过 NaN 值
      if (isNaN(px) || isNaN(py)) continue;

      // d3-hexbin 分箱算法
      // pj 是行索引
      const pj = Math.round((py = py / dy));
      // pi 是列索引，奇数行需要偏移 0.5
      const pi = Math.round((px = px / dx - (pj & 1) / 2));
      const py1 = py - pj;

      // 检查是否需要调整到相邻的六边形
      if (Math.abs(py1) * 3 > 1) {
        const px1 = px - pi;
        const pi2 = pi + (px < pi ? -1 : 1) / 2;
        const pj2 = pj + (py < pj ? -1 : 1);
        const px2 = px - pi2;
        const py2 = py - pj2;
        if (px1 * px1 + py1 * py1 > px2 * px2 + py2 * py2) {
          // 调整 pi 和 pj
          // 注意这里的逻辑与 d3-hexbin 完全一致
          const newPi = pi2 + (pj & 1 ? 1 : -1) / 2;
          const newPj = pj2;

          const id = `${newPi}-${newPj}`;
          let bin = binsById.get(id);
          if (bin) {
            bin.push(point);
          } else {
            bin = Object.assign([point], {
              x: (newPi + (newPj & 1) / 2) * dx,
              y: newPj * dy,
            });
            binsById.set(id, bin);
          }
          continue;
        }
      }

      // 正常情况
      const id = `${pi}-${pj}`;
      let bin = binsById.get(id);
      if (bin) {
        bin.push(point);
      } else {
        // 计算中心坐标
        // x = (pi + (pj & 1) / 2) * dx - 对于奇数行，x 向右偏移 dx/2
        // y = pj * dy
        bin = Object.assign([point], {
          x: (pi + (pj & 1) / 2) * dx,
          y: pj * dy,
        });
        binsById.set(id, bin);
      }
    }

    return Array.from(binsById.values());
  };

  // 设置半径
  hexbinImpl.radius = (radius: number): Hexbin<T> => {
    r = radius;
    dx = r * 2 * Math.sin(THIRD_PI);
    dy = r * 1.5;
    return hexbinImpl;
  };

  // 设置 x 坐标访问器
  hexbinImpl.x = (x: (d: T, i: number, data: T[]) => number): Hexbin<T> => {
    xAccessor = x;
    return hexbinImpl;
  };

  // 设置 y 坐标访问器
  hexbinImpl.y = (y: (d: T, i: number, data: T[]) => number): Hexbin<T> => {
    yAccessor = y;
    return hexbinImpl;
  };

  return hexbinImpl as Hexbin<T>;
}
