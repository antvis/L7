"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CompA = exports["default"] = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * Super tiny component
 */
var Component =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Component, _React$Component);

  function Component() {
    _classCallCheck(this, Component);

    return _possibleConstructorReturn(this, _getPrototypeOf(Component).apply(this, arguments));
  }

  _createClass(Component, [{
    key: "render",
    value: function render() {
      return null;
    }
  }]);

  return Component;
}(React.Component);

Component.propTypes = {
  /** Description for children */
  children: React.PropTypes.string.isRequired,

  /**
   * What happens onClick stays onClick
   */
  onClick: React.PropTypes.func,

  /** Fancy styles in here */
  style: React.PropTypes.object
};
Component.__docgenInfo = {
  "description": "Super tiny component",
  "methods": [],
  "displayName": "Component",
  "props": {
    "children": {
      "type": {
        "name": "custom",
        "raw": "React.PropTypes.string.isRequired"
      },
      "required": false,
      "description": "Description for children"
    },
    "onClick": {
      "type": {
        "name": "custom",
        "raw": "React.PropTypes.func"
      },
      "required": false,
      "description": "What happens onClick stays onClick"
    },
    "style": {
      "type": {
        "name": "custom",
        "raw": "React.PropTypes.object"
      },
      "required": false,
      "description": "Fancy styles in here"
    }
  }
};

var _default = withHoc()(deeperHoc(Component));

exports["default"] = _default;

var CompA =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(CompA, _React$Component2);

  function CompA() {
    _classCallCheck(this, CompA);

    return _possibleConstructorReturn(this, _getPrototypeOf(CompA).apply(this, arguments));
  }

  _createClass(CompA, [{
    key: "render",
    value: function render() {
      return null;
    }
  }]);

  return CompA;
}(React.Component);

exports.CompA = CompA;
CompA.propTypes = {
  /** Fancy styles in here */
  myProp: React.PropTypes.object
};
CompA.__docgenInfo = {
  "description": "",
  "methods": [],
  "displayName": "CompA",
  "props": {
    "myProp": {
      "type": {
        "name": "custom",
        "raw": "React.PropTypes.object"
      },
      "required": false,
      "description": "Fancy styles in here"
    }
  }
};

if (typeof STORYBOOK_REACT_CLASSES !== "undefined") {
  STORYBOOK_REACT_CLASSES["test/fixtures/hoc-multiple/actual.js"] = {
    name: "Component",
    docgenInfo: Component.__docgenInfo,
    path: "test/fixtures/hoc-multiple/actual.js"
  };
}

if (typeof STORYBOOK_REACT_CLASSES !== "undefined") {
  STORYBOOK_REACT_CLASSES["test/fixtures/hoc-multiple/actual.js"] = {
    name: "CompA",
    docgenInfo: CompA.__docgenInfo,
    path: "test/fixtures/hoc-multiple/actual.js"
  };
}
