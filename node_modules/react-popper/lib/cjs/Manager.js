"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ManagerReferenceNodeSetterContext = exports.ManagerReferenceNodeContext = void 0;

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var React = _interopRequireWildcard(require("react"));

var _createReactContext = _interopRequireDefault(require("create-react-context"));

var ManagerReferenceNodeContext = (0, _createReactContext.default)();
exports.ManagerReferenceNodeContext = ManagerReferenceNodeContext;
var ManagerReferenceNodeSetterContext = (0, _createReactContext.default)();
exports.ManagerReferenceNodeSetterContext = ManagerReferenceNodeSetterContext;

var Manager =
/*#__PURE__*/
function (_React$Component) {
  (0, _inheritsLoose2.default)(Manager, _React$Component);

  function Manager() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "referenceNode", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "setReferenceNode", function (newReferenceNode) {
      if (newReferenceNode && _this.referenceNode !== newReferenceNode) {
        _this.referenceNode = newReferenceNode;

        _this.forceUpdate();
      }
    });
    return _this;
  }

  var _proto = Manager.prototype;

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.referenceNode = null;
  };

  _proto.render = function render() {
    return React.createElement(ManagerReferenceNodeContext.Provider, {
      value: this.referenceNode
    }, React.createElement(ManagerReferenceNodeSetterContext.Provider, {
      value: this.setReferenceNode
    }, this.props.children));
  };

  return Manager;
}(React.Component);

exports.default = Manager;