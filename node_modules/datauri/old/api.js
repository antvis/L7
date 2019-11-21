'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Api = function (_Stream) {
  _inherits(Api, _Stream);

  function Api() {
    _classCallCheck(this, Api);

    var _this = _possibleConstructorReturn(this, (Api.__proto__ || Object.getPrototypeOf(Api)).call(this));

    _this.readable = true;
    return _this;
  }

  _createClass(Api, [{
    key: 'format',
    value: function format(fileName, fileContent) {
      var fileBuffer = fileContent instanceof Buffer ? fileContent : new Buffer(fileContent);

      this.base64 = fileBuffer.toString('base64');
      this.createMetadata(fileName);

      return this;
    }
  }, {
    key: 'createMetadata',
    value: function createMetadata(fileName) {
      this.fileName = fileName;
      this.mimetype = (0, _mimer2.default)(fileName);
      var mimetype = this.mimetype,
          _base = this.base64,
          base64 = _base === undefined ? '' : _base;

      this.content = (0, _uri2.default)({ mimetype: mimetype, base64: base64 });

      return this;
    }
  }, {
    key: 'runCallback',
    value: function runCallback(handler, err) {
      if (err) {
        return handler(err);
      }

      handler.call(this, null, this.content, this);
    }
  }, {
    key: 'encode',
    value: function encode(fileName, handler) {
      var _this2 = this;

      return this.async(fileName, function (err) {
        return handler && _this2.runCallback(handler, err);
      });
    }
  }, {
    key: 'async',
    value: function async(fileName, handler) {
      var _this3 = this;

      var base64Chunks = [];
      var propagateStream = function propagateStream(chunk) {
        return _this3.emit('data', chunk);
      };

      propagateStream(this.createMetadata(fileName).content);
      (0, _fs.createReadStream)(fileName, { encoding: 'base64' }).on('data', propagateStream).on('data', function (chunk) {
        return base64Chunks.push(chunk);
      }).on('error', function (err) {
        handler(err);
        _this3.emit('error', err);
      }).on('end', function () {
        _this3.base64 = base64Chunks.join('');
        _this3.emit('end');
        handler.call(_this3.createMetadata(fileName));
        _this3.emit('encoded', _this3.content, _this3);
      });
    }
  }, {
    key: 'encodeSync',
    value: function encodeSync(fileName) {
      if (!fileName || !fileName.trim || fileName.trim() === '') {
        throw new Error('Insert a File path as string argument');
      }

      if ((0, _fs.existsSync)(fileName)) {
        var fileContent = (0, _fs.readFileSync)(fileName);

        return this.format(fileName, fileContent).content;
      }

      throw new Error('The file ' + fileName + ' was not found!');
    }
  }, {
    key: 'getCSS',
    value: function getCSS() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

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
  }]);

  return Api;
}(_stream2.default);

exports.default = Api;