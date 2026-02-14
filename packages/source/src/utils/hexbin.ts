/**
 * 六边形分箱算法
 * 用于替代 d3-hexbin 的功能
 */

export interface HexbinBin<T> extends Array<T> {
  x: number;
  y: number;
}

export interface Hexbin<T> {
  (data: T[]): HexbinBin<T>[];
  radius(r: number): Hexbin<T>;
  x(x: (d: T) => number): Hexbin<T>;
  y(y: (d: T) => number): Hexbin<T>;
}

/**
 * 创建六边形分箱器
 * 使用 pointy-top 方向（尖角朝上），与 d3-hexbin 兼容
 */
export function hexbin<T = any>(): Hexbin<T> {
  let radius = 1;
  let xAccessor: (d: T) => number = (d: any) => d[0];
  let yAccessor: (d: T) => number = (d: any) => d[1];

  // pointy-top 六边形的网格参数
  // 水平间距 dx = r * √3
  // 垂直间距 dy = r * 1.5

  const hexbinImpl = (data: T[]): HexbinBin<T>[] => {
    const r = radius;
    const dx = r * Math.sqrt(3);
    const dy = r * 1.5;

    // 使用 Map 存储每个六边形单元格的点
    const bins = new Map<string, HexbinBin<T>>();

    for (const d of data) {
      const px = xAccessor(d);
      const py = yAccessor(d);

      // 计算点所属的六边形单元格
      // 使用轴向坐标系统（axial coordinates）来定位六边形
      const { col, row } = pointToHexagon(px, py, dx, dy, r);

      // 生成唯一键
      const key = `${col},${row}`;

      // 获取或创建 bin
      let bin = bins.get(key);
      if (!bin) {
        // 计算六边形中心坐标
        const center = hexagonCenter(col, row, dx, dy, r);
        bin = Object.assign([], { x: center.x, y: center.y });
        bins.set(key, bin);
      }

      // 将点添加到 bin
      bin.push(d);
    }

    return Array.from(bins.values());
  };

  // 设置半径
  hexbinImpl.radius = (r: number): Hexbin<T> => {
    radius = r;
    return hexbinImpl;
  };

  // 设置 x 坐标访问器
  hexbinImpl.x = (x: (d: T) => number): Hexbin<T> => {
    xAccessor = x;
    return hexbinImpl;
  };

  // 设置 y 坐标访问器
  hexbinImpl.y = (y: (d: T) => number): Hexbin<T> => {
    yAccessor = y;
    return hexbinImpl;
  };

  return hexbinImpl as Hexbin<T>;
}

/**
 * 将点坐标转换为六边形网格坐标
 * 使用 offset 坐标系统（odd-q: 奇数列偏移）
 */
function pointToHexagon(
  px: number,
  py: number,
  dx: number,
  dy: number,
  r: number,
): { col: number; row: number } {
  // 对于 pointy-top 六边形使用 odd-q 偏移坐标
  // col 是六边形列索引
  // row 是六边形行索引

  // 计算大致的列
  const col = Math.round(px / dx);

  // 根据列的奇偶性调整 y 坐标的偏移
  const offsetY = col % 2 !== 0 ? dy / 2 : 0;

  // 计算大致的行
  const row = Math.round((py - offsetY) / dy);

  // 由于六边形不是完美的矩形网格，需要检查相邻六边形
  // 找到最近的六边形中心
  return findNearestHexagon(px, py, col, row, dx, dy, r);
}

/**
 * 找到最近的六边形
 */
function findNearestHexagon(
  px: number,
  py: number,
  approxCol: number,
  approxRow: number,
  dx: number,
  dy: number,
  r: number,
): { col: number; row: number } {
  // 检查候选六边形（当前六边形及其邻居）
  const candidates: Array<{ col: number; row: number; dist: number }> = [];

  for (let dc = -1; dc <= 1; dc++) {
    for (let dr = -1; dr <= 1; dr++) {
      const col = approxCol + dc;
      const row = approxRow + dr;
      const center = hexagonCenter(col, row, dx, dy, r);
      const dist = Math.sqrt((px - center.x) ** 2 + (py - center.y) ** 2);
      candidates.push({ col, row, dist });
    }
  }

  // 选择距离最近的六边形
  candidates.sort((a, b) => a.dist - b.dist);
  return { col: candidates[0].col, row: candidates[0].row };
}

/**
 * 计算六边形中心坐标（odd-q offset 坐标）
 */
function hexagonCenter(
  col: number,
  row: number,
  dx: number,
  dy: number,
  r: number,
): { x: number; y: number } {
  const x = col * dx;
  // 奇数列向下偏移半个六边形高度
  const offsetY = col % 2 !== 0 ? dy / 2 : 0;
  const y = row * dy + offsetY;

  return { x, y };
}
