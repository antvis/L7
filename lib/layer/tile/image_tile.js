"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _tile = _interopRequireDefault(require("./tile"));

var _image = _interopRequireDefault(require("../../geom/buffer/image"));

var _drawImage = _interopRequireDefault(require("../render/image/drawImage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ImageTile =
/*#__PURE__*/
function (_Tile) {
  _inherits(ImageTile, _Tile);

  function ImageTile() {
    _classCallCheck(this, ImageTile);

    return _possibleConstructorReturn(this, _getPrototypeOf(ImageTile).apply(this, arguments));
  }

  _createClass(ImageTile, [{
    key: "requestTileAsync",
    value: function requestTileAsync() {
      var _this = this;

      // Making this asynchronous really speeds up the LOD framerate
      setTimeout(function () {
        if (!_this._mesh) {
          // this._mesh = this._createMesh();
          _this._requestTile();
        }
      }, 0);
    }
  }, {
    key: "_requestTile",
    value: function _requestTile() {
      var image = this._createDebugMesh();

      this._createMesh(image);

      this.emit('tileLoaded'); // const urlParams = {
      //   x: this._tile[0],
      //   y: this._tile[1],
      //   z: this._tile[2]
      // };
      // const url = this._getTileURL(urlParams);
      // const image = document.createElement('img');
      // image.addEventListener('load', () => {
      //   this._isLoaded = true;
      //   this._createMesh(image);
      //   this.emit('tileLoaded');
      //   this._ready = true;
      // }, false);
      // image.crossOrigin = '';
      // // Load image
      // image.src = url;
      // this._image = image;
    }
  }, {
    key: "_getBufferData",
    value: function _getBufferData(images) {
      var NW = this._tileBounds.getTopLeft();

      var SE = this._tileBounds.getBottomRight();

      var coordinates = [[NW.x, NW.y, 0], [SE.x, SE.y, 0]];
      return [{
        coordinates: coordinates,
        images: images
      }];
    }
  }, {
    key: "_createMesh",
    value: function _createMesh(image) {
      if (!this._center) {
        return;
      }

      this._layerData = this._getBufferData(image);
      var buffer = new _image["default"]({
        layerData: this._layerData
      });
      buffer.attributes.texture = buffer.texture;
      var style = this.layer.get('styleOptions');
      var mesh = (0, _drawImage["default"])(buffer.attributes, style);

      this._object3D.add(mesh);

      return this._object3D;
    }
  }, {
    key: "_createDebugMesh",
    value: function _createDebugMesh() {
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 256;
      context.font = 'Bold 20px Helvetica Neue, Verdana, Arial';
      context.fillStyle = '#ff0000';
      context.fillText(this._tile.join('/'), 20, 20);
      context.strokeStyle = 'red';
      context.rect(0, 0, 256, 256);
      context.stroke();
      return canvas;
    }
  }, {
    key: "_abortRequest",
    value: function _abortRequest() {
      if (!this._image) {
        return;
      }

      this._image.src = '';
    }
  }, {
    key: "updateColor",
    value: function updateColor() {}
  }, {
    key: "getSelectFeature",
    value: function getSelectFeature() {
      return {};
    }
  }, {
    key: "destroy",
    value: function destroy() {
      // Cancel any pending requests
      this._abortRequest(); // Clear image reference


      this._image = null;

      _get(_getPrototypeOf(ImageTile.prototype), "destroy", this).call(this);
    }
  }]);

  return ImageTile;
}(_tile["default"]);

exports["default"] = ImageTile;