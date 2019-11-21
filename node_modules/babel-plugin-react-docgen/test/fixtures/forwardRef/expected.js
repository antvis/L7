"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorBox = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * forwardRef Wrapped Component
 */
var ErrorBox = _react["default"].forwardRef(function (_ref, ref) {
  var children = _ref.children,
      color = _ref.color;
  return _react["default"].createElement("div", {
    className: "error-box",
    style: {
      color: color
    }
  }, children);
});

exports.ErrorBox = ErrorBox;
ErrorBox.displayName = 'ErrorBox';
ErrorBox.defaultProps = {
  color: 'red'
};
ErrorBox.propTypes = {
  /**
   * Children
   */
  children: _react["default"].PropTypes.node.isRequired,

  /**
   * Color
   */
  color: _react["default"].PropTypes.oneOf(['red', 'green', 'blue'])
};
ErrorBox.__docgenInfo = {
  "description": "forwardRef Wrapped Component",
  "methods": [],
  "displayName": "ErrorBox",
  "props": {
    "color": {
      "defaultValue": {
        "value": "'red'",
        "computed": false
      },
      "type": {
        "name": "enum",
        "value": [{
          "value": "'red'",
          "computed": false
        }, {
          "value": "'green'",
          "computed": false
        }, {
          "value": "'blue'",
          "computed": false
        }]
      },
      "required": false,
      "description": "Color"
    },
    "children": {
      "type": {
        "name": "node"
      },
      "required": true,
      "description": "Children"
    }
  }
};

if (typeof STORYBOOK_REACT_CLASSES !== "undefined") {
  STORYBOOK_REACT_CLASSES["test/fixtures/forwardRef/actual.js"] = {
    name: "ErrorBox",
    docgenInfo: ErrorBox.__docgenInfo,
    path: "test/fixtures/forwardRef/actual.js"
  };
}