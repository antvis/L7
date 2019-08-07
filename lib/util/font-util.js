"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nextPowOfTwo = nextPowOfTwo;
exports.buildMapping = buildMapping;
exports.resizeImage = resizeImage;
exports.buildIconMaping = buildIconMaping;

function nextPowOfTwo(number) {
  return Math.pow(2, Math.ceil(Math.log2(number)));
}

function buildMapping(_ref) {
  var characterSet = _ref.characterSet,
      getFontWidth = _ref.getFontWidth,
      fontHeight = _ref.fontHeight,
      buffer = _ref.buffer,
      maxCanvasWidth = _ref.maxCanvasWidth,
      _ref$mapping = _ref.mapping,
      mapping = _ref$mapping === void 0 ? {} : _ref$mapping,
      _ref$xOffset = _ref.xOffset,
      xOffset = _ref$xOffset === void 0 ? 0 : _ref$xOffset,
      _ref$yOffset = _ref.yOffset,
      yOffset = _ref$yOffset === void 0 ? 0 : _ref$yOffset;
  var row = 0;
  var x = xOffset;
  Array.from(characterSet).forEach(function (_char, i) {
    if (!mapping[_char]) {
      var width = getFontWidth(_char, i);

      if (x + width + buffer * 2 > maxCanvasWidth) {
        x = 0;
        row++;
      }

      mapping[_char] = {
        x: x + buffer,
        y: yOffset + row * (fontHeight + buffer * 2) + buffer,
        width: width,
        height: fontHeight,
        mask: true
      };
      x += width + buffer * 2;
    }
  });
  var rowHeight = fontHeight + buffer * 2;
  return {
    mapping: mapping,
    xOffset: x,
    yOffset: yOffset + row * rowHeight,
    canvasHeight: nextPowOfTwo(yOffset + (row + 1) * rowHeight)
  };
}

function buildRowMapping(mapping, columns, yOffset) {
  for (var i = 0; i < columns.length; i++) {
    var _columns$i = columns[i],
        icon = _columns$i.icon,
        xOffset = _columns$i.xOffset;
    mapping[icon.id] = Object.assign({}, icon, {
      x: xOffset,
      y: yOffset,
      image: icon.image
    });
  }
}

function resizeImage(ctx, imageData, width, height) {
  var naturalWidth = imageData.naturalWidth,
      naturalHeight = imageData.naturalHeight;

  if (width === naturalWidth && height === naturalHeight) {
    return imageData;
  }

  ctx.canvas.height = height;
  ctx.canvas.width = width;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight

  ctx.drawImage(imageData, 0, 0, naturalWidth, naturalHeight, 0, 0, width, height);
  return ctx.canvas;
}

function buildIconMaping(_ref2) {
  var icons = _ref2.icons,
      buffer = _ref2.buffer,
      maxCanvasWidth = _ref2.maxCanvasWidth;
  var xOffset = 0;
  var yOffset = 0;
  var rowHeight = 0;
  var columns = [];
  var mapping = {};

  for (var i = 0; i < icons.length; i++) {
    var icon = icons[i];

    if (!mapping[icon.id]) {
      var height = icon.height,
          width = icon.width; // fill one row

      if (xOffset + width + buffer > maxCanvasWidth) {
        buildRowMapping(mapping, columns, yOffset);
        xOffset = 0;
        yOffset = rowHeight + yOffset + buffer;
        rowHeight = 0;
        columns = [];
      }

      columns.push({
        icon: icon,
        xOffset: xOffset
      });
      xOffset = xOffset + width + buffer;
      rowHeight = Math.max(rowHeight, height);
    }
  }

  if (columns.length > 0) {
    buildRowMapping(mapping, columns, yOffset);
  }

  var canvasHeight = nextPowOfTwo(rowHeight + yOffset + buffer);
  return {
    mapping: mapping,
    canvasHeight: canvasHeight
  };
}