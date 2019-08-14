/**
 * tiny-sdf 中每个 glyph 的宽度（加上 buffer 24 + 3 + 3 = 30）
 */
const glyphSizeInSDF = 30;

export function nextPowOfTwo(number) {
  return Math.pow(2, Math.ceil(Math.log2(number)));
}

export function buildMapping({
  characterSet,
  getFontWidth,
  fontHeight,
  buffer,
  maxCanvasWidth,
  mapping = {},
  xOffset = 0,
  yOffset = 0
}) {
  let row = 0;
  let x = xOffset;
  Array.from(characterSet).forEach((char, i) => {
    if (!mapping[char]) {
      const width = getFontWidth(char, i);
      if (x + glyphSizeInSDF > maxCanvasWidth) {
      // if (x + width + buffer * 2 > maxCanvasWidth) {
        x = 0;
        row++;
      }
      mapping[char] = {
        // x: x + buffer,
        x,
        y: yOffset + row * glyphSizeInSDF,
        // y: yOffset + row * (fontHeight + buffer * 2) + buffer,
        width: glyphSizeInSDF,
        // height: fontHeight,
        height: glyphSizeInSDF,
        advance: width
      };
      // x += width + buffer * 2;
      x += glyphSizeInSDF;
    }
  });

  const rowHeight = fontHeight + buffer * 2;

  return {
    mapping,
    xOffset: x,
    yOffset: yOffset + row * rowHeight,
    canvasHeight: nextPowOfTwo(yOffset + (row + 1) * rowHeight)
  };
}

function buildRowMapping(mapping, columns, yOffset) {
  for (let i = 0; i < columns.length; i++) {
    const { icon, xOffset } = columns[i];
    mapping[icon.id] = Object.assign({}, icon, {
      x: xOffset,
      y: yOffset,
      image: icon.image
    });
  }
}
export function resizeImage(ctx, imageData, width, height) {
  const { naturalWidth, naturalHeight } = imageData;
  if (width === naturalWidth && height === naturalHeight) {
    return imageData;
  }

  ctx.canvas.height = height;
  ctx.canvas.width = width;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
  ctx.drawImage(imageData, 0, 0, naturalWidth, naturalHeight, 0, 0, width, height);

  return ctx.canvas;
}

export function buildIconMaping({ icons, buffer, maxCanvasWidth }) {
  let xOffset = 0;
  let yOffset = 0;
  let rowHeight = 0;
  let columns = [];
  const mapping = {};
  for (let i = 0; i < icons.length; i++) {
    const icon = icons[i];
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
        xOffset
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
    canvasHeight
  };
}
