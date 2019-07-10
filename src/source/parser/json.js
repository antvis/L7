import rewind from '@mapbox/geojson-rewind';
export default function json(data, cfg) {
  const { x, y, x1, y1, coordinates } = cfg;
  const resultdata = [];
  data.forEach((col, featureIndex) => {
    let coords = [];
    if (x && y) { coords = [ col[x], col[y] ]; } // 点数据
    if (x1 && y1) { // 弧线 或者线段
      coords = [[ col[x], col[y] ], [ col[x1], col[y1] ]];
    }
    if (coordinates) {
      const geometry = {
        type: 'Polygon',
        coordinates: col[coordinates]
      };
      rewind(geometry, true);
      coords = geometry.coordinates;
      delete col[coordinates];
    }

    col._id = featureIndex + 1;
    const dataItem = {
      ...col,
      coordinates: coords

    };
    resultdata.push(dataItem);
  });
  return {
    dataArray: resultdata
  };
}
