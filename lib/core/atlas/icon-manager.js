"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fontUtil = require("../../util/font-util");

var THREE = _interopRequireWildcard(require("../../../../core/three"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BUFFER = 3;
var MAX_CANVAS_WIDTH = 1024;

var IconManager =
/*#__PURE__*/
function () {
  function IconManager() {
    _classCallCheck(this, IconManager);

    this._getIcon = null;
    this._mapping = {};
    this._autoPacking = false;
    this.iconData = {};
    this._canvas = document.createElement('canvas');
    this._texture = new THREE.Texture(this._canvas);
    this.ctx = this._canvas.getContext('2d');
  }

  _createClass(IconManager, [{
    key: "getTexture",
    value: function getTexture() {
      return this._texture;
    }
  }, {
    key: "_updateIconAtlas",
    value: function _updateIconAtlas() {
      this._canvas.width = MAX_CANVAS_WIDTH;
      this._canvas.height = this._canvasHeigth;

      for (var key in this.mapping) {
        var icon = this.mapping[key];
        var x = icon.x,
            y = icon.y,
            image = icon.image;
        this.ctx.drawImage(image, x, y, this.imageWidth, this.imageWidth);
      }

      this.texture.magFilter = THREE.LinearFilter;
      this.texture.minFilter = THREE.LinearFilter;
      this.texture.needsUpdate = true;
    }
  }, {
    key: "addImage",
    value: function addImage(id, opt) {
      var _this = this;

      this._loadImage(opt).then(function (image) {
        _this.iconData.push({
          id: id,
          image: image
        });

        var _buildIconMaping = (0, _fontUtil.buildIconMaping)(_this.iconData, BUFFER, MAX_CANVAS_WIDTH),
            mapping = _buildIconMaping.mapping,
            canvasHeight = _buildIconMaping.canvasHeight;

        _this._mapping = mapping;
        _this._canvasHeigth = canvasHeight;
      });
    }
  }, {
    key: "_loadImage",
    value: function _loadImage(url) {
      return new Promise(function (resolve, reject) {
        var image = new Image();

        image.onload = function () {
          resolve(image);
        };

        image.onerror = function () {
          reject(new Error('Could not load image at ' + url));
        };

        image.src = url;
      });
    }
  }]);

  return IconManager;
}();

exports["default"] = IconManager;