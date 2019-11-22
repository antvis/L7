'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pool = exports.fromUrls = exports.fromBlob = exports.fromFile = exports.fromArrayBuffer = exports.fromUrl = exports.MultiGeoTIFF = exports.GeoTIFF = undefined;

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

/**
 * Creates a new GeoTIFF from a remote URL.
 * @param {string} url The URL to access the image from
 * @param {object} [options] Additional options to pass to the source.
 *                           See {@link makeRemoteSource} for details.
 * @returns {Promise.<GeoTIFF>} The resulting GeoTIFF file.
 */
var fromUrl = exports.fromUrl = function () {
  var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(url) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            return _context10.abrupt('return', GeoTIFF.fromSource((0, _source.makeRemoteSource)(url, options)));

          case 1:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, this);
  }));

  return function fromUrl(_x10) {
    return _ref10.apply(this, arguments);
  };
}();

/**
 * Construct a new GeoTIFF from an
 * [ArrayBuffer]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer}.
 * @param {ArrayBuffer} arrayBuffer The data to read the file from.
 * @returns {Promise.<GeoTIFF>} The resulting GeoTIFF file.
 */


var fromArrayBuffer = exports.fromArrayBuffer = function () {
  var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(arrayBuffer) {
    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            return _context11.abrupt('return', GeoTIFF.fromSource((0, _source.makeBufferSource)(arrayBuffer)));

          case 1:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, this);
  }));

  return function fromArrayBuffer(_x11) {
    return _ref11.apply(this, arguments);
  };
}();

/**
 * Construct a GeoTIFF from a local file path. This uses the node
 * [filesystem API]{@link https://nodejs.org/api/fs.html} and is
 * not available on browsers.
 * @param {string} path The filepath to read from.
 * @returns {Promise.<GeoTIFF>} The resulting GeoTIFF file.
 */


var fromFile = exports.fromFile = function () {
  var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(path) {
    return _regenerator2.default.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            return _context12.abrupt('return', GeoTIFF.fromSource((0, _source.makeFileSource)(path)));

          case 1:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, this);
  }));

  return function fromFile(_x12) {
    return _ref12.apply(this, arguments);
  };
}();

/**
 * Construct a GeoTIFF from an HTML
 * [Blob]{@link https://developer.mozilla.org/en-US/docs/Web/API/Blob} or
 * [File]{@link https://developer.mozilla.org/en-US/docs/Web/API/File}
 * object.
 * @param {Blob|File} blob The Blob or File object to read from.
 * @returns {Promise.<GeoTIFF>} The resulting GeoTIFF file.
 */


var fromBlob = exports.fromBlob = function () {
  var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(blob) {
    return _regenerator2.default.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            return _context13.abrupt('return', GeoTIFF.fromSource((0, _source.makeFileReaderSource)(blob)));

          case 1:
          case 'end':
            return _context13.stop();
        }
      }
    }, _callee13, this);
  }));

  return function fromBlob(_x13) {
    return _ref13.apply(this, arguments);
  };
}();

/**
 * Construct a MultiGeoTIFF from the given URLs.
 * @param {string} mainUrl The URL for the main file.
 * @param {string[]} overviewUrls An array of URLs for the overview images.
 * @param {object} [options] Additional options to pass to the source.
 *                           See [makeRemoteSource]{@link module:source.makeRemoteSource}
 *                           for details.
 * @returns {Promise.<MultiGeoTIFF>} The resulting MultiGeoTIFF file.
 */


var fromUrls = exports.fromUrls = function () {
  var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(mainUrl) {
    var overviewUrls = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var mainFile, overviewFiles;
    return _regenerator2.default.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return GeoTIFF.fromSource((0, _source.makeRemoteSource)(mainUrl, options));

          case 2:
            mainFile = _context14.sent;
            _context14.next = 5;
            return Promise.all(overviewUrls.map(function (url) {
              return GeoTIFF.fromSource((0, _source.makeRemoteSource)(url, options));
            }));

          case 5:
            overviewFiles = _context14.sent;
            return _context14.abrupt('return', new MultiGeoTIFF(mainFile, overviewFiles));

          case 7:
          case 'end':
            return _context14.stop();
        }
      }
    }, _callee14, this);
  }));

  return function fromUrls(_x16) {
    return _ref14.apply(this, arguments);
  };
}();

var _globals = require('./globals');

var _geotiffimage = require('./geotiffimage');

var _geotiffimage2 = _interopRequireDefault(_geotiffimage);

var _dataview = require('./dataview64');

var _dataview2 = _interopRequireDefault(_dataview);

var _dataslice = require('./dataslice');

var _dataslice2 = _interopRequireDefault(_dataslice);

var _source = require('./source');

var _pool = require('./pool');

var _pool2 = _interopRequireDefault(_pool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getFieldTypeLength(fieldType) {
  switch (fieldType) {
    case _globals.fieldTypes.BYTE:case _globals.fieldTypes.ASCII:case _globals.fieldTypes.SBYTE:case _globals.fieldTypes.UNDEFINED:
      return 1;
    case _globals.fieldTypes.SHORT:case _globals.fieldTypes.SSHORT:
      return 2;
    case _globals.fieldTypes.LONG:case _globals.fieldTypes.SLONG:case _globals.fieldTypes.FLOAT:
      return 4;
    case _globals.fieldTypes.RATIONAL:case _globals.fieldTypes.SRATIONAL:case _globals.fieldTypes.DOUBLE:
    case _globals.fieldTypes.LONG8:case _globals.fieldTypes.SLONG8:case _globals.fieldTypes.IFD8:
      return 8;
    default:
      throw new RangeError('Invalid field type: ' + fieldType);
  }
}

function parseGeoKeyDirectory(fileDirectory) {
  var rawGeoKeyDirectory = fileDirectory.GeoKeyDirectory;
  if (!rawGeoKeyDirectory) {
    return null;
  }

  var geoKeyDirectory = {};
  for (var i = 4; i <= rawGeoKeyDirectory[3] * 4; i += 4) {
    var key = _globals.geoKeyNames[rawGeoKeyDirectory[i]];
    var location = rawGeoKeyDirectory[i + 1] ? _globals.fieldTagNames[rawGeoKeyDirectory[i + 1]] : null;
    var count = rawGeoKeyDirectory[i + 2];
    var offset = rawGeoKeyDirectory[i + 3];

    var value = null;
    if (!location) {
      value = offset;
    } else {
      value = fileDirectory[location];
      if (typeof value === 'undefined' || value === null) {
        throw new Error('Could not get value of geoKey \'' + key + '\'.');
      } else if (typeof value === 'string') {
        value = value.substring(offset, offset + count - 1);
      } else if (value.subarray) {
        value = value.subarray(offset, offset + count - 1);
      }
    }
    geoKeyDirectory[key] = value;
  }
  return geoKeyDirectory;
}

function getValues(dataSlice, fieldType, count, offset) {
  var values = null;
  var readMethod = null;
  var fieldTypeLength = getFieldTypeLength(fieldType);

  switch (fieldType) {
    case _globals.fieldTypes.BYTE:case _globals.fieldTypes.ASCII:case _globals.fieldTypes.UNDEFINED:
      values = new Uint8Array(count);readMethod = dataSlice.readUint8;
      break;
    case _globals.fieldTypes.SBYTE:
      values = new Int8Array(count);readMethod = dataSlice.readInt8;
      break;
    case _globals.fieldTypes.SHORT:
      values = new Uint16Array(count);readMethod = dataSlice.readUint16;
      break;
    case _globals.fieldTypes.SSHORT:
      values = new Int16Array(count);readMethod = dataSlice.readInt16;
      break;
    case _globals.fieldTypes.LONG:
      values = new Uint32Array(count);readMethod = dataSlice.readUint32;
      break;
    case _globals.fieldTypes.SLONG:
      values = new Int32Array(count);readMethod = dataSlice.readInt32;
      break;
    case _globals.fieldTypes.LONG8:case _globals.fieldTypes.IFD8:
      values = new Array(count);readMethod = dataSlice.readUint64;
      break;
    case _globals.fieldTypes.SLONG8:
      values = new Array(count);readMethod = dataSlice.readInt64;
      break;
    case _globals.fieldTypes.RATIONAL:
      values = new Uint32Array(count * 2);readMethod = dataSlice.readUint32;
      break;
    case _globals.fieldTypes.SRATIONAL:
      values = new Int32Array(count * 2);readMethod = dataSlice.readInt32;
      break;
    case _globals.fieldTypes.FLOAT:
      values = new Float32Array(count);readMethod = dataSlice.readFloat32;
      break;
    case _globals.fieldTypes.DOUBLE:
      values = new Float64Array(count);readMethod = dataSlice.readFloat64;
      break;
    default:
      throw new RangeError('Invalid field type: ' + fieldType);
  }

  // normal fields
  if (!(fieldType === _globals.fieldTypes.RATIONAL || fieldType === _globals.fieldTypes.SRATIONAL)) {
    for (var i = 0; i < count; ++i) {
      values[i] = readMethod.call(dataSlice, offset + i * fieldTypeLength);
    }
  } else {
    // RATIONAL or SRATIONAL
    for (var _i = 0; _i < count; _i += 2) {
      values[_i] = readMethod.call(dataSlice, offset + _i * fieldTypeLength);
      values[_i + 1] = readMethod.call(dataSlice, offset + (_i * fieldTypeLength + 4));
    }
  }

  if (fieldType === _globals.fieldTypes.ASCII) {
    return String.fromCharCode.apply(null, values);
  }
  return values;
}

var GeoTIFFBase = function () {
  function GeoTIFFBase() {
    (0, _classCallCheck3.default)(this, GeoTIFFBase);
  }

  (0, _createClass3.default)(GeoTIFFBase, [{
    key: 'readRasters',

    /**
     * (experimental) Reads raster data from the best fitting image. This function uses
     * the image with the lowest resolution that is still a higher resolution than the
     * requested resolution.
     * When specified, the `bbox` option is translated to the `window` option and the
     * `resX` and `resY` to `width` and `height` respectively.
     * Then, the [readRasters]{@link GeoTIFFImage#readRasters} method of the selected
     * image is called and the result returned.
     * @see GeoTIFFImage.readRasters
     * @param {Object} [options] optional parameters
     * @param {Array} [options.window=whole image] the subset to read data from.
     * @param {Array} [options.bbox=whole image] the subset to read data from in
     *                                           geographical coordinates.
     * @param {Array} [options.samples=all samples] the selection of samples to read from.
     * @param {Boolean} [options.interleave=false] whether the data shall be read
     *                                             in one single array or separate
     *                                             arrays.
     * @param {Number} [pool=null] The optional decoder pool to use.
     * @param {Number} [width] The desired width of the output. When the width is no the
     *                         same as the images, resampling will be performed.
     * @param {Number} [height] The desired height of the output. When the width is no the
     *                          same as the images, resampling will be performed.
     * @param {String} [resampleMethod='nearest'] The desired resampling method.
     * @param {Number|Number[]} [fillValue] The value to use for parts of the image
     *                                      outside of the images extent. When multiple
     *                                      samples are requested, an array of fill values
     *                                      can be passed.
     * @returns {Promise.<(TypedArray|TypedArray[])>} the decoded arrays as a promise
     */
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var imageWindow, width, height, resX, resY, bbox, firstImage, usedImage, imageCount, imgBBox, _firstImage$getOrigin, _firstImage$getOrigin2, oX, oY, _firstImage$getResolu, _firstImage$getResolu2, rX, rY, usedBBox, allImages, i, image, _image$fileDirectory, subfileType, newSubfileType, _i2, _image, imgResX, imgResY, wnd, _firstImage$getOrigin3, _firstImage$getOrigin4, _oX, _oY, _usedImage$getResolut, _usedImage$getResolut2, imageResX, imageResY;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                imageWindow = options.window, width = options.width, height = options.height;
                resX = options.resX, resY = options.resY, bbox = options.bbox;
                _context.next = 4;
                return this.getImage();

              case 4:
                firstImage = _context.sent;
                usedImage = firstImage;
                _context.next = 8;
                return this.getImageCount();

              case 8:
                imageCount = _context.sent;
                imgBBox = firstImage.getBoundingBox();

                if (!(imageWindow && bbox)) {
                  _context.next = 12;
                  break;
                }

                throw new Error('Both "bbox" and "window" passed.');

              case 12:
                if (!(width || height)) {
                  _context.next = 23;
                  break;
                }

                // if we have an image window (pixel coordinates), transform it to a BBox
                // using the origin/resolution of the first image.
                if (imageWindow) {
                  _firstImage$getOrigin = firstImage.getOrigin(), _firstImage$getOrigin2 = (0, _slicedToArray3.default)(_firstImage$getOrigin, 2), oX = _firstImage$getOrigin2[0], oY = _firstImage$getOrigin2[1];
                  _firstImage$getResolu = firstImage.getResolution(), _firstImage$getResolu2 = (0, _slicedToArray3.default)(_firstImage$getResolu, 2), rX = _firstImage$getResolu2[0], rY = _firstImage$getResolu2[1];


                  bbox = [oX + imageWindow[0] * rX, oY + imageWindow[1] * rY, oX + imageWindow[2] * rX, oY + imageWindow[3] * rY];
                }

                // if we have a bbox (or calculated one)

                usedBBox = bbox || imgBBox;

                if (!width) {
                  _context.next = 19;
                  break;
                }

                if (!resX) {
                  _context.next = 18;
                  break;
                }

                throw new Error('Both width and resX passed');

              case 18:
                resX = (usedBBox[2] - usedBBox[0]) / width;

              case 19:
                if (!height) {
                  _context.next = 23;
                  break;
                }

                if (!resY) {
                  _context.next = 22;
                  break;
                }

                throw new Error('Both width and resY passed');

              case 22:
                resY = (usedBBox[3] - usedBBox[1]) / height;

              case 23:
                if (!(resX || resY)) {
                  _context.next = 47;
                  break;
                }

                allImages = [];
                i = 0;

              case 26:
                if (!(i < imageCount)) {
                  _context.next = 35;
                  break;
                }

                _context.next = 29;
                return this.getImage(i);

              case 29:
                image = _context.sent;
                _image$fileDirectory = image.fileDirectory, subfileType = _image$fileDirectory.SubfileType, newSubfileType = _image$fileDirectory.NewSubfileType;

                if (i === 0 || subfileType === 2 || newSubfileType & 1) {
                  allImages.push(image);
                }

              case 32:
                ++i;
                _context.next = 26;
                break;

              case 35:

                allImages.sort(function (a, b) {
                  return a.getWidth() - b.getWidth();
                });
                _i2 = 0;

              case 37:
                if (!(_i2 < allImages.length)) {
                  _context.next = 47;
                  break;
                }

                _image = allImages[_i2];
                imgResX = (imgBBox[2] - imgBBox[0]) / _image.getWidth();
                imgResY = (imgBBox[3] - imgBBox[1]) / _image.getHeight();


                usedImage = _image;

                if (!(resX && resX > imgResX || resY && resY > imgResY)) {
                  _context.next = 44;
                  break;
                }

                return _context.abrupt('break', 47);

              case 44:
                ++_i2;
                _context.next = 37;
                break;

              case 47:
                wnd = imageWindow;

                if (bbox) {
                  _firstImage$getOrigin3 = firstImage.getOrigin(), _firstImage$getOrigin4 = (0, _slicedToArray3.default)(_firstImage$getOrigin3, 2), _oX = _firstImage$getOrigin4[0], _oY = _firstImage$getOrigin4[1];
                  _usedImage$getResolut = usedImage.getResolution(firstImage), _usedImage$getResolut2 = (0, _slicedToArray3.default)(_usedImage$getResolut, 2), imageResX = _usedImage$getResolut2[0], imageResY = _usedImage$getResolut2[1];


                  wnd = [Math.round((bbox[0] - _oX) / imageResX), Math.round((bbox[1] - _oY) / imageResY), Math.round((bbox[2] - _oX) / imageResX), Math.round((bbox[3] - _oY) / imageResY)];
                  wnd = [Math.min(wnd[0], wnd[2]), Math.min(wnd[1], wnd[3]), Math.max(wnd[0], wnd[2]), Math.max(wnd[1], wnd[3])];
                }

                return _context.abrupt('return', usedImage.readRasters(Object.assign({}, options, {
                  window: wnd
                })));

              case 50:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function readRasters() {
        return _ref.apply(this, arguments);
      }

      return readRasters;
    }()
  }]);
  return GeoTIFFBase;
}();

/**
 * The abstraction for a whole GeoTIFF file.
 * @augments GeoTIFFBase
 */


var GeoTIFF = function (_GeoTIFFBase) {
  (0, _inherits3.default)(GeoTIFF, _GeoTIFFBase);

  /**
   * @constructor
   * @param {Source} source The datasource to read from.
   * @param {Boolean} littleEndian Whether the image uses little endian.
   * @param {Boolean} bigTiff Whether the image uses bigTIFF conventions.
   * @param {Number} firstIFDOffset The numeric byte-offset from the start of the image
   *                                to the first IFD.
   * @param {Object} [options] further options.
   * @param {Boolean} [options.cache=false] whether or not decoded tiles shall be cached.
   */
  function GeoTIFF(source, littleEndian, bigTiff, firstIFDOffset) {
    var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    (0, _classCallCheck3.default)(this, GeoTIFF);

    var _this = (0, _possibleConstructorReturn3.default)(this, (GeoTIFF.__proto__ || Object.getPrototypeOf(GeoTIFF)).call(this));

    _this.source = source;
    _this.littleEndian = littleEndian;
    _this.bigTiff = bigTiff;
    _this.firstIFDOffset = firstIFDOffset;
    _this.cache = options.cache || false;
    _this.fileDirectories = null;
    _this.fileDirectoriesParsing = null;
    return _this;
  }

  (0, _createClass3.default)(GeoTIFF, [{
    key: 'getSlice',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(offset, size) {
        var fallbackSize;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                fallbackSize = this.bigTiff ? 4048 : 1024;
                _context2.t0 = _dataslice2.default;
                _context2.next = 4;
                return this.source.fetch(offset, typeof size !== 'undefined' ? size : fallbackSize);

              case 4:
                _context2.t1 = _context2.sent;
                _context2.t2 = offset;
                _context2.t3 = this.littleEndian;
                _context2.t4 = this.bigTiff;
                return _context2.abrupt('return', new _context2.t0(_context2.t1, _context2.t2, _context2.t3, _context2.t4));

              case 9:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getSlice(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return getSlice;
    }()
  }, {
    key: 'parseFileDirectories',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
        var nextIFDByteOffset, offsetSize, entrySize, fileDirectories, dataSlice, numDirEntries, byteSize, fileDirectory, i, entryCount, fieldTag, fieldType, typeCount, fieldValues, value, fieldTypeLength, valueOffset, actualOffset, length, fieldDataSlice;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                nextIFDByteOffset = this.firstIFDOffset;
                offsetSize = this.bigTiff ? 8 : 2;
                entrySize = this.bigTiff ? 20 : 12;
                fileDirectories = [];

              case 4:
                if (!(nextIFDByteOffset !== 0x00000000)) {
                  _context3.next = 48;
                  break;
                }

                _context3.next = 7;
                return this.getSlice(nextIFDByteOffset);

              case 7:
                dataSlice = _context3.sent;
                numDirEntries = this.bigTiff ? dataSlice.readUint64(nextIFDByteOffset) : dataSlice.readUint16(nextIFDByteOffset);

                // if the slice does not cover the whole IFD, request a bigger slice, where the
                // whole IFD fits: num of entries + n x tag length + offset to next IFD

                byteSize = numDirEntries * entrySize + (this.bigTiff ? 16 : 6);

                if (dataSlice.covers(nextIFDByteOffset, byteSize)) {
                  _context3.next = 14;
                  break;
                }

                _context3.next = 13;
                return this.getSlice(nextIFDByteOffset, byteSize);

              case 13:
                dataSlice = _context3.sent;

              case 14:
                fileDirectory = {};

                // loop over the IFD and create a file directory object

                i = nextIFDByteOffset + (this.bigTiff ? 8 : 2);
                entryCount = 0;

              case 17:
                if (!(entryCount < numDirEntries)) {
                  _context3.next = 44;
                  break;
                }

                fieldTag = dataSlice.readUint16(i);
                fieldType = dataSlice.readUint16(i + 2);
                typeCount = this.bigTiff ? dataSlice.readUint64(i + 4) : dataSlice.readUint32(i + 4);
                fieldValues = void 0;
                value = void 0;
                fieldTypeLength = getFieldTypeLength(fieldType);
                valueOffset = i + (this.bigTiff ? 12 : 8);

                // check whether the value is directly encoded in the tag or refers to a
                // different external byte range

                if (!(fieldTypeLength * typeCount <= (this.bigTiff ? 8 : 4))) {
                  _context3.next = 29;
                  break;
                }

                fieldValues = getValues(dataSlice, fieldType, typeCount, valueOffset);
                _context3.next = 39;
                break;

              case 29:
                // resolve the reference to the actual byte range
                actualOffset = dataSlice.readOffset(valueOffset);
                length = getFieldTypeLength(fieldType) * typeCount;

                // check, whether we actually cover the referenced byte range; if not,
                // request a new slice of bytes to read from it

                if (!dataSlice.covers(actualOffset, length)) {
                  _context3.next = 35;
                  break;
                }

                fieldValues = getValues(dataSlice, fieldType, typeCount, actualOffset);
                _context3.next = 39;
                break;

              case 35:
                _context3.next = 37;
                return this.getSlice(actualOffset, length);

              case 37:
                fieldDataSlice = _context3.sent;

                fieldValues = getValues(fieldDataSlice, fieldType, typeCount, actualOffset);

              case 39:

                // unpack single values from the array
                if (typeCount === 1 && _globals.arrayFields.indexOf(fieldTag) === -1 && !(fieldType === _globals.fieldTypes.RATIONAL || fieldType === _globals.fieldTypes.SRATIONAL)) {
                  value = fieldValues[0];
                } else {
                  value = fieldValues;
                }

                // write the tags value to the file directly
                fileDirectory[_globals.fieldTagNames[fieldTag]] = value;

              case 41:
                i += entrySize, ++entryCount;
                _context3.next = 17;
                break;

              case 44:

                fileDirectories.push([fileDirectory, parseGeoKeyDirectory(fileDirectory)]);

                // continue with the next IFD
                nextIFDByteOffset = dataSlice.readOffset(nextIFDByteOffset + offsetSize + entrySize * numDirEntries);
                _context3.next = 4;
                break;

              case 48:
                return _context3.abrupt('return', fileDirectories);

              case 49:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function parseFileDirectories() {
        return _ref3.apply(this, arguments);
      }

      return parseFileDirectories;
    }()

    /**
     * Get the n-th internal subfile of an image. By default, the first is returned.
     *
     * @param {Number} [index=0] the index of the image to return.
     * @returns {GeoTIFFImage} the image at the given index
     */

  }, {
    key: 'getImage',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
        var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var fileDirectoryAndGeoKey;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (this.fileDirectories) {
                  _context4.next = 5;
                  break;
                }

                if (!this.fileDirectoriesParsing) {
                  this.fileDirectoriesParsing = this.parseFileDirectories();
                }
                _context4.next = 4;
                return this.fileDirectoriesParsing;

              case 4:
                this.fileDirectories = _context4.sent;

              case 5:
                fileDirectoryAndGeoKey = this.fileDirectories[index];

                if (fileDirectoryAndGeoKey) {
                  _context4.next = 8;
                  break;
                }

                throw new RangeError('Invalid image index');

              case 8:
                return _context4.abrupt('return', new _geotiffimage2.default(fileDirectoryAndGeoKey[0], fileDirectoryAndGeoKey[1], this.dataView, this.littleEndian, this.cache, this.source));

              case 9:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getImage() {
        return _ref4.apply(this, arguments);
      }

      return getImage;
    }()

    /**
     * Returns the count of the internal subfiles.
     *
     * @returns {Number} the number of internal subfile images
     */

  }, {
    key: 'getImageCount',
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (this.fileDirectories) {
                  _context5.next = 5;
                  break;
                }

                if (!this.fileDirectoriesParsing) {
                  this.fileDirectoriesParsing = this.parseFileDirectories();
                }
                _context5.next = 4;
                return this.fileDirectoriesParsing;

              case 4:
                this.fileDirectories = _context5.sent;

              case 5:
                return _context5.abrupt('return', this.fileDirectories.length);

              case 6:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function getImageCount() {
        return _ref5.apply(this, arguments);
      }

      return getImageCount;
    }()

    /**
     * Parse a (Geo)TIFF file from the given source.
     *
     * @param {source~Source} source The source of data to parse from.
     * @param {object} options Additional options.
     */

  }], [{
    key: 'fromSource',
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(source, options) {
        var headerData, dataView, BOM, littleEndian, magicNumber, bigTiff, offsetByteSize, firstIFDOffset;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return source.fetch(0, 1024);

              case 2:
                headerData = _context6.sent;
                dataView = new _dataview2.default(headerData);
                BOM = dataView.getUint16(0, 0);
                littleEndian = void 0;

                if (!(BOM === 0x4949)) {
                  _context6.next = 10;
                  break;
                }

                littleEndian = true;
                _context6.next = 15;
                break;

              case 10:
                if (!(BOM === 0x4D4D)) {
                  _context6.next = 14;
                  break;
                }

                littleEndian = false;
                _context6.next = 15;
                break;

              case 14:
                throw new TypeError('Invalid byte order value.');

              case 15:
                magicNumber = dataView.getUint16(2, littleEndian);
                bigTiff = void 0;

                if (!(magicNumber === 42)) {
                  _context6.next = 21;
                  break;
                }

                bigTiff = false;
                _context6.next = 29;
                break;

              case 21:
                if (!(magicNumber === 43)) {
                  _context6.next = 28;
                  break;
                }

                bigTiff = true;
                offsetByteSize = dataView.getUint16(4, littleEndian);

                if (!(offsetByteSize !== 8)) {
                  _context6.next = 26;
                  break;
                }

                throw new Error('Unsupported offset byte-size.');

              case 26:
                _context6.next = 29;
                break;

              case 28:
                throw new TypeError('Invalid magic number.');

              case 29:
                firstIFDOffset = bigTiff ? dataView.getUint64(8, littleEndian) : dataView.getUint32(4, littleEndian);
                return _context6.abrupt('return', new GeoTIFF(source, littleEndian, bigTiff, firstIFDOffset, options));

              case 31:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function fromSource(_x6, _x7) {
        return _ref6.apply(this, arguments);
      }

      return fromSource;
    }()
  }]);
  return GeoTIFF;
}(GeoTIFFBase);

exports.GeoTIFF = GeoTIFF;
exports.default = GeoTIFF;

/**
 * Wrapper for GeoTIFF files that have external overviews.
 * @augments GeoTIFFBase
 */

var MultiGeoTIFF = function (_GeoTIFFBase2) {
  (0, _inherits3.default)(MultiGeoTIFF, _GeoTIFFBase2);

  /**
   * Construct a new MultiGeoTIFF from a main and several overview files.
   * @param {GeoTIFF} mainFile The main GeoTIFF file.
   * @param {GeoTIFF[]} overviewFiles An array of overview files.
   */
  function MultiGeoTIFF(mainFile, overviewFiles) {
    (0, _classCallCheck3.default)(this, MultiGeoTIFF);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (MultiGeoTIFF.__proto__ || Object.getPrototypeOf(MultiGeoTIFF)).call(this));

    _this2.mainFile = mainFile;
    _this2.overviewFiles = overviewFiles;
    _this2.imageFiles = [mainFile].concat(overviewFiles);

    _this2.fileDirectoriesPerFile = null;
    _this2.fileDirectoriesPerFileParsing = null;
    _this2.imageCount = null;
    return _this2;
  }

  (0, _createClass3.default)(MultiGeoTIFF, [{
    key: 'parseFileDirectoriesPerFile',
    value: function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
        var requests;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                requests = [this.mainFile.parseFileDirectories()].concat(this.overviewFiles.map(function (file) {
                  return file.parseFileDirectories();
                }));
                _context7.next = 3;
                return Promise.all(requests);

              case 3:
                this.fileDirectoriesPerFile = _context7.sent;
                return _context7.abrupt('return', this.fileDirectoriesPerFile);

              case 5:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function parseFileDirectoriesPerFile() {
        return _ref7.apply(this, arguments);
      }

      return parseFileDirectoriesPerFile;
    }()

    /**
     * Get the n-th internal subfile of an image. By default, the first is returned.
     *
     * @param {Number} [index=0] the index of the image to return.
     * @returns {GeoTIFFImage} the image at the given index
     */

  }, {
    key: 'getImage',
    value: function () {
      var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
        var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var relativeIndex, i, fileDirectories, file;
        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (this.fileDirectoriesPerFile) {
                  _context8.next = 5;
                  break;
                }

                if (!this.fileDirectoriesPerFileParsing) {
                  this.fileDirectoriesPerFileParsing = this.parseFileDirectoriesPerFile();
                }
                _context8.next = 4;
                return this.fileDirectoriesPerFileParsing;

              case 4:
                this.fileDirectoriesPerFile = _context8.sent;

              case 5:
                relativeIndex = index;
                i = 0;

              case 7:
                if (!(i < this.fileDirectoriesPerFile.length)) {
                  _context8.next = 16;
                  break;
                }

                fileDirectories = this.fileDirectoriesPerFile[i];

                if (!(relativeIndex < fileDirectories.length)) {
                  _context8.next = 12;
                  break;
                }

                file = this.imageFiles[i];
                return _context8.abrupt('return', new _geotiffimage2.default(fileDirectories[relativeIndex][0], fileDirectories[relativeIndex][1], file.dataView, file.littleEndian, file.cache, file.source));

              case 12:
                relativeIndex -= fileDirectories.length;

              case 13:
                ++i;
                _context8.next = 7;
                break;

              case 16:
                throw new RangeError('Invalid image index');

              case 17:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function getImage() {
        return _ref8.apply(this, arguments);
      }

      return getImage;
    }()

    /**
     * Returns the count of the internal subfiles.
     *
     * @returns {Number} the number of internal subfile images
     */

  }, {
    key: 'getImageCount',
    value: function () {
      var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
        return _regenerator2.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (this.fileDirectoriesPerFile) {
                  _context9.next = 5;
                  break;
                }

                if (!this.fileDirectoriesPerFileParsing) {
                  this.fileDirectoriesPerFileParsing = this.parseFileDirectoriesPerFile();
                }
                _context9.next = 4;
                return this.fileDirectoriesPerFileParsing;

              case 4:
                this.fileDirectoriesPerFile = _context9.sent;

              case 5:
                return _context9.abrupt('return', this.fileDirectoriesPerFile.reduce(function (count, ifds) {
                  return count + ifds.length;
                }, 0));

              case 6:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function getImageCount() {
        return _ref9.apply(this, arguments);
      }

      return getImageCount;
    }()
  }]);
  return MultiGeoTIFF;
}(GeoTIFFBase);

exports.MultiGeoTIFF = MultiGeoTIFF;
exports.Pool = _pool2.default;