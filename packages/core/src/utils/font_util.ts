import {
  IIcon,
  IICONMap,
  IIconService,
  IIconValue,
  IImage,
} from '../services/asset/IIconService';
export function buildIconMaping(
  icons: IIcon[],
  buffer: number,
  maxCanvasWidth: number,
) {
  let xOffset = 0;
  let yOffset = 0;
  let rowHeight = 0;
  let columns = [];
  const mapping: IICONMap = {};
  for (const icon of icons) {
    if (!mapping[icon.id]) {
      const { height, width } = icon;

      // fill one row
      if (xOffset + width + buffer > maxCanvasWidth) {
        buildRowMapping(mapping, columns, yOffset);

        xOffset = 0;
        yOffset = rowHeight + yOffset + buffer;
        rowHeight = 0;
        columns = [];
      }

      columns.push({
        icon,
        xOffset,
      });

      xOffset = xOffset + width + buffer;
      rowHeight = Math.max(rowHeight, height);
    }
  }

  if (columns.length > 0) {
    buildRowMapping(mapping, columns, yOffset);
  }

  const canvasHeight = nextPowOfTwo(rowHeight + yOffset + buffer);

  return {
    mapping,
    canvasHeight,
  };
}
function buildRowMapping(
  mapping: IICONMap,
  columns: Array<{
    icon: IIcon;
    xOffset: number;
  }>,
  yOffset: number,
) {
  for (const column of columns) {
    const { icon, xOffset } = column;
    mapping[icon.id] = { ...icon, x: xOffset, y: yOffset, image: icon.image };
  }
}
export function nextPowOfTwo(num: number) {
  return Math.pow(2, Math.ceil(Math.log2(num)));
}
