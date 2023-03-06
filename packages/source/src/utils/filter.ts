import { project } from '@antv/l7-utils';
/**
 * 按照矩形从栅格数据中提取数据
 * @param data
 * @param rect
 * @param width 二维数据的宽度
 * @returns
 */
export function getRectData(data: number[], width: number, rect: number[]) {
  const [minX, minY, maxX, maxY] = rect;
  const selectedData = [];
  for (let i = minY; i < maxY; i++) {
    for (let j = minX; j < maxX; j++) {
      const index = i * width + j;
      const d = data[index];
      selectedData.push(d);
    }
  }
  return selectedData;
}
/**
 * 计算经纬度在二维数据中的位置
 * 由于二维数组数据的分布是均匀的，而经纬度的分布是不均匀的，因此统一将经纬度转换成平面坐标后进行计算
 * @param lnglat
 * @param width   二维数据的宽度
 * @param height  二维数据的高度
 * @param bounds
 * @returns
 */
export function projectRect(
  lngLat: number[],
  width: number,
  height: number,
  bounds: number[],
) {
  /**
   * minLng, maxLat --- * -> x 正方向
   * |                  |
   * |                  |
   * * ---------- maxLng, minLat
   * ｜
   * v y 正方向
   */
  const [lng, lat] = lngLat;
  const [minLng, minLat, maxLng, maxLat] = bounds;
  const [pointX, pointY] = project([lng, lat]);
  const [minX, minY] = project([minLng, maxLat]);
  const [maxX, maxY] = project([maxLng, minLat]);
  const x = Math.round(((pointX - minX) / (maxX - minX)) * width);
  const y = Math.round(((pointY - minY) / (maxY - minY)) * height);
  return [x, y]; // 返回在二维数据中的位置
}

/**
 * 过滤数据
 * |------------------------------|
 * |  pixelBounds                 |
 * |   |----------------------|   |
 * |   |  coverPixelsBounds   |   |
 * |   |                      |   |
 * |   |                      |   |
 * |   |                      |   |
 * |   |----------------------|   |
 * |                              |
 * |------------------------------|
 * @param coverPixelsBounds cover rect 的像素坐标范围以及数据宽高
 * @param coverData         cover rect 的数据
 * @param coverDataSize     cover rect 的数据宽高
 * @param pixelBounds       pixels 的像素坐标范围
 * @param pixelData         pixels 的数据
 * 1. 根据 cover rect 中的值计算在 pixels 中对应的值
 * 2. 根据对应 pixels 中的值判断 cover rect 的值是否有效
 * 3. 过滤 cover rect 中有效的值
 * @param coverRectData
 * @param pixelBounds
 * @param pixels
 * @returns
 */
export function pixelFilter(
  coverData: number[],
  coverRect: number[],
  coverPixelsBounds: number[],
  pixelBounds: number[],
  pixels: number[],
) {
  // 数据的宽高
  const coverWidthCount = coverRect[2] - coverRect[0]; // data width
  const coverHeightCount = coverRect[3] - coverRect[1]; // data height
  // 覆盖矩形的像素坐标范围
  const [coverPixelMinX, coverPixelMinY, coverPixelMaxX, coverPixelMaxY] =
    coverPixelsBounds;
  const [pixelMinX, pixelMinY, pixelWidth, pixelHeight] = pixelBounds;
  // 覆盖矩形的像素宽高
  const coverPixelHeight = coverPixelMaxY - coverPixelMinY;
  const coverPixelWidth = coverPixelMaxX - coverPixelMinX;
  // console.log('coverPixelWidth', coverPixelWidth)
  // console.log('coverPixelHeight', coverPixelHeight)
  // 覆盖矩形的像素坐标与过滤的几何形状的像素坐标的偏移量
  const offsetX = coverPixelMinX - pixelMinX;
  const offsetY = coverPixelMinY - pixelMinY;
  // console.log('offsetX', offsetX)
  // console.log('offsetY', offsetY)
  // 判断覆盖的矩形区域数据是否在过滤的几何形状内部（根据 pickFrameBuffer 的渲染纹理进行判断）
  const filterData = [];
  for (let y = 0; y < coverHeightCount; y++) {
    for (let x = 0; x < coverWidthCount; x++) {
      // 将坐标转换为像素坐标，并根据像素坐标从 pickFrameBuffer 中提取对应的像素值
      // 计算数据坐标对应的像素点位的坐标
      const pixelX = Math.floor(offsetX + (x * pixelWidth) / coverPixelWidth);
      const pixelY = Math.floor(offsetY + (y * pixelHeight) / coverPixelHeight);
      // let pixelX = Math.floor(
      //   offsetX + x * (coverPixelWidth / coverWidthCount),
      // ) ;
      // if(x < coverWidthCount/2 ) {
      //   pixelX = pixelX - 1
      // } else {
      //   pixelX = pixelX + 1
      // }
      // let pixelY = Math.floor(
      //   offsetY + y * (coverPixelHeight / coverHeightCount),
      // );
      // if(y < coverHeightCount/2 ) {
      //   pixelY = pixelY - 1
      // } else {
      //   pixelY = pixelY + 1
      // }
      const pixelIndex = pixelY * coverPixelWidth + pixelX;
      // 根据像素值判断
      if (pixels[pixelIndex] > 0) {
        // 数据在几何形状内部
        const coverDataIndex = y * coverWidthCount + x;
        filterData.push(coverData[coverDataIndex]);
      } else {
        filterData.push(null);
      }
    }
  }
  return filterData;
}
