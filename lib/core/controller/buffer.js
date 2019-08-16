"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _util = _interopRequireDefault(require("../../util"));

var _object3dUtil = require("../../util/object3d-util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BufferController =
/*#__PURE__*/
function () {
  function BufferController(cfg) {
    _classCallCheck(this, BufferController);

    // defs 列定义
    _util["default"].assign(this, cfg);

    if (!this.mesh) this.mesh = this.layer;
  }

  _createClass(BufferController, [{
    key: "_updateColorAttributes",
    value: function _updateColorAttributes() {
      var _this = this;

      var filterData = this.mesh.layerData;
      var colorKey = {};

      for (var e = 0; e < filterData.length; e++) {
        var item = filterData[e];
        colorKey[item.id] = item.color;
      }

      this.layer._activeIds = null; // 清空选中元素xwxw

      var colorAttr = this.mesh.mesh.geometry.attributes.a_color;
      var pickAttr = this.mesh.mesh.geometry.attributes.pickingId;
      pickAttr.array.forEach(function (id, index) {
        var newId = Math.abs(id);
        var item = null;
        var color = null;

        if (_this.mesh.layerSource.data.featureKeys) {
          // hash数据映射
          newId = _this.mesh.layerSource.data.featureKeys[newId].index;
          item = filterData[newId];
          color = colorKey[item.id];
        } else {
          item = filterData[newId - 1];
          color = colorKey[newId];
        }

        if (item.hasOwnProperty('filter') && item.filter === false) {
          colorAttr.array[index * 4 + 0] = 0;
          colorAttr.array[index * 4 + 1] = 0;
          colorAttr.array[index * 4 + 2] = 0;
          colorAttr.array[index * 4 + 3] = 0;
          pickAttr.array[index] = -id; // 通过Id数据过滤 id<0 不显示
        } else {
          colorAttr.array[index * 4 + 0] = color[0];
          colorAttr.array[index * 4 + 1] = color[1];
          colorAttr.array[index * 4 + 2] = color[2];
          colorAttr.array[index * 4 + 3] = color[3];
          pickAttr.array[index] = id;
        }
      });
      colorAttr.needsUpdate = true;
      pickAttr.needsUpdate = true;
    }
  }, {
    key: "_updateStyle",
    value: function _updateStyle(option) {
      var newOption = {};

      for (var key in option) {
        newOption['u_' + key] = option[key];
      }

      (0, _object3dUtil.updateObjecteUniform)(this.mesh._object3D, newOption);
    }
  }]);

  return BufferController;
}();

exports["default"] = BufferController;