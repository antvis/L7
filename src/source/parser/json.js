export default function json(data, cfg) {
  const { x, y, x1, y1 } = cfg;
  const resultdata = [];
  data.forEach((col, featureIndex) => {
    let coordinates = [];
    if (x && y) { coordinates = [ col[x], col[y] ]; } // 点数据
    if (x1 && y1) { // 弧线 或者线段
      coordinates = [[ col[x], col[y] ], [ col[x1], col[y1] ]];
    }
    col._id = featureIndex + 1;
    const dataItem = {
      ...col,
      coordinates

    };
    resultdata.push(dataItem);
  });
  return {
    dataArray: resultdata
  };
}
