"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var EventContoller =
/*#__PURE__*/
function () {
  function EventContoller(cfg) {
    _classCallCheck(this, EventContoller);

    _util["default"].assign(this, cfg);
  }

  _createClass(EventContoller, [{
    key: "_init",
    value: function _init() {
      var _this = this;

      this.layer.scene.on('pick-' + this.layer.layerId, function (e) {
        var featureId = e.featureId,
            point2d = e.point2d,
            type = e.type;

        if (featureId < 0 && _this._activeIds !== null) {
          type = 'mouseleave';
        }

        _this._activeIds = featureId; // TODO 瓦片图层获取选中数据信息

        var lnglat = _this.layer.scene.containerToLngLat(point2d);

        var _this$layer$getSelect = _this.layer.getSelectFeature(featureId, lnglat),
            feature = _this$layer$getSelect.feature,
            style = _this$layer$getSelect.style; // const style = this.layerData[featureId - 1];


        var target = {
          featureId: featureId,
          feature: feature,
          style: style,
          pixel: point2d,
          type: type,
          lnglat: {
            lng: lnglat.lng,
            lat: lnglat.lat
          }
        };

        if (featureId >= 0 || _this._activeIds >= 0) {
          // 拾取到元素，或者离开元素
          _this.layer.emit(type, target);
        }
      });
    }
  }, {
    key: "_initMapEvent",
    value: function _initMapEvent() {}
  }]);

  return EventContoller;
}();

exports["default"] = EventContoller;