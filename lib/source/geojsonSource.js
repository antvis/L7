"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _source = _interopRequireDefault(require("../core/source"));

var turfMeta = _interopRequireWildcard(require("@turf/meta"));

var _cleanCoords = _interopRequireDefault(require("@turf/clean-coords"));

var _invariant = require("@turf/invariant");

var _featureIndex = _interopRequireDefault(require("../geo/featureIndex"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var GeojsonSource =
/*#__PURE__*/
function (_Source) {
  _inherits(GeojsonSource, _Source);

  function GeojsonSource() {
    _classCallCheck(this, GeojsonSource);

    return _possibleConstructorReturn(this, _getPrototypeOf(GeojsonSource).apply(this, arguments));
  }

  _createClass(GeojsonSource, [{
    key: "prepareData",
    value: function prepareData() {
      var _this = this;

      this.type = 'geojson';
      var data = this.get('data');
      this.propertiesData = [];
      this.geoData = [];
      turfMeta.flattenEach(data, function (currentFeature, featureIndex) {
        var coord = (0, _invariant.getCoords)((0, _cleanCoords.default)(currentFeature));

        _this.geoData.push(_this._coordProject(coord));

        currentFeature.properties._id = featureIndex + 1;

        _this.propertiesData.push(currentFeature.properties);
      });
    }
  }, {
    key: "featureIndex",
    value: function featureIndex() {
      var data = this.get('data');
      this.featureIndex = new _featureIndex.default(data);
    }
  }, {
    key: "getSelectFeatureId",
    value: function getSelectFeatureId(featureId) {
      var data = this.get('data');
      var selectFeatureIds = [];
      var featureStyleId = 0;
      turfMeta.flattenEach(data, function (currentFeature, featureIndex
      /* , multiFeatureIndex*/
      ) {
        if (featureIndex === featureId) {
          selectFeatureIds.push(featureStyleId);
        }

        featureStyleId++;

        if (featureIndex > featureId) {
          return;
        }
      });
      return selectFeatureIds;
    }
  }, {
    key: "getSelectFeature",
    value: function getSelectFeature(featureId) {
      var data = this.get('data');
      return data.features[featureId];
    }
  }]);

  return GeojsonSource;
}(_source.default);

exports.default = GeojsonSource;