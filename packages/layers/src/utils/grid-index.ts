interface IQueryArgs {
  hitTest: boolean;
  seenUids: { box: any; circle: any };
}
type CallBack = (...args: any[]) => any;
/**
 * 网格索引，相比 @mapbox/grid-index，在简单计算碰撞检测结果时效率更高
 * @see https://zhuanlan.zhihu.com/p/74373214
 */
class GridIndex {
  private boxCells: number[][] = [];
  private xCellCount: number;
  private yCellCount: number;
  private boxKeys: string[];
  private bboxes: number[];
  private width: number;
  private height: number;
  private xScale: number;
  private yScale: number;
  private boxUid: number;

  constructor(width: number, height: number, cellSize: number) {
    const boxCells = this.boxCells;

    this.xCellCount = Math.ceil(width / cellSize);
    this.yCellCount = Math.ceil(height / cellSize);

    for (let i = 0; i < this.xCellCount * this.yCellCount; i++) {
      boxCells.push([]);
    }
    this.boxKeys = [];
    this.bboxes = [];

    this.width = width;
    this.height = height;
    this.xScale = this.xCellCount / width;
    this.yScale = this.yCellCount / height;
    this.boxUid = 0;
  }

  public insert(key: any, x1: number, y1: number, x2: number, y2: number) {
    this.forEachCell(x1, y1, x2, y2, this.insertBoxCell, this.boxUid++);
    this.boxKeys.push(key);
    this.bboxes.push(x1);
    this.bboxes.push(y1);
    this.bboxes.push(x2);
    this.bboxes.push(y2);
  }

  public query(x1: number, y1: number, x2: number, y2: number, predicate?: CallBack) {
    return this.queryHitTest(x1, y1, x2, y2, false, predicate);
  }

  public hitTest(x1: number, y1: number, x2: number, y2: number, predicate?: CallBack) {
    return this.queryHitTest(x1, y1, x2, y2, true, predicate);
  }

  private insertBoxCell(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    cellIndex: number,
    uid: number,
  ) {
    this.boxCells[cellIndex].push(uid);
  }

  private queryHitTest(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    hitTest: boolean,
    predicate?: CallBack,
  ) {
    if (x2 < 0 || x1 > this.width || y2 < 0 || y1 > this.height) {
      return hitTest ? false : [];
    }
    const result: any[] = [];
    if (x1 <= 0 && y1 <= 0 && this.width <= x2 && this.height <= y2) {
      // 这一步是高效的关键，后续精确碰撞检测结果在计算文本可见性时并不需要
      if (hitTest) {
        return true;
      }
      for (let boxUid = 0; boxUid < this.boxKeys.length; boxUid++) {
        result.push({
          key: this.boxKeys[boxUid],
          x1: this.bboxes[boxUid * 4],
          y1: this.bboxes[boxUid * 4 + 1],
          x2: this.bboxes[boxUid * 4 + 2],
          y2: this.bboxes[boxUid * 4 + 3],
        });
      }
      return predicate ? result.filter(predicate) : result;
    }

    const queryArgs = {
      hitTest,
      seenUids: { box: {}, circle: {} },
    };
    this.forEachCell(x1, y1, x2, y2, this.queryCell, result, queryArgs, predicate);
    return hitTest ? result.length > 0 : result;
  }

  private queryCell(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    cellIndex: number,
    result: any[],
    queryArgs?: any,
    predicate?: CallBack,
  ) {
    const seenUids = queryArgs.seenUids;
    const boxCell = this.boxCells[cellIndex];
    if (boxCell !== null) {
      const bboxes = this.bboxes;
      for (const boxUid of boxCell) {
        if (!seenUids.box[boxUid]) {
          seenUids.box[boxUid] = true;
          const offset = boxUid * 4;
          if (
            x1 <= bboxes[offset + 2] &&
            y1 <= bboxes[offset + 3] &&
            x2 >= bboxes[offset + 0] &&
            y2 >= bboxes[offset + 1] &&
            (!predicate || predicate(this.boxKeys[boxUid]))
          ) {
            if (queryArgs.hitTest) {
              result.push(true);
              return true;
            }
            result.push({
              key: this.boxKeys[boxUid],
              x1: bboxes[offset],
              y1: bboxes[offset + 1],
              x2: bboxes[offset + 2],
              y2: bboxes[offset + 3],
            });
          }
        }
      }
    }
    return false;
  }

  private forEachCell(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    fn: CallBack,
    arg1: any[] | number,
    arg2?: IQueryArgs,
    predicate?: CallBack,
  ) {
    const cx1 = this.convertToXCellCoord(x1);
    const cy1 = this.convertToYCellCoord(y1);
    const cx2 = this.convertToXCellCoord(x2);
    const cy2 = this.convertToYCellCoord(y2);

    for (let x = cx1; x <= cx2; x++) {
      for (let y = cy1; y <= cy2; y++) {
        const cellIndex = this.xCellCount * y + x;
        if (fn.call(this, x1, y1, x2, y2, cellIndex, arg1, arg2, predicate)) {
          return;
        }
      }
    }
  }

  private convertToXCellCoord(x: number) {
    return Math.max(0, Math.min(this.xCellCount - 1, Math.floor(x * this.xScale)));
  }

  private convertToYCellCoord(y: number) {
    return Math.max(0, Math.min(this.yCellCount - 1, Math.floor(y * this.yScale)));
  }
}

export default GridIndex;
