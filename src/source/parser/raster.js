export default function raster(data, cfg) {
  const { extent, width, height, min, max } = cfg;
  const resultData = {
    _id: 1,
    dataArray: [
      {
        data,
        width,
        height,
        min,
        max,
        coordinates: [[ extent[0], extent[1] ], [ extent[2], extent[3] ]] }]
  };
  return resultData;
}
