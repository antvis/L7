function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var enhancer = function enhancer(WrappedComponent) {
  return (
    /*#__PURE__*/
    function (_WrappedComponent) {
      _inherits(Progress, _WrappedComponent);

      function Progress() {
        _classCallCheck(this, Progress);

        return _possibleConstructorReturn(this, _getPrototypeOf(Progress).apply(this, arguments));
      }

      _createClass(Progress, [{
        key: "componentDidUpdate",
        value: function componentDidUpdate() {
          var _this = this;

          var now = Date.now();
          var updated = false;
          Object.keys(this.paths).forEach(function (key) {
            var path = _this.paths[key];

            if (!path) {
              return;
            }

            updated = true;
            var pathStyle = path.style;
            pathStyle.transitionDuration = '.3s, .3s, .3s, .06s';

            if (_this.prevTimeStamp && now - _this.prevTimeStamp < 100) {
              pathStyle.transitionDuration = '0s, 0s';
            }
          });

          if (updated) {
            this.prevTimeStamp = Date.now();
          }
        }
      }, {
        key: "render",
        value: function render() {
          return _get(_getPrototypeOf(Progress.prototype), "render", this).call(this);
        }
      }]);

      return Progress;
    }(WrappedComponent)
  );
};

export default enhancer;