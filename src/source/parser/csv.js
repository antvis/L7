import { csvParse } from 'd3-dsv';
export default function csv(data, cfg) {
  const { x, y, x1, y1 } = cfg;
  const csvdata = csvParse(data);
  const resultdata = [];
  csvdata.forEach((col, featureIndex) => {
    let coordinates = [];
    if (x && y) { coordinates = [ col[x] * 1, col[y] * 1 ]; } // 点数据
    if (x1 && y1) { // 弧线 或者线段
      coordinates = [[ col[x] * 1, col[y] * 1 ], [ col[x1] * 1, col[y1] * 1 ]];
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
