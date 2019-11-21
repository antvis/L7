import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import * as React from 'react';
import createContext from 'create-react-context';
export var ManagerReferenceNodeContext = createContext();
export var ManagerReferenceNodeSetterContext = createContext();

var Manager =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(Manager, _React$Component);

  function Manager() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

    _defineProperty(_assertThisInitialized(_this), "referenceNode", void 0);

    _defineProperty(_assertThisInitialized(_this), "setReferenceNode", function (newReferenceNode) {
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

export { Manager as default };