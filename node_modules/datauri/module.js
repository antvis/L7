'use strict';

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ENC_TYPE = configSize => configSize > 1 ? 'encode' : 'encodeSync';

class DataURI extends _api2.default {

  constructor() {
    super();

    for (var _len = arguments.length, config = Array(_len), _key = 0; _key < _len; _key++) {
      config[_key] = arguments[_key];
    }

    const configSize = config.length;


    if (configSize) {
      this[ENC_TYPE(configSize)].apply(this, config);
    }
  }

  static promise(fileName) {
    const datauri = new DataURI();

    return new Promise((resolve, reject) => {
      datauri.on('encoded', resolve).on('error', reject).encode(fileName);
    });
  }

  static sync(fileName) {
    var _ref = new DataURI(fileName);

    const content = _ref.content;


    return content;
  }

}

module.exports = DataURI;