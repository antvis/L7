/**
 * 计算地理数据范围
 * @param {dataArray} data 地理坐标数据
 * @return {Array} extent
 */
export function extent(data) {
  const extent = [ Infinity, Infinity, -Infinity, -Infinity ];
  data.forEach(item => {
    const { coordinates } = item;
    if (Array.isArray(coordinates[0])) {
      coordinates.forEach(coord => {
        if (extent[0] > coord[0]) extent[0] = coord[0];
        if (extent[1] > coord[1]) extent[1] = coord[1];
        if (extent[2] < coord[0]) extent[2] = coord[0];
        if (extent[3] < coord[1]) extent[3] = coord[1];
      });
    } else {
      if (extent[0] > coordinates[0]) extent[0] = coordinates[0];
      if (extent[1] > coordinates[1]) extent[1] = coordinates[1];
      if (extent[2] < coordinates[0]) extent[2] = coordinates[0];
      if (extent[3] < coordinates[1]) extent[3] = coordinates[1];
    }
  });
  return extent;
}
