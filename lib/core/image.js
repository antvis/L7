"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var THREE = _interopRequireWildcard(require("./three"));

var _wolfy87Eventemitter = _interopRequireDefault(require("wolfy87-eventemitter"));

var _ajax = require("../util/ajax");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// 将图片标注绘制在512*512的画布上，每个大小 64*64 支持 64种图片
var LoadImage =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(LoadImage, _EventEmitter);

  function LoadImage() {
    var _this;

    _classCallCheck(this, LoadImage);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LoadImage).call(this));
    var pixelRatio = window.devicePixelRatio || 1;
    _this.imageWidth = 64 * pixelRatio;
    _this.canvas = document.createElement('canvas');
    _this.canvas.style.cssText += 'height: 512px;width: 512px;';
    _this.canvas.width = _this.imageWidth * 8;
    _this.canvas.height = _this.imageWidth * 8;
    _this.ctx = _this.canvas.getContext('2d');
    _this.images = [];
    _this.imagesCount = 0;
    _this.imagePos = {};
    _this.imagesIds = [];
    return _this;
  }

  _createClass(LoadImage, [{
    key: "addImage",
    value: function addImage(id, opt) {
      var _this2 = this;

      this.imagesCount++;
      this.imagesIds.push(id);
      var imageCount = this.imagesCount;
      var x = imageCount % 8 * this.imageWidth;
      var y = parseInt(imageCount / 8) * this.imageWidth;
      this.imagePos[id] = {
        x: x / this.canvas.width,
        y: y / this.canvas.height
      };
      this.texture = new THREE.Texture(this.canvas);

      if (typeof opt === 'string') {
        (0, _ajax.getImage)({
          url: opt
        }, function (err, img) {
          img.id = id;

          _this2.images.push(img);

          _this2.ctx.drawImage(img, x, y, _this2.imageWidth, _this2.imageWidth);

          _this2.texture.magFilter = THREE.LinearFilter;
          _this2.texture.minFilter = THREE.LinearFilter;
          _this2.texture.needsUpdate = true;

          if (_this2.images.length === _this2.imagesCount) {
            _this2.emit('imageLoaded');
          }
        });
      } else {
        var width = opt.width,
            height = opt.height,
            channels = opt.channels;
        var data = new Uint8Array(width * height * channels);
        var image = new Image();
        image.width = width;
        image.height = height;
        image.data = data;
        image.id = id;
        this.images.push(image);
        this.ctx.drawImage(image, x, y, this.imageWidth, this.imageWidth);
        this.texture = new THREE.CanvasTexture(this.canvas);
        this.imagePos[id] = {
          x: x >> 9,
          y: y >> 9
        };

        if (this.images.length === this.imagesCount) {
          this.emit('imageLoaded');
        }
      }
    }
  }, {
    key: "removeImage",
    value: function removeImage() {} // todo
    // drawAllImages() {
    //   this.images.forEach((item, index) => {
    //     const x = parseInt(index / 8) * 64;
    //     const y = index % 8 * 64;
    //     this.ctx.drawImage(item, x, y, 64, 64);
    //   });
    //   this.texture = new CanvasTexture(this.canvas);
    //   this.texture.needsUpdate=true;
    // }

  }]);

  return LoadImage;
}(_wolfy87Eventemitter["default"]);

exports["default"] = LoadImage;