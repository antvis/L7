'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _mimer = require('mimer');

var _mimer2 = _interopRequireDefault(_mimer);

var _imageSize = require('image-size');

var _imageSize2 = _interopRequireDefault(_imageSize);

var _uri = require('./template/uri');

var _uri2 = _interopRequireDefault(_uri);

var _css = require('./template/css');

var _css2 = _interopRequireDefault(_css);

var _stream = require('stream');

var _stream2 = _interopRequireDefault(_stream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Api extends _stream2.default {
  constructor() {
    super();

    this.readable = true;
  }

  format(fileName, fileContent) {
    const fileBuffer = fileContent instanceof Buffer ? fileContent : new Buffer(fileContent);

    this.base64 = fileBuffer.toString('base64');
    this.createMetadata(fileName);

    return this;
  }

  createMetadata(fileName) {
    this.fileName = fileName;
    this.mimetype = (0, _mimer2.default)(fileName);
    const mimetype = this.mimetype;
    var _base = this.base64;
    const base64 = _base === undefined ? '' : _base;

    this.content = (0, _uri2.default)({ mimetype, base64 });

    return this;
  }

  runCallback(handler, err) {
    if (err) {
      return handler(err);
    }

    handler.call(this, null, this.content, this);
  }

  encode(fileName, handler) {
    return this.async(fileName, err => handler && this.runCallback(handler, err));
  }

  async(fileName, handler) {
    const base64Chunks = [];
    const propagateStream = chunk => this.emit('data', chunk);

    propagateStream(this.createMetadata(fileName).content);
    (0, _fs.createReadStream)(fileName, { encoding: 'base64' }).on('data', propagateStream).on('data', chunk => base64Chunks.push(chunk)).on('error', err => {
      handler(err);
      this.emit('error', err);
    }).on('end', () => {
      this.base64 = base64Chunks.join('');
      this.emit('end');
      handler.call(this.createMetadata(fileName));
      this.emit('encoded', this.content, this);
    });
  }

  encodeSync(fileName) {
    if (!fileName || !fileName.trim || fileName.trim() === '') {
      throw new Error('Insert a File path as string argument');
    }

    if ((0, _fs.existsSync)(fileName)) {
      let fileContent = (0, _fs.readFileSync)(fileName);

      return this.format(fileName, fileContent).content;
    }

    throw new Error(`The file ${fileName} was not found!`);
  }

  getCSS() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (!this.content) {
      throw new Error('Create a data-uri config using the method encodeSync');
    }

    config.class = config.class || _path2.default.basename(this.fileName, _path2.default.extname(this.fileName));
    config.background = this.content;

    if (config.width || config.height || config['background-size']) {
      config.dimensions = (0, _imageSize2.default)(this.fileName);
    }

    return (0, _css2.default)(config);
  }
}

exports.default = Api;