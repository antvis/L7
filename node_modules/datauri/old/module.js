'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ENC_TYPE = function ENC_TYPE(configSize) {
  return configSize > 1 ? 'encode' : 'encodeSync';
};

var DataURI = function (_Api) {
  _inherits(DataURI, _Api);

  function DataURI() {
    _classCallCheck(this, DataURI);

    var _this = _possibleConstructorReturn(this, (DataURI.__proto__ || Object.getPrototypeOf(DataURI)).call(this));

    for (var _len = arguments.length, config = Array(_len), _key = 0; _key < _len; _key++) {
      config[_key] = arguments[_key];
    }

    var configSize = config.length;


    if (configSize) {
      _this[ENC_TYPE(configSize)].apply(_this, config);
    }
    return _this;
  }

  _createClass(DataURI, null, [{
    key: 'promise',
    value: function promise(fileName) {
      var datauri = new DataURI();

      return new Promise(function (resolve, reject) {
        datauri.on('encoded', resolve).on('error', reject).encode(fileName);
      });
    }
  }, {
    key: 'sync',
    value: function sync(fileName) {
      var _ref = new DataURI(fileName),
          content = _ref.content;

      return content;
    }
  }]);

  return DataURI;
}(_api2.default);

module.exports = DataURI;