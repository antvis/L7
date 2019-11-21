"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

var _rcTree = _interopRequireWildcard(require("rc-tree"));

var _classnames = _interopRequireDefault(require("classnames"));

var _DirectoryTree = _interopRequireDefault(require("./DirectoryTree"));

var _icon = _interopRequireDefault(require("../icon"));

var _configProvider = require("../config-provider");

var _motion = _interopRequireDefault(require("../_util/motion"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Tree =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Tree, _React$Component);

  function Tree() {
    var _this;

    _classCallCheck(this, Tree);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Tree).apply(this, arguments));

    _this.renderSwitcherIcon = function (prefixCls, switcherIcon, _ref) {
      var isLeaf = _ref.isLeaf,
          expanded = _ref.expanded,
          loading = _ref.loading;
      var showLine = _this.props.showLine;

      if (loading) {
        return React.createElement(_icon["default"], {
          type: "loading",
          className: "".concat(prefixCls, "-switcher-loading-icon")
        });
      }

      if (isLeaf) {
        if (showLine) {
          return React.createElement(_icon["default"], {
            type: "file",
            className: "".concat(prefixCls, "-switcher-line-icon")
          });
        }

        return null;
      }

      var switcherCls = "".concat(prefixCls, "-switcher-icon");

      if (switcherIcon) {
        var switcherOriginCls = switcherIcon.props.className || '';
        return React.cloneElement(switcherIcon, {
          className: (0, _classnames["default"])(switcherOriginCls, switcherCls)
        });
      }

      if (showLine) {
        return React.createElement(_icon["default"], {
          type: expanded ? 'minus-square' : 'plus-square',
          className: "".concat(prefixCls, "-switcher-line-icon"),
          theme: "outlined"
        });
      }

      return React.createElement(_icon["default"], {
        type: "caret-down",
        className: switcherCls,
        theme: "filled"
      });
    };

    _this.setTreeRef = function (node) {
      _this.tree = node;
    };

    _this.renderTree = function (_ref2) {
      var _classNames;

      var getPrefixCls = _ref2.getPrefixCls;

      var _assertThisInitialize = _assertThisInitialized(_this),
          props = _assertThisInitialize.props;

      var customizePrefixCls = props.prefixCls,
          className = props.className,
          showIcon = props.showIcon,
          _switcherIcon = props.switcherIcon,
          blockNode = props.blockNode,
          children = props.children;
      var checkable = props.checkable;
      var prefixCls = getPrefixCls('tree', customizePrefixCls);
      return React.createElement(_rcTree["default"], _extends({
        ref: _this.setTreeRef
      }, props, {
        prefixCls: prefixCls,
        className: (0, _classnames["default"])(className, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-icon-hide"), !showIcon), _defineProperty(_classNames, "".concat(prefixCls, "-block-node"), blockNode), _classNames)),
        checkable: checkable ? React.createElement("span", {
          className: "".concat(prefixCls, "-checkbox-inner")
        }) : checkable,
        switcherIcon: function switcherIcon(nodeProps) {
          return _this.renderSwitcherIcon(prefixCls, _switcherIcon, nodeProps);
        }
      }), children);
    };

    return _this;
  }

  _createClass(Tree, [{
    key: "render",
    value: function render() {
      return React.createElement(_configProvider.ConfigConsumer, null, this.renderTree);
    }
  }]);

  return Tree;
}(React.Component);

exports["default"] = Tree;
Tree.TreeNode = _rcTree.TreeNode;
Tree.DirectoryTree = _DirectoryTree["default"];
Tree.defaultProps = {
  checkable: false,
  showIcon: false,
  motion: _extends(_extends({}, _motion["default"]), {
    motionAppear: false
  }),
  blockNode: false
};
//# sourceMappingURL=Tree.js.map
