"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromWhiteIsZero = fromWhiteIsZero;
exports.fromBlackIsZero = fromBlackIsZero;
exports.fromPalette = fromPalette;
exports.fromCMYK = fromCMYK;
exports.fromYCbCr = fromYCbCr;
exports.fromCIELab = fromCIELab;
function fromWhiteIsZero(raster, max) {
  var width = raster.width,
      height = raster.height;

  var rgbRaster = new Uint8Array(width * height * 3);
  var value = void 0;
  for (var i = 0, j = 0; i < raster.length; ++i, j += 3) {
    value = 256 - raster[i] / max * 256;
    rgbRaster[j] = value;
    rgbRaster[j + 1] = value;
    rgbRaster[j + 2] = value;
  }
  return rgbRaster;
}

function fromBlackIsZero(raster, max) {
  var width = raster.width,
      height = raster.height;

  var rgbRaster = new Uint8Array(width * height * 3);
  var value = void 0;
  for (var i = 0, j = 0; i < raster.length; ++i, j += 3) {
    value = raster[i] / max * 256;
    rgbRaster[j] = value;
    rgbRaster[j + 1] = value;
    rgbRaster[j + 2] = value;
  }
  return rgbRaster;
}

function fromPalette(raster, colorMap) {
  var width = raster.width,
      height = raster.height;

  var rgbRaster = new Uint8Array(width * height * 3);
  var greenOffset = colorMap.length / 3;
  var blueOffset = colorMap.length / 3 * 2;
  for (var i = 0, j = 0; i < raster.length; ++i, j += 3) {
    var mapIndex = raster[i];
    rgbRaster[j] = colorMap[mapIndex] / 65536 * 256;
    rgbRaster[j + 1] = colorMap[mapIndex + greenOffset] / 65536 * 256;
    rgbRaster[j + 2] = colorMap[mapIndex + blueOffset] / 65536 * 256;
  }
  return rgbRaster;
}

function fromCMYK(cmykRaster) {
  var width = cmykRaster.width,
      height = cmykRaster.height;

  var rgbRaster = new Uint8Array(width * height * 3);
  for (var i = 0, j = 0; i < cmykRaster.length; i += 4, j += 3) {
    var c = cmykRaster[i];
    var m = cmykRaster[i + 1];
    var y = cmykRaster[i + 2];
    var k = cmykRaster[i + 3];

    rgbRaster[j] = 255 * ((255 - c) / 256) * ((255 - k) / 256);
    rgbRaster[j + 1] = 255 * ((255 - m) / 256) * ((255 - k) / 256);
    rgbRaster[j + 2] = 255 * ((255 - y) / 256) * ((255 - k) / 256);
  }
  return rgbRaster;
}

function fromYCbCr(yCbCrRaster) {
  var width = yCbCrRaster.width,
      height = yCbCrRaster.height;

  var rgbRaster = new Uint8ClampedArray(width * height * 3);
  for (var i = 0, j = 0; i < yCbCrRaster.length; i += 3, j += 3) {
    var y = yCbCrRaster[i];
    var cb = yCbCrRaster[i + 1];
    var cr = yCbCrRaster[i + 2];

    rgbRaster[j] = y + 1.40200 * (cr - 0x80);
    rgbRaster[j + 1] = y - 0.34414 * (cb - 0x80) - 0.71414 * (cr - 0x80);
    rgbRaster[j + 2] = y + 1.77200 * (cb - 0x80);
  }
  return rgbRaster;
}

var Xn = 0.95047;
var Yn = 1.00000;
var Zn = 1.08883;

// from https://github.com/antimatter15/rgb-lab/blob/master/color.js

function fromCIELab(cieLabRaster) {
  var width = cieLabRaster.width,
      height = cieLabRaster.height;

  var rgbRaster = new Uint8Array(width * height * 3);

  for (var i = 0, j = 0; i < cieLabRaster.length; i += 3, j += 3) {
    var L = cieLabRaster[i + 0];
    var a_ = cieLabRaster[i + 1] << 24 >> 24; // conversion from uint8 to int8
    var b_ = cieLabRaster[i + 2] << 24 >> 24; // same

    var y = (L + 16) / 116;
    var x = a_ / 500 + y;
    var z = y - b_ / 200;
    var r = void 0;
    var g = void 0;
    var b = void 0;

    x = Xn * (x * x * x > 0.008856 ? x * x * x : (x - 16 / 116) / 7.787);
    y = Yn * (y * y * y > 0.008856 ? y * y * y : (y - 16 / 116) / 7.787);
    z = Zn * (z * z * z > 0.008856 ? z * z * z : (z - 16 / 116) / 7.787);

    r = x * 3.2406 + y * -1.5372 + z * -0.4986;
    g = x * -0.9689 + y * 1.8758 + z * 0.0415;
    b = x * 0.0557 + y * -0.2040 + z * 1.0570;

    r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
    g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
    b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;

    rgbRaster[j] = Math.max(0, Math.min(1, r)) * 255;
    rgbRaster[j + 1] = Math.max(0, Math.min(1, g)) * 255;
    rgbRaster[j + 2] = Math.max(0, Math.min(1, b)) * 255;
  }
  return rgbRaster;
}
/* eslint-enable */