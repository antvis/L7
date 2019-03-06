/**
 * 计算地理数据范围
 * @param {dataArray} data 地理坐标数据
 * @return {Array} extent
 */
export function extent(data) {
  const extent = [ Infinity, Infinity, -Infinity, -Infinity ];
  data.forEach(item => {
    const { coordinates } = item;
    calcExtent(extent, coordinates);
  });
  return extent;
}
function calcExtent(extent, coords) {
  coords.forEach(coord => {
    if (Array.isArray(coord[0])) {
      calcExtent(extent, coord);
    } else {
      if (extent[0] > coord[0]) extent[0] = coord[0];
      if (extent[1] > coord[1]) extent[1] = coord[1];
      if (extent[2] < coord[0]) extent[2] = coord[0];
      if (extent[3] < coord[1]) extent[3] = coord[1];
    }
  });
  return extent;
}
