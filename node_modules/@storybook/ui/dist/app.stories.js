"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.create");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-prototype-of");

require("core-js/modules/es.object.set-prototype-of");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _addons = _interopRequireDefault(require("@storybook/addons"));

var _index = require("./index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _ref =
/*#__PURE__*/
_react["default"].createElement("div", null, "Hello world");

var FakeProvider =
/*#__PURE__*/
function (_Provider) {
  _inherits(FakeProvider, _Provider);

  function FakeProvider() {
    var _this;

    _classCallCheck(this, FakeProvider);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FakeProvider).call(this));
    _this.addons = _addons["default"];
    _this.channel = {
      on: function on() {},
      off: function off() {},
      emit: function emit() {},
      addPeerListener: function addPeerListener() {}
    };
    return _this;
  }

  _createClass(FakeProvider, [{
    key: "getElements",
    value: function getElements(type) {
      return _addons["default"].getElements(type);
    }
  }, {
    key: "renderPreview",
    value: function renderPreview() {
      return _ref;
    }
  }, {
    key: "handleAPI",
    value: function handleAPI(api) {
      _addons["default"].loadAddons(api);
    }
  }]);

  return FakeProvider;
}(_index.Provider);

(0, _react2.storiesOf)('UI|Layout/App', module).addParameters({
  component: _index.Root
}).add('default', function () {
  return _react["default"].createElement(_index.Root, {
    provider: new FakeProvider()
  });
});