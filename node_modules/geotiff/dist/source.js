'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

/*
 * Promisified wrapper around 'setTimeout' to allow 'await'
 */
var wait = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(milliseconds) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', new Promise(function (resolve) {
              return setTimeout(resolve, milliseconds);
            }));

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function wait(_x) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * BlockedSource - an abstraction of (remote) files.
 * @implements Source
 */


exports.makeFetchSource = makeFetchSource;
exports.makeXHRSource = makeXHRSource;
exports.makeHttpSource = makeHttpSource;
exports.makeRemoteSource = makeRemoteSource;
exports.makeBufferSource = makeBufferSource;
exports.makeFileSource = makeFileSource;
exports.makeFileReaderSource = makeFileReaderSource;

var _buffer = require('buffer');

var _fs = require('fs');

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function readRangeFromBlocks(blocks, rangeOffset, rangeLength) {
  var rangeTop = rangeOffset + rangeLength;
  var rangeData = new ArrayBuffer(rangeLength);
  var rangeView = new Uint8Array(rangeData);

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = blocks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var block = _step.value;

      var delta = block.offset - rangeOffset;
      var topDelta = block.top - rangeTop;
      var blockInnerOffset = 0;
      var rangeInnerOffset = 0;
      var usedBlockLength = void 0;

      if (delta < 0) {
        blockInnerOffset = -delta;
      } else if (delta > 0) {
        rangeInnerOffset = delta;
      }

      if (topDelta < 0) {
        usedBlockLength = block.length - blockInnerOffset;
      } else if (topDelta > 0) {
        usedBlockLength = rangeTop - block.offset - blockInnerOffset;
      }

      var blockView = new Uint8Array(block.data, blockInnerOffset, usedBlockLength);
      rangeView.set(blockView, rangeInnerOffset);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return rangeData;
}

/**
 * Interface for Source objects.
 * @interface Source
 */

/**
 * @function Source#fetch
 * @summary The main method to retrieve the data from the source.
 * @param {number} offset The offset to read from in the source
 * @param {number} length The requested number of bytes
 */

/**
 * @typedef {object} Block
 * @property {ArrayBuffer} data The actual data of the block.
 * @property {number} offset The actual offset of the block within the file.
 * @property {number} length The actual size of the block in bytes.
 */

/**
 * Callback type for sources to request patches of data.
 * @callback requestCallback
 * @async
 * @param {number} offset The offset within the file.
 * @param {number} length The desired length of data to be read.
 * @returns {Promise<Block>} The block of data.
 */

/**
 * @module source
 */

/*
 * Split a list of identifiers to form groups of coherent ones
 */
function getCoherentBlockGroups(blockIds) {
  if (blockIds.length === 0) {
    return [];
  }

  var groups = [];
  var current = [];
  groups.push(current);

  for (var i = 0; i < blockIds.length; ++i) {
    if (i === 0 || blockIds[i] === blockIds[i - 1] + 1) {
      current.push(blockIds[i]);
    } else {
      current = [blockIds[i]];
      groups.push(current);
    }
  }
  return groups;
}
var BlockedSource = function () {
  /**
   * @param {requestCallback} retrievalFunction Callback function to request data
   * @param {object} options Additional options
   * @param {object} options.blockSize Size of blocks to be fetched
   */
  function BlockedSource(retrievalFunction) {
    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref2$blockSize = _ref2.blockSize,
        blockSize = _ref2$blockSize === undefined ? 65535 : _ref2$blockSize;

    (0, _classCallCheck3.default)(this, BlockedSource);

    this.retrievalFunction = retrievalFunction;
    this.blockSize = blockSize;

    // currently running block requests
    this.blockRequests = new Map();

    // already retrieved blocks
    this.blocks = new Map();

    // block ids waiting for a batched request. Either a Set or null
    this.blockIdsAwaitingRequest = null;
  }

  /**
   * Fetch a subset of the file.
   * @param {number} offset The offset within the file to read from.
   * @param {number} length The length in bytes to read from.
   * @returns {ArrayBuffer} The subset of the file.
   */


  (0, _createClass3.default)(BlockedSource, [{
    key: 'fetch',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(offset, length) {
        var _this = this;

        var immediate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        var top, firstBlockOffset, allBlockIds, missingBlockIds, blockRequests, current, blockId, i, id, groups, _loop, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, group, missingRequests, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _blockId, blocks;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                top = offset + length;

                // calculate what blocks intersect the specified range (offset + length)
                // determine what blocks are already stored or beeing requested

                firstBlockOffset = Math.floor(offset / this.blockSize) * this.blockSize;
                allBlockIds = [];
                missingBlockIds = [];
                blockRequests = [];


                for (current = firstBlockOffset; current < top; current += this.blockSize) {
                  blockId = Math.floor(current / this.blockSize);

                  if (!this.blocks.has(blockId) && !this.blockRequests.has(blockId)) {
                    missingBlockIds.push(blockId);
                  }
                  if (this.blockRequests.has(blockId)) {
                    blockRequests.push(this.blockRequests.get(blockId));
                  }
                  allBlockIds.push(blockId);
                }

                // determine whether there are already blocks in the queue to be requested
                // if so, add the missing blocks to this list
                if (!this.blockIdsAwaitingRequest) {
                  this.blockIdsAwaitingRequest = new Set(missingBlockIds);
                } else {
                  for (i = 0; i < missingBlockIds.length; ++i) {
                    id = missingBlockIds[i];

                    this.blockIdsAwaitingRequest.add(id);
                  }
                }

                // in immediate mode, we don't want to wait for possible additional requests coming in

                if (immediate) {
                  _context3.next = 10;
                  break;
                }

                _context3.next = 10;
                return wait();

              case 10:
                if (!this.blockIdsAwaitingRequest) {
                  _context3.next = 33;
                  break;
                }

                // get all coherent blocks as groups to be requested in a single request
                groups = getCoherentBlockGroups(Array.from(this.blockIdsAwaitingRequest).sort());

                // iterate over all blocks

                _loop = function _loop(group) {
                  // fetch a group as in a single request
                  var request = _this.requestData(group[0] * _this.blockSize, group.length * _this.blockSize);

                  // for each block in the request, make a small 'splitter',
                  // i.e: wait for the request to finish, then cut out the bytes for
                  // that block and store it there.
                  // we keep that as a promise in 'blockRequests' to allow waiting on
                  // a single block.

                  var _loop2 = function _loop2(_i) {
                    var id = group[_i];
                    _this.blockRequests.set(id, (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                      var response, o, t, data;
                      return _regenerator2.default.wrap(function _callee2$(_context2) {
                        while (1) {
                          switch (_context2.prev = _context2.next) {
                            case 0:
                              _context2.next = 2;
                              return request;

                            case 2:
                              response = _context2.sent;
                              o = _i * _this.blockSize;
                              t = Math.min(o + _this.blockSize, response.data.byteLength);
                              data = response.data.slice(o, t);

                              _this.blockRequests.delete(id);
                              _this.blocks.set(id, {
                                data: data,
                                offset: response.offset + o,
                                length: data.byteLength,
                                top: response.offset + t
                              });

                            case 8:
                            case 'end':
                              return _context2.stop();
                          }
                        }
                      }, _callee2, _this);
                    }))());
                  };

                  for (var _i = 0; _i < group.length; ++_i) {
                    _loop2(_i);
                  }
                };

                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context3.prev = 16;
                for (_iterator2 = groups[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  group = _step2.value;

                  _loop(group);
                }
                _context3.next = 24;
                break;

              case 20:
                _context3.prev = 20;
                _context3.t0 = _context3['catch'](16);
                _didIteratorError2 = true;
                _iteratorError2 = _context3.t0;

              case 24:
                _context3.prev = 24;
                _context3.prev = 25;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 27:
                _context3.prev = 27;

                if (!_didIteratorError2) {
                  _context3.next = 30;
                  break;
                }

                throw _iteratorError2;

              case 30:
                return _context3.finish(27);

              case 31:
                return _context3.finish(24);

              case 32:
                this.blockIdsAwaitingRequest = null;

              case 33:

                // get a list of currently running requests for the blocks still missing
                missingRequests = [];
                _iteratorNormalCompletion3 = true;
                _didIteratorError3 = false;
                _iteratorError3 = undefined;
                _context3.prev = 37;

                for (_iterator3 = missingBlockIds[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                  _blockId = _step3.value;

                  if (this.blockRequests.has(_blockId)) {
                    missingRequests.push(this.blockRequests.get(_blockId));
                  }
                }

                // wait for all missing requests to finish
                _context3.next = 45;
                break;

              case 41:
                _context3.prev = 41;
                _context3.t1 = _context3['catch'](37);
                _didIteratorError3 = true;
                _iteratorError3 = _context3.t1;

              case 45:
                _context3.prev = 45;
                _context3.prev = 46;

                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }

              case 48:
                _context3.prev = 48;

                if (!_didIteratorError3) {
                  _context3.next = 51;
                  break;
                }

                throw _iteratorError3;

              case 51:
                return _context3.finish(48);

              case 52:
                return _context3.finish(45);

              case 53:
                _context3.next = 55;
                return Promise.all(missingRequests);

              case 55:
                _context3.next = 57;
                return Promise.all(blockRequests);

              case 57:

                // now get all blocks for the request and return a summary buffer
                blocks = allBlockIds.map(function (id) {
                  return _this.blocks.get(id);
                });
                return _context3.abrupt('return', readRangeFromBlocks(blocks, offset, length));

              case 59:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[16, 20, 24, 32], [25,, 27, 31], [37, 41, 45, 53], [46,, 48, 52]]);
      }));

      function fetch(_x4, _x5) {
        return _ref3.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: 'requestData',
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(requestedOffset, requestedLength) {
        var response;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.retrievalFunction(requestedOffset, requestedLength);

              case 2:
                response = _context4.sent;

                if (!response.length) {
                  response.length = response.data.byteLength;
                } else if (response.length !== response.data.byteLength) {
                  response.data = response.data.slice(0, response.length);
                }
                response.top = response.offset + response.length;
                return _context4.abrupt('return', response);

              case 6:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function requestData(_x6, _x7) {
        return _ref5.apply(this, arguments);
      }

      return requestData;
    }()
  }]);
  return BlockedSource;
}();

/**
 * Create a new source to read from a remote file using the
 * [fetch]{@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API} API.
 * @param {string} url The URL to send requests to.
 * @param {Object} [options] Additional options.
 * @param {Number} [options.blockSize] The block size to use.
 * @param {object} [options.headers] Additional headers to be sent to the server.
 * @returns The constructed source
 */


function makeFetchSource(url) {
  var _this2 = this;

  var _ref6 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref6$headers = _ref6.headers,
      headers = _ref6$headers === undefined ? {} : _ref6$headers,
      blockSize = _ref6.blockSize;

  return new BlockedSource(function () {
    var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(offset, length) {
      var response, data, _data;

      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return fetch(url, {
                headers: Object.assign({}, headers, {
                  Range: 'bytes=' + offset + '-' + (offset + length)
                })
              });

            case 2:
              response = _context5.sent;

              if (response.ok) {
                _context5.next = 7;
                break;
              }

              throw new Error('Error fetching data.');

            case 7:
              if (!(response.status === 206)) {
                _context5.next = 21;
                break;
              }

              if (!response.arrayBuffer) {
                _context5.next = 14;
                break;
              }

              _context5.next = 11;
              return response.arrayBuffer();

            case 11:
              _context5.t0 = _context5.sent;
              _context5.next = 17;
              break;

            case 14:
              _context5.next = 16;
              return response.buffer();

            case 16:
              _context5.t0 = _context5.sent.buffer;

            case 17:
              data = _context5.t0;
              return _context5.abrupt('return', {
                data: data,
                offset: offset,
                length: length
              });

            case 21:
              if (!response.arrayBuffer) {
                _context5.next = 27;
                break;
              }

              _context5.next = 24;
              return response.arrayBuffer();

            case 24:
              _context5.t1 = _context5.sent;
              _context5.next = 30;
              break;

            case 27:
              _context5.next = 29;
              return response.buffer();

            case 29:
              _context5.t1 = _context5.sent.buffer;

            case 30:
              _data = _context5.t1;
              return _context5.abrupt('return', {
                data: _data,
                offset: 0,
                length: _data.byteLength
              });

            case 32:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, _this2);
    }));

    return function (_x9, _x10) {
      return _ref7.apply(this, arguments);
    };
  }(), { blockSize: blockSize });
}

/**
 * Create a new source to read from a remote file using the
 * [XHR]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest} API.
 * @param {string} url The URL to send requests to.
 * @param {Object} [options] Additional options.
 * @param {Number} [options.blockSize] The block size to use.
 * @param {object} [options.headers] Additional headers to be sent to the server.
 * @returns The constructed source
 */
function makeXHRSource(url) {
  var _this3 = this;

  var _ref8 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref8$headers = _ref8.headers,
      headers = _ref8$headers === undefined ? {} : _ref8$headers,
      blockSize = _ref8.blockSize;

  return new BlockedSource(function () {
    var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(offset, length) {
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              return _context6.abrupt('return', new Promise(function (resolve, reject) {
                var request = new XMLHttpRequest();
                request.open('GET', url);
                request.responseType = 'arraybuffer';

                Object.entries(Object.assign({}, headers, {
                  Range: 'bytes=' + offset + '-' + (offset + length)
                })).forEach(function (_ref10) {
                  var _ref11 = (0, _slicedToArray3.default)(_ref10, 2),
                      key = _ref11[0],
                      value = _ref11[1];

                  return request.setRequestHeader(key, value);
                });

                request.onload = function () {
                  var data = request.response;
                  if (request.status === 206) {
                    resolve({
                      data: data,
                      offset: offset,
                      length: length
                    });
                  } else {
                    resolve({
                      data: data,
                      offset: 0,
                      length: data.byteLength
                    });
                  }
                };
                request.onerror = reject;
                request.send();
              }));

            case 1:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, _this3);
    }));

    return function (_x12, _x13) {
      return _ref9.apply(this, arguments);
    };
  }(), { blockSize: blockSize });
}

/**
 * Create a new source to read from a remote file using the node
 * [http]{@link https://nodejs.org/api/http.html} API.
 * @param {string} url The URL to send requests to.
 * @param {Object} [options] Additional options.
 * @param {Number} [options.blockSize] The block size to use.
 * @param {object} [options.headers] Additional headers to be sent to the server.
 */
function makeHttpSource(url) {
  var _this4 = this;

  var _ref12 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref12$headers = _ref12.headers,
      headers = _ref12$headers === undefined ? {} : _ref12$headers,
      blockSize = _ref12.blockSize;

  return new BlockedSource(function () {
    var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(offset, length) {
      return _regenerator2.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              return _context7.abrupt('return', new Promise(function (resolve, reject) {
                var parsed = _url2.default.parse(url);
                var request = (parsed.protocol === 'http:' ? _http2.default : _https2.default).get(Object.assign({}, parsed, {
                  headers: Object.assign({}, headers, {
                    Range: 'bytes=' + offset + '-' + (offset + length)
                  })
                }), function (result) {
                  var chunks = [];
                  // collect chunks
                  result.on('data', function (chunk) {
                    chunks.push(chunk);
                  });

                  // concatenate all chunks and resolve the promise with the resulting buffer
                  result.on('end', function () {
                    var data = _buffer.Buffer.concat(chunks).buffer;
                    resolve({
                      data: data,
                      offset: offset,
                      length: data.byteLength
                    });
                  });
                });
                request.on('error', reject);
              }));

            case 1:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, _this4);
    }));

    return function (_x15, _x16) {
      return _ref13.apply(this, arguments);
    };
  }(), { blockSize: blockSize });
}

/**
 * Create a new source to read from a remote file. Uses either XHR, fetch or nodes http API.
 * @param {string} url The URL to send requests to.
 * @param {Object} [options] Additional options.
 * @param {Boolean} [options.forceXHR] Force the usage of XMLHttpRequest.
 * @param {Number} [options.blockSize] The block size to use.
 * @param {object} [options.headers] Additional headers to be sent to the server.
 * @returns The constructed source
 */
function makeRemoteSource(url, options) {
  var forceXHR = options.forceXHR;

  if (typeof fetch === 'function' && !forceXHR) {
    return makeFetchSource(url, options);
  } else if (typeof XMLHttpRequest !== 'undefined') {
    return makeXHRSource(url, options);
  } else if (_http2.default.get) {
    return makeHttpSource(url, options);
  }
  throw new Error('No remote source available');
}

/**
 * Create a new source to read from a local
 * [ArrayBuffer]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer}.
 * @param {ArrayBuffer} arrayBuffer The ArrayBuffer to parse the GeoTIFF from.
 * @returns The constructed source
 */
function makeBufferSource(arrayBuffer) {
  return {
    fetch: function () {
      var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(offset, length) {
        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                return _context8.abrupt('return', arrayBuffer.slice(offset, offset + length));

              case 1:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function fetch(_x17, _x18) {
        return _ref14.apply(this, arguments);
      }

      return fetch;
    }()
  };
}

function openAsync(path, flags) {
  var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

  return new Promise(function (resolve, reject) {
    (0, _fs.open)(path, flags, mode, function (err, fd) {
      if (err) {
        reject(err);
      } else {
        resolve(fd);
      }
    });
  });
}

function readAsync() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new Promise(function (resolve, reject) {
    _fs.read.apply(undefined, args.concat([function (err, bytesRead, buffer) {
      if (err) {
        reject(err);
      } else {
        resolve({ bytesRead: bytesRead, buffer: buffer });
      }
    }]));
  });
}

/**
 * Creates a new source using the node filesystem API.
 * @param {string} path The path to the file in the local filesystem.
 * @returns The constructed source
 */
function makeFileSource(path) {
  var fileOpen = openAsync(path, 'r');

  return {
    fetch: function () {
      var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(offset, length) {
        var fd, _ref16, buffer;

        return _regenerator2.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return fileOpen;

              case 2:
                fd = _context9.sent;
                _context9.next = 5;
                return readAsync(fd, _buffer.Buffer.alloc(length), 0, length, offset);

              case 5:
                _ref16 = _context9.sent;
                buffer = _ref16.buffer;
                return _context9.abrupt('return', buffer.buffer);

              case 8:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function fetch(_x20, _x21) {
        return _ref15.apply(this, arguments);
      }

      return fetch;
    }()
  };
}

/**
 * Create a new source from a given file/blob.
 * @param {Blob} file The file or blob to read from.
 * @returns The constructed source
 */
function makeFileReaderSource(file) {
  return {
    fetch: function () {
      var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(offset, length) {
        return _regenerator2.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                return _context10.abrupt('return', new Promise(function (resolve, reject) {
                  var blob = file.slice(offset, offset + length);
                  var reader = new FileReader();
                  reader.onload = function (event) {
                    return resolve(event.target.result);
                  };
                  reader.onerror = reject;
                  reader.readAsArrayBuffer(blob);
                }));

              case 1:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function fetch(_x22, _x23) {
        return _ref17.apply(this, arguments);
      }

      return fetch;
    }()
  };
}