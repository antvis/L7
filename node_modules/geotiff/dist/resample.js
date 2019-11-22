'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resampleNearest = resampleNearest;
exports.resampleBilinear = resampleBilinear;
exports.resample = resample;
exports.resampleNearestInterleaved = resampleNearestInterleaved;
exports.resampleBilinearInterleaved = resampleBilinearInterleaved;
exports.resampleInterleaved = resampleInterleaved;
/**
 * @module resample
 */

function copyNewSize(array, width, height) {
  var samplesPerPixel = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

  return new (Object.getPrototypeOf(array).constructor)(width * height * samplesPerPixel);
}

/**
 * Resample the input arrays using nearest neighbor value selection.
 * @param {TypedArray[]} valueArrays The input arrays to resample
 * @param {number} inWidth The width of the input rasters
 * @param {number} inHeight The height of the input rasters
 * @param {number} outWidth The desired width of the output rasters
 * @param {number} outHeight The desired height of the output rasters
 * @returns {TypedArray[]} The resampled rasters
 */
function resampleNearest(valueArrays, inWidth, inHeight, outWidth, outHeight) {
  var relX = inWidth / outWidth;
  var relY = inHeight / outHeight;
  return valueArrays.map(function (array) {
    var newArray = copyNewSize(array, outWidth, outHeight);
    for (var y = 0; y < outHeight; ++y) {
      var cy = Math.min(Math.round(relY * y), inHeight - 1);
      for (var x = 0; x < outWidth; ++x) {
        var cx = Math.min(Math.round(relX * x), inWidth - 1);
        var value = array[cy * inWidth + cx];
        newArray[y * outWidth + x] = value;
      }
    }
    return newArray;
  });
}

// simple linear interpolation, code from:
// https://en.wikipedia.org/wiki/Linear_interpolation#Programming_language_support
function lerp(v0, v1, t) {
  return (1 - t) * v0 + t * v1;
}

/**
 * Resample the input arrays using bilinear interpolation.
 * @param {TypedArray[]} valueArrays The input arrays to resample
 * @param {number} inWidth The width of the input rasters
 * @param {number} inHeight The height of the input rasters
 * @param {number} outWidth The desired width of the output rasters
 * @param {number} outHeight The desired height of the output rasters
 * @returns {TypedArray[]} The resampled rasters
 */
function resampleBilinear(valueArrays, inWidth, inHeight, outWidth, outHeight) {
  var relX = inWidth / outWidth;
  var relY = inHeight / outHeight;

  return valueArrays.map(function (array) {
    var newArray = copyNewSize(array, outWidth, outHeight);
    for (var y = 0; y < outHeight; ++y) {
      var rawY = relY * y;

      var yl = Math.floor(rawY);
      var yh = Math.min(Math.ceil(rawY), inHeight - 1);

      for (var x = 0; x < outWidth; ++x) {
        var rawX = relX * x;
        var tx = rawX % 1;

        var xl = Math.floor(rawX);
        var xh = Math.min(Math.ceil(rawX), inWidth - 1);

        var ll = array[yl * inWidth + xl];
        var hl = array[yl * inWidth + xh];
        var lh = array[yh * inWidth + xl];
        var hh = array[yh * inWidth + xh];

        var value = lerp(lerp(ll, hl, tx), lerp(lh, hh, tx), rawY % 1);
        newArray[y * outWidth + x] = value;
      }
    }
    return newArray;
  });
}

/**
 * Resample the input arrays using the selected resampling method.
 * @param {TypedArray[]} valueArrays The input arrays to resample
 * @param {number} inWidth The width of the input rasters
 * @param {number} inHeight The height of the input rasters
 * @param {number} outWidth The desired width of the output rasters
 * @param {number} outHeight The desired height of the output rasters
 * @param {string} [method = 'nearest'] The desired resampling method
 * @returns {TypedArray[]} The resampled rasters
 */
function resample(valueArrays, inWidth, inHeight, outWidth, outHeight) {
  var method = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'nearest';

  switch (method.toLowerCase()) {
    case 'nearest':
      return resampleNearest(valueArrays, inWidth, inHeight, outWidth, outHeight);
    case 'bilinear':
    case 'linear':
      return resampleBilinear(valueArrays, inWidth, inHeight, outWidth, outHeight);
    default:
      throw new Error('Unsupported resampling method: \'' + method + '\'');
  }
}

/**
 * Resample the pixel interleaved input array using nearest neighbor value selection.
 * @param {TypedArray} valueArrays The input arrays to resample
 * @param {number} inWidth The width of the input rasters
 * @param {number} inHeight The height of the input rasters
 * @param {number} outWidth The desired width of the output rasters
 * @param {number} outHeight The desired height of the output rasters
 * @param {number} samples The number of samples per pixel for pixel
 *                         interleaved data
 * @returns {TypedArray} The resampled raster
 */
function resampleNearestInterleaved(valueArray, inWidth, inHeight, outWidth, outHeight, samples) {
  var relX = inWidth / outWidth;
  var relY = inHeight / outHeight;

  var newArray = copyNewSize(valueArray, outWidth, outHeight, samples);
  for (var y = 0; y < outHeight; ++y) {
    var cy = Math.min(Math.round(relY * y), inHeight - 1);
    for (var x = 0; x < outWidth; ++x) {
      var cx = Math.min(Math.round(relX * x), inWidth - 1);
      for (var i = 0; i < samples; ++i) {
        var value = valueArray[cy * inWidth * samples + cx * samples + i];
        newArray[y * outWidth * samples + x * samples + i] = value;
      }
    }
  }
  return newArray;
}

/**
 * Resample the pixel interleaved input array using bilinear interpolation.
 * @param {TypedArray} valueArrays The input arrays to resample
 * @param {number} inWidth The width of the input rasters
 * @param {number} inHeight The height of the input rasters
 * @param {number} outWidth The desired width of the output rasters
 * @param {number} outHeight The desired height of the output rasters
 * @param {number} samples The number of samples per pixel for pixel
 *                         interleaved data
 * @returns {TypedArray} The resampled raster
 */
function resampleBilinearInterleaved(valueArray, inWidth, inHeight, outWidth, outHeight, samples) {
  var relX = inWidth / outWidth;
  var relY = inHeight / outHeight;
  var newArray = copyNewSize(valueArray, outWidth, outHeight, samples);
  for (var y = 0; y < outHeight; ++y) {
    var rawY = relY * y;

    var yl = Math.floor(rawY);
    var yh = Math.min(Math.ceil(rawY), inHeight - 1);

    for (var x = 0; x < outWidth; ++x) {
      var rawX = relX * x;
      var tx = rawX % 1;

      var xl = Math.floor(rawX);
      var xh = Math.min(Math.ceil(rawX), inWidth - 1);

      for (var i = 0; i < samples; ++i) {
        var ll = valueArray[yl * inWidth * samples + xl * samples + i];
        var hl = valueArray[yl * inWidth * samples + xh * samples + i];
        var lh = valueArray[yh * inWidth * samples + xl * samples + i];
        var hh = valueArray[yh * inWidth * samples + xh * samples + i];

        var value = lerp(lerp(ll, hl, tx), lerp(lh, hh, tx), rawY % 1);
        newArray[y * outWidth * samples + x * samples + i] = value;
      }
    }
  }
  return newArray;
}

/**
 * Resample the pixel interleaved input array using the selected resampling method.
 * @param {TypedArray} valueArray The input array to resample
 * @param {number} inWidth The width of the input rasters
 * @param {number} inHeight The height of the input rasters
 * @param {number} outWidth The desired width of the output rasters
 * @param {number} outHeight The desired height of the output rasters
 * @param {number} samples The number of samples per pixel for pixel
 *                                 interleaved data
 * @param {string} [method = 'nearest'] The desired resampling method
 * @returns {TypedArray} The resampled rasters
 */
function resampleInterleaved(valueArray, inWidth, inHeight, outWidth, outHeight, samples) {
  var method = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 'nearest';

  switch (method.toLowerCase()) {
    case 'nearest':
      return resampleNearestInterleaved(valueArray, inWidth, inHeight, outWidth, outHeight, samples);
    case 'bilinear':
    case 'linear':
      return resampleBilinearInterleaved(valueArray, inWidth, inHeight, outWidth, outHeight, samples);
    default:
      throw new Error('Unsupported resampling method: \'' + method + '\'');
  }
}