/**
 * 网格索引，相比 @mapbox/grid-index，在简单计算碰撞检测结果时效率更高
 * @see https://zhuanlan.zhihu.com/p/74373214
 */
class GridIndex {
  constructor(width, height, cellSize) {
    const boxCells = this.boxCells = [];

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

  insert(key, x1, y1, x2, y2) {
    this._forEachCell(x1, y1, x2, y2, this._insertBoxCell, this.boxUid++);
    this.boxKeys.push(key);
    this.bboxes.push(x1);
    this.bboxes.push(y1);
    this.bboxes.push(x2);
    this.bboxes.push(y2);
  }

  _insertBoxCell(x1, y1, x2, y2, cellIndex, uid) {
    this.boxCells[cellIndex].push(uid);
  }

  _query(x1, y1, x2, y2, hitTest, predicate) {
    if (x2 < 0 || x1 > this.width || y2 < 0 || y1 > this.height) {
      return hitTest ? false : [];
    }
    const result = [];
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
          y2: this.bboxes[boxUid * 4 + 3]
        });
      }
      return predicate ? result.filter(predicate) : result;
    }

    const queryArgs = {
      hitTest,
      seenUids: { box: {}, circle: {} }
    };
    this._forEachCell(x1, y1, x2, y2, this._queryCell, result, queryArgs, predicate);
    return hitTest ? result.length > 0 : result;
  }

  query(x1, y1, x2, y2, predicate) {
    return this._query(x1, y1, x2, y2, false, predicate);
  }

  hitTest(x1, y1, x2, y2, predicate) {
    return this._query(x1, y1, x2, y2, true, predicate);
  }

  _queryCell(x1, y1, x2, y2, cellIndex, result, queryArgs, predicate) {
    const seenUids = queryArgs.seenUids;
    const boxCell = this.boxCells[cellIndex];
    if (boxCell !== null) {
      const bboxes = this.bboxes;
      for (const boxUid of boxCell) {
        if (!seenUids.box[boxUid]) {
          seenUids.box[boxUid] = true;
          const offset = boxUid * 4;
          if ((x1 <= bboxes[offset + 2]) &&
            (y1 <= bboxes[offset + 3]) &&
            (x2 >= bboxes[offset + 0]) &&
            (y2 >= bboxes[offset + 1]) &&
            (!predicate || predicate(this.boxKeys[boxUid]))) {
            if (queryArgs.hitTest) {
              result.push(true);
              return true;
            }
            result.push({
              key: this.boxKeys[boxUid],
              x1: bboxes[offset],
              y1: bboxes[offset + 1],
              x2: bboxes[offset + 2],
              y2: bboxes[offset + 3]
            });
          }
        }
      }
    }
    return false;
  }

  _forEachCell(x1, y1, x2, y2, fn, arg1, arg2, predicate) {
    const cx1 = this._convertToXCellCoord(x1);
    const cy1 = this._convertToYCellCoord(y1);
    const cx2 = this._convertToXCellCoord(x2);
    const cy2 = this._convertToYCellCoord(y2);

    for (let x = cx1; x <= cx2; x++) {
      for (let y = cy1; y <= cy2; y++) {
        const cellIndex = this.xCellCount * y + x;
        if (fn.call(this, x1, y1, x2, y2, cellIndex, arg1, arg2, predicate)) return;
      }
    }
  }

  _convertToXCellCoord(x) {
    return Math.max(0, Math.min(this.xCellCount - 1, Math.floor(x * this.xScale)));
  }

  _convertToYCellCoord(y) {
    return Math.max(0, Math.min(this.yCellCount - 1, Math.floor(y * this.yScale)));
  }
}

export default GridIndex;
