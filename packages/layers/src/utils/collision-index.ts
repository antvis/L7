export interface ICollisionBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  anchorPointX: number;
  anchorPointY: number;
}
// @mapbox/grid-index 并没有类似 hitTest 的单纯获取碰撞检测结果的方法，query 将导致计算大量多余的包围盒结果，因此使用改良版
import { mat4, vec4 } from 'gl-matrix';
import GridIndex from './grid-index';

// 为 viewport 加上 buffer，避免边缘处的文本无法显示
const viewportPadding = 100;

/**
 * 基于网格实现文本避让，大幅提升包围盒碰撞检测效率
 * @see https://zhuanlan.zhihu.com/p/74373214
 */
export default class CollisionIndex {
  private width: number;
  private height: number;
  private grid: GridIndex;
  private screenRightBoundary: number;
  private screenBottomBoundary: number;
  private gridRightBoundary: number;
  private gridBottomBoundary: number;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    // 创建网格索引
    this.grid = new GridIndex(
      width + 2 * viewportPadding,
      height + 2 * viewportPadding,
      25,
    );

    this.screenRightBoundary = width + viewportPadding;
    this.screenBottomBoundary = height + viewportPadding;
    this.gridRightBoundary = width + 2 * viewportPadding;
    this.gridBottomBoundary = height + 2 * viewportPadding;
  }

  public placeCollisionBox(collisionBox: ICollisionBox, mvpMatrix: mat4) {
    const projectedPoint = this.project(
      mvpMatrix,
      collisionBox.anchorPointX,
      collisionBox.anchorPointY,
    );

    const tlX = collisionBox.x1 + projectedPoint.x;
    const tlY = collisionBox.y1 + projectedPoint.y;
    const brX = collisionBox.x2 + projectedPoint.x;
    const brY = collisionBox.y2 + projectedPoint.y;

    if (
      !this.isInsideGrid(tlX, tlY, brX, brY) ||
      this.grid.hitTest(tlX, tlY, brX, brY)
    ) {
      return {
        box: [],
      };
    }

    return {
      box: [tlX, tlY, brX, brY],
    };
  }

  public insertCollisionBox(box: number[], featureIndex: number) {
    const key = { featureIndex };
    this.grid.insert(key, box[0], box[1], box[2], box[3]);
  }

  /**
   * 后续碰撞检测都需要投影到 viewport 坐标系
   * @param {THREE.Matrix4} mvpMatrix mvp矩阵
   * @param {number} x P20 平面坐标X
   * @param {number} y P20 平面坐标Y
   * @return {Point} projectedPoint
   */
  public project(mvpMatrix: mat4, x: number, y: number) {
    const point = vec4.fromValues(x, y, 0, 1);
    const out = vec4.create();
    vec4.transformMat4(out, point, mvpMatrix);
    // GL 坐标系[-1, 1] -> viewport 坐标系[width, height]
    return {
      x: ((out[0] / out[3] + 1) / 2) * this.width + viewportPadding,
      y: ((-out[1] / out[3] + 1) / 2) * this.height + viewportPadding,
    };
  }

  /**
   * 判断包围盒是否在整个网格内，需要加上 buffer
   * @param {number} x1 x1
   * @param {number} y1 y1
   * @param {number} x2 x2
   * @param {number} y2 y2
   * @return {Point} isInside
   */
  public isInsideGrid(x1: number, y1: number, x2: number, y2: number) {
    return (
      x2 >= 0 &&
      x1 < this.gridRightBoundary &&
      y2 >= 0 &&
      y1 < this.gridBottomBoundary
    );
  }
}
