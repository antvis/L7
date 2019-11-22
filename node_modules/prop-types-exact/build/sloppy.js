Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports['default'] = sloppy;

var _reflect = require('reflect.ownkeys');

var _reflect2 = _interopRequireDefault(_reflect);

var _2 = require('./');

var _3 = _interopRequireDefault(_2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _ownKeys = (0, _reflect2['default'])((0, _3['default'])({})),
    _ownKeys2 = _slicedToArray(_ownKeys, 1),
    semaphore = _ownKeys2[0];

function sloppy(_ref) {
  var _ = _ref[semaphore],
      propTypes = _objectWithoutProperties(_ref, [semaphore]);

  return propTypes;
}
module.exports = exports['default'];
//# sourceMappingURL=sloppy.js.map