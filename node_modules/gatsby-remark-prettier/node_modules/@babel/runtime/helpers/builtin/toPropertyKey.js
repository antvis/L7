var _typeof = require("../../helpers/builtin/typeof");

function _toPropertyKey(key) {
  if (_typeof(key) === "symbol") {
    return key;
  } else {
    return String(key);
  }
}

module.exports = _toPropertyKey;