import type { IFontMappingOption } from '../services/asset/IFontService';
import type { IIcon, IICONMap } from '../services/asset/IIconService';
/**
 * tiny-sdf 中每个 glyph 的宽度（加上 buffer 24 + 3 + 3 = 30）
 */
const glyphSizeInSDF = 30;
export function buildMapping({
  characterSet,
  getFontWidth,
  fontHeight,
  buffer,
  maxCanvasWidth,
  mapping = {},
  xOffset = 0,
  yOffset = 0,
}: IFontMappingOption) {
  let row = 0;
  let x = xOffset;
  Array.from(characterSet).forEach((char: string, i: number) => {
    if (!mapping[char]) {
      const width = getFontWidth(char, i);
      if (x + glyphSizeInSDF > maxCanvasWidth) {
        x = 0;
        row++;
      }
      mapping[char] = {
        x,
        y: yOffset + row * glyphSizeInSDF,
        width: glyphSizeInSDF,
        height: glyphSizeInSDF,
        advance: width,
      };
      x += glyphSizeInSDF;
    }
  });

  const rowHeight = fontHeight + buffer * 2;
  return {
    mapping,
    xOffset: x,
    yOffset: yOffset + row * rowHeight,
    canvasHeight: nextPowOfTwo(yOffset + (row + 1) * rowHeight),
  };
}

export function buildIconMaping(icons: IIcon[], buffer: number, maxCanvasWidth: number) {
  let xOffset = 0;
  let yOffset = 0;
  let rowHeight = 0;
  let columns = [];
  const mapping: IICONMap = {};
  for (const icon of icons) {
    if (!mapping[icon.id]) {
      const { size } = icon;

      // fill one row
      if (xOffset + size + buffer > maxCanvasWidth) {
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

      xOffset = xOffset + size + buffer;
      rowHeight = Math.max(rowHeight, size);
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
    mapping[icon.id] = {
      ...icon,
      x: xOffset,
      y: yOffset,
      image: icon.image,
      width: icon.width,
      height: icon.height,
    };
  }
}
export function nextPowOfTwo(num: number) {
  return Math.pow(2, Math.ceil(Math.log2(num)));
}
