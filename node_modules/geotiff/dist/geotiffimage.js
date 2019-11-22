'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _globals = require('./globals');

var _rgb = require('./rgb');

var _compression = require('./compression');

var _resample = require('./resample');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint max-len: ["error", { "code": 120 }] */

function sum(array, start, end) {
  var s = 0;
  for (var i = start; i < end; ++i) {
    s += array[i];
  }
  return s;
}

function arrayForType(format, bitsPerSample, size) {
  switch (format) {
    case 1:
      // unsigned integer data
      switch (bitsPerSample) {
        case 8:
          return new Uint8Array(size);
        case 16:
          return new Uint16Array(size);
        case 32:
          return new Uint32Array(size);
        default:
          break;
      }
      break;
    case 2:
      // twos complement signed integer data
      switch (bitsPerSample) {
        case 8:
          return new Int8Array(size);
        case 16:
          return new Int16Array(size);
        case 32:
          return new Int32Array(size);
        default:
          break;
      }
      break;
    case 3:
      // floating point data
      switch (bitsPerSample) {
        case 32:
          return new Float32Array(size);
        case 64:
          return new Float64Array(size);
        default:
          break;
      }
      break;
    default:
      break;
  }
  throw Error('Unsupported data format/bitsPerSample');
}

/**
 * GeoTIFF sub-file image.
 */

var GeoTIFFImage = function () {
  /**
   * @constructor
   * @param {Object} fileDirectory The parsed file directory
   * @param {Object} geoKeys The parsed geo-keys
   * @param {DataView} dataView The DataView for the underlying file.
   * @param {Boolean} littleEndian Whether the file is encoded in little or big endian
   * @param {Boolean} cache Whether or not decoded tiles shall be cached
   * @param {Source} source The datasource to read from
   */
  function GeoTIFFImage(fileDirectory, geoKeys, dataView, littleEndian, cache, source) {
    (0, _classCallCheck3.default)(this, GeoTIFFImage);

    this.fileDirectory = fileDirectory;
    this.geoKeys = geoKeys;
    this.dataView = dataView;
    this.littleEndian = littleEndian;
    this.tiles = cache ? {} : null;
    this.isTiled = !fileDirectory.StripOffsets;
    var planarConfiguration = fileDirectory.PlanarConfiguration;
    this.planarConfiguration = typeof planarConfiguration === 'undefined' ? 1 : planarConfiguration;
    if (this.planarConfiguration !== 1 && this.planarConfiguration !== 2) {
      throw new Error('Invalid planar configuration.');
    }

    this.source = source;
  }

  /**
   * Returns the associated parsed file directory.
   * @returns {Object} the parsed file directory
   */


  (0, _createClass3.default)(GeoTIFFImage, [{
    key: 'getFileDirectory',
    value: function getFileDirectory() {
      return this.fileDirectory;
    }
    /**
     * Returns the associated parsed geo keys.
     * @returns {Object} the parsed geo keys
     */

  }, {
    key: 'getGeoKeys',
    value: function getGeoKeys() {
      return this.geoKeys;
    }
    /**
     * Returns the width of the image.
     * @returns {Number} the width of the image
     */

  }, {
    key: 'getWidth',
    value: function getWidth() {
      return this.fileDirectory.ImageWidth;
    }
    /**
     * Returns the height of the image.
     * @returns {Number} the height of the image
     */

  }, {
    key: 'getHeight',
    value: function getHeight() {
      return this.fileDirectory.ImageLength;
    }
    /**
     * Returns the number of samples per pixel.
     * @returns {Number} the number of samples per pixel
     */

  }, {
    key: 'getSamplesPerPixel',
    value: function getSamplesPerPixel() {
      return this.fileDirectory.SamplesPerPixel;
    }
    /**
     * Returns the width of each tile.
     * @returns {Number} the width of each tile
     */

  }, {
    key: 'getTileWidth',
    value: function getTileWidth() {
      return this.isTiled ? this.fileDirectory.TileWidth : this.getWidth();
    }
    /**
     * Returns the height of each tile.
     * @returns {Number} the height of each tile
     */

  }, {
    key: 'getTileHeight',
    value: function getTileHeight() {
      return this.isTiled ? this.fileDirectory.TileLength : this.fileDirectory.RowsPerStrip;
    }

    /**
     * Calculates the number of bytes for each pixel across all samples. Only full
     * bytes are supported, an exception is thrown when this is not the case.
     * @returns {Number} the bytes per pixel
     */

  }, {
    key: 'getBytesPerPixel',
    value: function getBytesPerPixel() {
      var bitsPerSample = 0;
      for (var i = 0; i < this.fileDirectory.BitsPerSample.length; ++i) {
        var bits = this.fileDirectory.BitsPerSample[i];
        if (bits % 8 !== 0) {
          throw new Error('Sample bit-width of ' + bits + ' is not supported.');
        } else if (bits !== this.fileDirectory.BitsPerSample[0]) {
          throw new Error('Differing size of samples in a pixel are not supported.');
        }
        bitsPerSample += bits;
      }
      return bitsPerSample / 8;
    }
  }, {
    key: 'getSampleByteSize',
    value: function getSampleByteSize(i) {
      if (i >= this.fileDirectory.BitsPerSample.length) {
        throw new RangeError('Sample index ' + i + ' is out of range.');
      }
      var bits = this.fileDirectory.BitsPerSample[i];
      if (bits % 8 !== 0) {
        throw new Error('Sample bit-width of ' + bits + ' is not supported.');
      }
      return bits / 8;
    }
  }, {
    key: 'getReaderForSample',
    value: function getReaderForSample(sampleIndex) {
      var format = this.fileDirectory.SampleFormat ? this.fileDirectory.SampleFormat[sampleIndex] : 1;
      var bitsPerSample = this.fileDirectory.BitsPerSample[sampleIndex];
      switch (format) {
        case 1:
          // unsigned integer data
          switch (bitsPerSample) {
            case 8:
              return DataView.prototype.getUint8;
            case 16:
              return DataView.prototype.getUint16;
            case 32:
              return DataView.prototype.getUint32;
            default:
              break;
          }
          break;
        case 2:
          // twos complement signed integer data
          switch (bitsPerSample) {
            case 8:
              return DataView.prototype.getInt8;
            case 16:
              return DataView.prototype.getInt16;
            case 32:
              return DataView.prototype.getInt32;
            default:
              break;
          }
          break;
        case 3:
          switch (bitsPerSample) {
            case 32:
              return DataView.prototype.getFloat32;
            case 64:
              return DataView.prototype.getFloat64;
            default:
              break;
          }
          break;
        default:
          break;
      }
      throw Error('Unsupported data format/bitsPerSample');
    }
  }, {
    key: 'getArrayForSample',
    value: function getArrayForSample(sampleIndex, size) {
      var format = this.fileDirectory.SampleFormat ? this.fileDirectory.SampleFormat[sampleIndex] : 1;
      var bitsPerSample = this.fileDirectory.BitsPerSample[sampleIndex];
      return arrayForType(format, bitsPerSample, size);
    }

    /**
     * Returns the decoded strip or tile.
     * @param {Number} x the strip or tile x-offset
     * @param {Number} y the tile y-offset (0 for stripped images)
     * @param {Number} sample the sample to get for separated samples
     * @param {Pool|AbstractDecoder} poolOrDecoder the decoder or decoder pool
     * @returns {Promise.<ArrayBuffer>}
     */

  }, {
    key: 'getTileOrStrip',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(x, y, sample, poolOrDecoder) {
        var numTilesPerRow, numTilesPerCol, index, tiles, offset, byteCount, slice, request;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                numTilesPerRow = Math.ceil(this.getWidth() / this.getTileWidth());
                numTilesPerCol = Math.ceil(this.getHeight() / this.getTileHeight());
                index = void 0;
                tiles = this.tiles;

                if (this.planarConfiguration === 1) {
                  index = y * numTilesPerRow + x;
                } else if (this.planarConfiguration === 2) {
                  index = sample * numTilesPerRow * numTilesPerCol + y * numTilesPerRow + x;
                }

                offset = void 0;
                byteCount = void 0;

                if (this.isTiled) {
                  offset = this.fileDirectory.TileOffsets[index];
                  byteCount = this.fileDirectory.TileByteCounts[index];
                } else {
                  offset = this.fileDirectory.StripOffsets[index];
                  byteCount = this.fileDirectory.StripByteCounts[index];
                }
                _context.next = 10;
                return this.source.fetch(offset, byteCount);

              case 10:
                slice = _context.sent;


                // either use the provided pool or decoder to decode the data
                request = void 0;

                if (tiles === null) {
                  request = poolOrDecoder.decode(this.fileDirectory, slice);
                } else if (!tiles[index]) {
                  request = poolOrDecoder.decode(this.fileDirectory, slice);
                  tiles[index] = request;
                }
                _context.t0 = x;
                _context.t1 = y;
                _context.t2 = sample;
                _context.next = 18;
                return request;

              case 18:
                _context.t3 = _context.sent;
                return _context.abrupt('return', {
                  x: _context.t0,
                  y: _context.t1,
                  sample: _context.t2,
                  data: _context.t3
                });

              case 20:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getTileOrStrip(_x, _x2, _x3, _x4) {
        return _ref.apply(this, arguments);
      }

      return getTileOrStrip;
    }()

    /**
     * Internal read function.
     * @private
     * @param {Array} imageWindow The image window in pixel coordinates
     * @param {Array} samples The selected samples (0-based indices)
     * @param {TypedArray[]|TypedArray} valueArrays The array(s) to write into
     * @param {Boolean} interleave Whether or not to write in an interleaved manner
     * @param {Pool} pool The decoder pool
     * @returns {Promise<TypedArray[]>|Promise<TypedArray>}
     */

  }, {
    key: '_readRaster',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(imageWindow, samples, valueArrays, interleave, poolOrDecoder, width, height, resampleMethod) {
        var _this = this;

        var tileWidth, tileHeight, minXTile, maxXTile, minYTile, maxYTile, windowWidth, bytesPerPixel, srcSampleOffsets, sampleReaders, i, promises, littleEndian, yTile, xTile, _loop, sampleIndex, resampled;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                tileWidth = this.getTileWidth();
                tileHeight = this.getTileHeight();
                minXTile = Math.max(Math.floor(imageWindow[0] / tileWidth), 0);
                maxXTile = Math.min(Math.ceil(imageWindow[2] / tileWidth), Math.ceil(this.getWidth() / this.getTileWidth()));
                minYTile = Math.max(Math.floor(imageWindow[1] / tileHeight), 0);
                maxYTile = Math.min(Math.ceil(imageWindow[3] / tileHeight), Math.ceil(this.getHeight() / this.getTileHeight()));
                windowWidth = imageWindow[2] - imageWindow[0];
                bytesPerPixel = this.getBytesPerPixel();
                srcSampleOffsets = [];
                sampleReaders = [];

                for (i = 0; i < samples.length; ++i) {
                  if (this.planarConfiguration === 1) {
                    srcSampleOffsets.push(sum(this.fileDirectory.BitsPerSample, 0, samples[i]) / 8);
                  } else {
                    srcSampleOffsets.push(0);
                  }
                  sampleReaders.push(this.getReaderForSample(samples[i]));
                }

                promises = [];
                littleEndian = this.littleEndian;


                for (yTile = minYTile; yTile < maxYTile; ++yTile) {
                  for (xTile = minXTile; xTile < maxXTile; ++xTile) {
                    _loop = function _loop(sampleIndex) {
                      var si = sampleIndex;
                      var sample = samples[sampleIndex];
                      if (_this.planarConfiguration === 2) {
                        bytesPerPixel = _this.getSampleByteSize(sample);
                      }
                      var promise = _this.getTileOrStrip(xTile, yTile, sample, poolOrDecoder);
                      promises.push(promise);
                      promise.then(function (tile) {
                        var buffer = tile.data;
                        var dataView = new DataView(buffer);
                        var firstLine = tile.y * tileHeight;
                        var firstCol = tile.x * tileWidth;
                        var lastLine = (tile.y + 1) * tileHeight;
                        var lastCol = (tile.x + 1) * tileWidth;
                        var reader = sampleReaders[si];

                        var ymax = Math.min(tileHeight, tileHeight - (lastLine - imageWindow[3]));
                        var xmax = Math.min(tileWidth, tileWidth - (lastCol - imageWindow[2]));

                        for (var y = Math.max(0, imageWindow[1] - firstLine); y < ymax; ++y) {
                          for (var x = Math.max(0, imageWindow[0] - firstCol); x < xmax; ++x) {
                            var pixelOffset = (y * tileWidth + x) * bytesPerPixel;
                            var value = reader.call(dataView, pixelOffset + srcSampleOffsets[si], littleEndian);
                            var windowCoordinate = void 0;
                            if (interleave) {
                              windowCoordinate = (y + firstLine - imageWindow[1]) * windowWidth * samples.length + (x + firstCol - imageWindow[0]) * samples.length + si;
                              valueArrays[windowCoordinate] = value;
                            } else {
                              windowCoordinate = (y + firstLine - imageWindow[1]) * windowWidth + x + firstCol - imageWindow[0];
                              valueArrays[si][windowCoordinate] = value;
                            }
                          }
                        }
                      });
                    };

                    for (sampleIndex = 0; sampleIndex < samples.length; ++sampleIndex) {
                      _loop(sampleIndex);
                    }
                  }
                }
                _context2.next = 16;
                return Promise.all(promises);

              case 16:
                if (!(width && imageWindow[2] - imageWindow[0] !== width || height && imageWindow[3] - imageWindow[1] !== height)) {
                  _context2.next = 22;
                  break;
                }

                resampled = void 0;

                if (interleave) {
                  resampled = (0, _resample.resampleInterleaved)(valueArrays, imageWindow[2] - imageWindow[0], imageWindow[3] - imageWindow[1], width, height, samples.length, resampleMethod);
                } else {
                  resampled = (0, _resample.resample)(valueArrays, imageWindow[2] - imageWindow[0], imageWindow[3] - imageWindow[1], width, height, resampleMethod);
                }
                resampled.width = width;
                resampled.height = height;
                return _context2.abrupt('return', resampled);

              case 22:

                valueArrays.width = width || imageWindow[2] - imageWindow[0];
                valueArrays.height = height || imageWindow[3] - imageWindow[1];

                return _context2.abrupt('return', valueArrays);

              case 25:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function _readRaster(_x5, _x6, _x7, _x8, _x9, _x10, _x11, _x12) {
        return _ref2.apply(this, arguments);
      }

      return _readRaster;
    }()

    /**
     * Reads raster data from the image. This function reads all selected samples
     * into separate arrays of the correct type for that sample or into a single
     * combined array when `interleave` is set. When provided, only a subset
     * of the raster is read for each sample.
     *
     * @param {Object} [options] optional parameters
     * @param {Array} [options.window=whole image] the subset to read data from.
     * @param {Array} [options.samples=all samples] the selection of samples to read from.
     * @param {Boolean} [options.interleave=false] whether the data shall be read
     *                                             in one single array or separate
     *                                             arrays.
     * @param {Number} [pool=null] The optional decoder pool to use.
     * @param {number} [width] The desired width of the output. When the width is no the
     *                         same as the images, resampling will be performed.
     * @param {number} [height] The desired height of the output. When the width is no the
     *                          same as the images, resampling will be performed.
     * @param {string} [resampleMethod='nearest'] The desired resampling method.
     * @param {number|number[]} [fillValue] The value to use for parts of the image
     *                                      outside of the images extent. When multiple
     *                                      samples are requested, an array of fill values
     *                                      can be passed.
     * @returns {Promise.<(TypedArray|TypedArray[])>} the decoded arrays as a promise
     */

  }, {
    key: 'readRasters',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
        var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            wnd = _ref4.window,
            _ref4$samples = _ref4.samples,
            samples = _ref4$samples === undefined ? [] : _ref4$samples,
            interleave = _ref4.interleave,
            _ref4$pool = _ref4.pool,
            pool = _ref4$pool === undefined ? null : _ref4$pool,
            width = _ref4.width,
            height = _ref4.height,
            resampleMethod = _ref4.resampleMethod,
            fillValue = _ref4.fillValue;

        var imageWindow, imageWindowWidth, imageWindowHeight, numPixels, i, _i, valueArrays, format, bitsPerSample, _i2, valueArray, poolOrDecoder, result;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                imageWindow = wnd || [0, 0, this.getWidth(), this.getHeight()];

                // check parameters

                if (!(imageWindow[0] > imageWindow[2] || imageWindow[1] > imageWindow[3])) {
                  _context3.next = 3;
                  break;
                }

                throw new Error('Invalid subsets');

              case 3:
                imageWindowWidth = imageWindow[2] - imageWindow[0];
                imageWindowHeight = imageWindow[3] - imageWindow[1];
                numPixels = imageWindowWidth * imageWindowHeight;

                if (!(!samples || !samples.length)) {
                  _context3.next = 10;
                  break;
                }

                for (i = 0; i < this.fileDirectory.SamplesPerPixel; ++i) {
                  samples.push(i);
                }
                _context3.next = 17;
                break;

              case 10:
                _i = 0;

              case 11:
                if (!(_i < samples.length)) {
                  _context3.next = 17;
                  break;
                }

                if (!(samples[_i] >= this.fileDirectory.SamplesPerPixel)) {
                  _context3.next = 14;
                  break;
                }

                return _context3.abrupt('return', Promise.reject(new RangeError('Invalid sample index \'' + samples[_i] + '\'.')));

              case 14:
                ++_i;
                _context3.next = 11;
                break;

              case 17:
                valueArrays = void 0;

                if (interleave) {
                  format = this.fileDirectory.SampleFormat ? Math.max.apply(null, this.fileDirectory.SampleFormat) : 1;
                  bitsPerSample = Math.max.apply(null, this.fileDirectory.BitsPerSample);

                  valueArrays = arrayForType(format, bitsPerSample, numPixels * samples.length);
                  if (fillValue) {
                    valueArrays.fill(fillValue);
                  }
                } else {
                  valueArrays = [];
                  for (_i2 = 0; _i2 < samples.length; ++_i2) {
                    valueArray = this.getArrayForSample(samples[_i2], numPixels);

                    if (Array.isArray(fillValue) && _i2 < fillValue.length) {
                      valueArray.fill(fillValue[_i2]);
                    } else if (fillValue && !Array.isArray(fillValue)) {
                      valueArray.fill(fillValue);
                    }
                    valueArrays.push(valueArray);
                  }
                }

                poolOrDecoder = pool || (0, _compression.getDecoder)(this.fileDirectory);
                _context3.next = 22;
                return this._readRaster(imageWindow, samples, valueArrays, interleave, poolOrDecoder, width, height, resampleMethod);

              case 22:
                result = _context3.sent;
                return _context3.abrupt('return', result);

              case 24:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function readRasters() {
        return _ref3.apply(this, arguments);
      }

      return readRasters;
    }()

    /**
     * Reads raster data from the image as RGB. The result is always an
     * interleaved typed array.
     * Colorspaces other than RGB will be transformed to RGB, color maps expanded.
     * When no other method is applicable, the first sample is used to produce a
     * greayscale image.
     * When provided, only a subset of the raster is read for each sample.
     *
     * @param {Object} [options] optional parameters
     * @param {Array} [options.window=whole image] the subset to read data from.
     * @param {Number} [pool=null] The optional decoder pool to use.
     * @param {number} [width] The desired width of the output. When the width is no the
     *                         same as the images, resampling will be performed.
     * @param {number} [height] The desired height of the output. When the width is no the
     *                          same as the images, resampling will be performed.
     * @param {string} [resampleMethod='nearest'] The desired resampling method.
     * @returns {Promise.<TypedArray|TypedArray[]>} the RGB array as a Promise
     */

  }, {
    key: 'readRGB',
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
        var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            window = _ref6.window,
            _ref6$pool = _ref6.pool,
            pool = _ref6$pool === undefined ? null : _ref6$pool,
            width = _ref6.width,
            height = _ref6.height,
            resampleMethod = _ref6.resampleMethod;

        var imageWindow, pi, samples, subOptions, fileDirectory, raster, max, data;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                imageWindow = window || [0, 0, this.getWidth(), this.getHeight()];

                // check parameters

                if (!(imageWindow[0] > imageWindow[2] || imageWindow[1] > imageWindow[3])) {
                  _context4.next = 3;
                  break;
                }

                throw new Error('Invalid subsets');

              case 3:
                pi = this.fileDirectory.PhotometricInterpretation;

                if (!(pi === _globals.photometricInterpretations.RGB)) {
                  _context4.next = 6;
                  break;
                }

                return _context4.abrupt('return', this.readRasters({
                  window: window,
                  interleave: true,
                  samples: [0, 1, 2],
                  pool: pool
                }));

              case 6:
                samples = void 0;
                _context4.t0 = pi;
                _context4.next = _context4.t0 === _globals.photometricInterpretations.WhiteIsZero ? 10 : _context4.t0 === _globals.photometricInterpretations.BlackIsZero ? 10 : _context4.t0 === _globals.photometricInterpretations.Palette ? 10 : _context4.t0 === _globals.photometricInterpretations.CMYK ? 12 : _context4.t0 === _globals.photometricInterpretations.YCbCr ? 14 : _context4.t0 === _globals.photometricInterpretations.CIELab ? 14 : 16;
                break;

              case 10:
                samples = [0];
                return _context4.abrupt('break', 17);

              case 12:
                samples = [0, 1, 2, 3];
                return _context4.abrupt('break', 17);

              case 14:
                samples = [0, 1, 2];
                return _context4.abrupt('break', 17);

              case 16:
                throw new Error('Invalid or unsupported photometric interpretation.');

              case 17:
                subOptions = {
                  window: imageWindow,
                  interleave: true,
                  samples: samples,
                  pool: pool,
                  width: width,
                  height: height,
                  resampleMethod: resampleMethod
                };
                fileDirectory = this.fileDirectory;
                _context4.next = 21;
                return this.readRasters(subOptions);

              case 21:
                raster = _context4.sent;
                max = Math.pow(2, this.fileDirectory.BitsPerSample[0]);
                data = void 0;
                _context4.t1 = pi;
                _context4.next = _context4.t1 === _globals.photometricInterpretations.WhiteIsZero ? 27 : _context4.t1 === _globals.photometricInterpretations.BlackIsZero ? 29 : _context4.t1 === _globals.photometricInterpretations.Palette ? 31 : _context4.t1 === _globals.photometricInterpretations.CMYK ? 33 : _context4.t1 === _globals.photometricInterpretations.YCbCr ? 35 : _context4.t1 === _globals.photometricInterpretations.CIELab ? 37 : 39;
                break;

              case 27:
                data = (0, _rgb.fromWhiteIsZero)(raster, max);
                return _context4.abrupt('break', 40);

              case 29:
                data = (0, _rgb.fromBlackIsZero)(raster, max);
                return _context4.abrupt('break', 40);

              case 31:
                data = (0, _rgb.fromPalette)(raster, fileDirectory.ColorMap);
                return _context4.abrupt('break', 40);

              case 33:
                data = (0, _rgb.fromCMYK)(raster);
                return _context4.abrupt('break', 40);

              case 35:
                data = (0, _rgb.fromYCbCr)(raster);
                return _context4.abrupt('break', 40);

              case 37:
                data = (0, _rgb.fromCIELab)(raster);
                return _context4.abrupt('break', 40);

              case 39:
                throw new Error('Unsupported photometric interpretation.');

              case 40:
                data.width = raster.width;
                data.height = raster.height;
                return _context4.abrupt('return', data);

              case 43:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function readRGB() {
        return _ref5.apply(this, arguments);
      }

      return readRGB;
    }()

    /**
     * Returns an array of tiepoints.
     * @returns {Object[]}
     */

  }, {
    key: 'getTiePoints',
    value: function getTiePoints() {
      if (!this.fileDirectory.ModelTiepoint) {
        return [];
      }

      var tiePoints = [];
      for (var i = 0; i < this.fileDirectory.ModelTiepoint.length; i += 6) {
        tiePoints.push({
          i: this.fileDirectory.ModelTiepoint[i],
          j: this.fileDirectory.ModelTiepoint[i + 1],
          k: this.fileDirectory.ModelTiepoint[i + 2],
          x: this.fileDirectory.ModelTiepoint[i + 3],
          y: this.fileDirectory.ModelTiepoint[i + 4],
          z: this.fileDirectory.ModelTiepoint[i + 5]
        });
      }
      return tiePoints;
    }

    /**
     * Returns the parsed GDAL metadata items.
     * @returns {Object}
     */

  }, {
    key: 'getGDALMetadata',
    value: function getGDALMetadata() {
      var metadata = {};
      if (!this.fileDirectory.GDAL_METADATA) {
        return null;
      }
      var string = this.fileDirectory.GDAL_METADATA;
      var xmlDom = (0, _globals.parseXml)(string.substring(0, string.length - 1));
      var result = xmlDom.evaluate('GDALMetadata/Item', xmlDom, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      for (var i = 0; i < result.snapshotLength; ++i) {
        var node = result.snapshotItem(i);
        metadata[node.getAttribute('name')] = node.textContent;
      }
      return metadata;
    }

    /**
     * Returns the image origin as a XYZ-vector. When the image has no affine
     * transformation, then an exception is thrown.
     * @returns {Array} The origin as a vector
     */

  }, {
    key: 'getOrigin',
    value: function getOrigin() {
      var tiePoints = this.fileDirectory.ModelTiepoint;
      var modelTransformation = this.fileDirectory.ModelTransformation;
      if (tiePoints && tiePoints.length === 6) {
        return [tiePoints[3], tiePoints[4], tiePoints[5]];
      } else if (modelTransformation) {
        return [modelTransformation[3], modelTransformation[7], modelTransformation[11]];
      }
      throw new Error('The image does not have an affine transformation.');
    }

    /**
     * Returns the image resolution as a XYZ-vector. When the image has no affine
     * transformation, then an exception is thrown.
     * @param {GeoTIFFImage} [referenceImage=null] A reference image to calculate the resolution from
     *                                             in cases when the current image does not have the
     *                                             required tags on its own.
     * @returns {Array} The resolution as a vector
     */

  }, {
    key: 'getResolution',
    value: function getResolution() {
      var referenceImage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var modelPixelScale = this.fileDirectory.ModelPixelScale;
      var modelTransformation = this.fileDirectory.ModelTransformation;

      if (modelPixelScale) {
        return [modelPixelScale[0], -modelPixelScale[1], modelPixelScale[2]];
      } else if (modelTransformation) {
        return [modelTransformation[0], modelTransformation[5], modelTransformation[10]];
      }

      if (referenceImage) {
        var _referenceImage$getRe = referenceImage.getResolution(),
            _referenceImage$getRe2 = (0, _slicedToArray3.default)(_referenceImage$getRe, 3),
            refResX = _referenceImage$getRe2[0],
            refResY = _referenceImage$getRe2[1],
            refResZ = _referenceImage$getRe2[2];

        return [refResX * referenceImage.getWidth() / this.getWidth(), refResY * referenceImage.getHeight() / this.getHeight(), refResZ * referenceImage.getWidth() / this.getWidth()];
      }

      throw new Error('The image does not have an affine transformation.');
    }

    /**
     * Returns whether or not the pixels of the image depict an area (or point).
     * @returns {Boolean} Whether the pixels are a point
     */

  }, {
    key: 'pixelIsArea',
    value: function pixelIsArea() {
      return this.geoKeys.GTRasterTypeGeoKey === 1;
    }

    /**
     * Returns the image bounding box as an array of 4 values: min-x, min-y,
     * max-x and max-y. When the image has no affine transformation, then an
     * exception is thrown.
     * @returns {Array} The bounding box
     */

  }, {
    key: 'getBoundingBox',
    value: function getBoundingBox() {
      var origin = this.getOrigin();
      var resolution = this.getResolution();

      var x1 = origin[0];
      var y1 = origin[1];

      var x2 = x1 + resolution[0] * this.getWidth();
      var y2 = y1 + resolution[1] * this.getHeight();

      return [Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2)];
    }
  }]);
  return GeoTIFFImage;
}();

exports.default = GeoTIFFImage;