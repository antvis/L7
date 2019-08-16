"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GaodeMap =
/*#__PURE__*/
function () {
  function GaodeMap(map) {
    _classCallCheck(this, GaodeMap);

    this.map = map;
  }

  _createClass(GaodeMap, [{
    key: "getZoom",
    value: function getZoom() {
      return this.map.getZoom();
    }
  }, {
    key: "getCenter",
    value: function getCenter() {
      return this.map.getCenter();
    }
  }, {
    key: "getSize",
    value: function getSize() {
      return this.map.getSize();
    }
  }, {
    key: "getPitch",
    value: function getPitch() {
      return this.map.getPitch();
    }
  }, {
    key: "getRotation",
    value: function getRotation() {
      return this.map.getRotation();
    }
  }, {
    key: "getStatus",
    value: function getStatus() {
      return this.map.getStatus();
    }
  }, {
    key: "getScale",
    value: function getScale() {
      return this.map.getScale();
    }
  }, {
    key: "setZoom",
    value: function setZoom(zoom) {
      return this.map.setZoom(zoom);
    }
  }, {
    key: "setCenter",
    value: function setCenter(lnglat) {
      return this.map.setCenter(lnglat);
    }
  }, {
    key: "setBounds",
    value: function setBounds(bounds) {
      return this.map.setBounds(bounds);
    }
  }, {
    key: "setRotation",
    value: function setRotation(rotation) {
      return this.map.setRotation(rotation);
    }
  }, {
    key: "zoomIn",
    value: function zoomIn() {
      return this.map.zoomIn();
    }
  }, {
    key: "zoomOut",
    value: function zoomOut() {
      return this.map.zoomOut();
    }
  }, {
    key: "panTo",
    value: function panTo(lngLat) {
      return this.map.panTo(lngLat);
    }
  }, {
    key: "panBy",
    value: function panBy(x, y) {
      return this.map.panBy(x, y);
    }
  }, {
    key: "setPitch",
    value: function setPitch(pitch) {
      return this.map.setPitch(pitch);
    }
  }, {
    key: "pixelToLngLat",
    value: function pixelToLngLat(lngLat, level) {
      return this.map.pixelToLngLat(lngLat, level);
    }
  }, {
    key: "lngLatToPixel",
    value: function lngLatToPixel(lngLat, level) {
      return this.map.lnglatToPixel(lngLat, level);
    }
  }, {
    key: "containerToLngLat",
    value: function containerToLngLat(pixel) {
      var ll = new AMap.Pixel(pixel.x, pixel.y);
      return this.map.containerToLngLat(ll);
    }
  }, {
    key: "setMapStyle",
    value: function setMapStyle(style) {
      return this.map.setMapStyle(style);
    }
  }]);

  return GaodeMap;
}();

exports.default = GaodeMap;