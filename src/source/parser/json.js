import rewind from '@mapbox/geojson-rewind';
export default function json(data, cfg) {

  const { x, y, x1, y1, coordinates } = cfg;
  const resultdata = [];

  data.slice(0).forEach((col, featureIndex) => {
    let coords = [];
    if (x && y) { coords = [ col[x], col[y] ]; } // 点数据
    if (x1 && y1) { // 弧线 或者线段
      coords = [[ col[x], col[y] ], [ col[x1], col[y1] ]];
    }
    if (coordinates) {
      let type = 'Polygon';
      if (!Array.isArray(coordinates[0])) {
        type = 'Point';
      }
      if (Array.isArray(coordinates[0]) && !Array.isArray(coordinates[0][0])) {
        type = 'LineString';
      }
      const geometry = {
        type,
        coordinates: [ ...col[coordinates] ]
      };
      rewind(geometry, true);
      coords = geometry.coordinates;
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
