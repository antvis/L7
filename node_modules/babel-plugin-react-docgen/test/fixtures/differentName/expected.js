"use strict";

var _react = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var stylesheet = {};
/**
 * Component for displaying a container that resembles the original CSS environment for different themes
 */

var OriginalName =
/*#__PURE__*/
function (_Component) {
  _inherits(OriginalName, _Component);

  function OriginalName() {
    _classCallCheck(this, OriginalName);

    return _possibleConstructorReturn(this, _getPrototypeOf(OriginalName).apply(this, arguments));
  }

  _createClass(OriginalName, [{
    key: "getDefaultProps",
    value: function getDefaultProps() {
      return {
        theme: 'damask'
      };
    }
  }, {
    key: "render",
    value: function render() {
      return _react["default"].createElement("div", {
        className: stylesheet[this.props.theme]
      }, this.props.children);
    }
  }]);

  return OriginalName;
}(Component());

_defineProperty(OriginalName, "displayName", 'ThisIsTheDisplayNameNow');

_defineProperty(OriginalName, "propTypes", {
  /**
   * Theme to display
   */
  theme: _react.PropTypes.string,

  /**
   * The component children
   */
  children: _react.PropTypes.node
});

module.exports = OriginalName;
OriginalName.__docgenInfo = {
  "description": "Component for displaying a container that resembles the original CSS environment for different themes",
  "methods": [],
  "displayName": "ThisIsTheDisplayNameNow",
  "props": {
    "theme": {
      "defaultValue": {
        "value": "'damask'",
        "computed": false
      },
      "type": {
        "name": "string"
      },
      "required": false,
      "description": "Theme to display"
    },
    "children": {
      "type": {
        "name": "node"
      },
      "required": false,
      "description": "The component children"
    }
  }
};

if (typeof STORYBOOK_REACT_CLASSES !== "undefined") {
  STORYBOOK_REACT_CLASSES["test/fixtures/differentName/actual.js"] = {
    name: "OriginalName",
    docgenInfo: OriginalName.__docgenInfo,
    path: "test/fixtures/differentName/actual.js"
  };
}
