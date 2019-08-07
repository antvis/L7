"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _rbush = _interopRequireDefault(require("rbush"));

var _bbox = _interopRequireDefault(require("@turf/bbox"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FeatureIndex =
/*#__PURE__*/
function () {
  function FeatureIndex(data) {
    var _this = this;

    _classCallCheck(this, FeatureIndex);

    this.tree = (0, _rbush["default"])();
    this.rawData = data;
    data.features.forEach(function (feature) {
      _this.insert(feature);
    });
  }

  _createClass(FeatureIndex, [{
    key: "insert",
    value: function insert(feature) {
      var bbox = this.toBBox(feature);
      bbox.feature = feature;
      this.tree.insert(bbox);
    }
  }, {
    key: "search",
    value: function search(feature) {
      return this.tree.search(this.toBBox(feature));
    }
  }, {
    key: "clear",
    value: function clear() {
      this.tree.clear();
    }
  }, {
    key: "all",
    value: function all() {
      return this.tree.all();
    }
  }, {
    key: "toBBox",
    value: function toBBox(feature) {
      var bbox = feature.type === 'Point' ? this.pointBBox(feature) : (0, _bbox["default"])(feature);
      return {
        minX: bbox[0],
        minY: bbox[1],
        maxX: bbox[2],
        maxY: bbox[3]
      };
    }
  }, {
    key: "pointBBox",
    value: function pointBBox(feature) {
      var size = 1 / 1000 / 1000; //  1m

      var _feature$geometry$coo = _slicedToArray(feature.geometry.coordinates, 2),
          x = _feature$geometry$coo[0],
          y = _feature$geometry$coo[1];

      return [x - size, y - size, x + size, y + size];
    }
  }]);

  return FeatureIndex;
}();

exports["default"] = FeatureIndex;