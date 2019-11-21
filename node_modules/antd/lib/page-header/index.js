"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

var _classnames2 = _interopRequireDefault(require("classnames"));

var _configProvider = require("../config-provider");

var _icon = _interopRequireDefault(require("../icon"));

var _breadcrumb = _interopRequireDefault(require("../breadcrumb"));

var _avatar = _interopRequireDefault(require("../avatar"));

var _transButton = _interopRequireDefault(require("../_util/transButton"));

var _LocaleReceiver = _interopRequireDefault(require("../locale-provider/LocaleReceiver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var renderBack = function renderBack(prefixCls, backIcon, onBack) {
  if (!backIcon || !onBack) {
    return null;
  }

  return React.createElement(_LocaleReceiver["default"], {
    componentName: "PageHeader"
  }, function (_ref) {
    var back = _ref.back;
    return React.createElement("div", {
      className: "".concat(prefixCls, "-back")
    }, React.createElement(_transButton["default"], {
      onClick: function onClick(e) {
        if (onBack) {
          onBack(e);
        }
      },
      className: "".concat(prefixCls, "-back-button"),
      "aria-label": back
    }, backIcon));
  });
};

var renderBreadcrumb = function renderBreadcrumb(breadcrumb) {
  return React.createElement(_breadcrumb["default"], breadcrumb);
};

var renderTitle = function renderTitle(prefixCls, props) {
  var title = props.title,
      avatar = props.avatar,
      subTitle = props.subTitle,
      tags = props.tags,
      extra = props.extra,
      backIcon = props.backIcon,
      onBack = props.onBack;
  var headingPrefixCls = "".concat(prefixCls, "-heading");

  if (title || subTitle || tags || extra) {
    var backIconDom = renderBack(prefixCls, backIcon, onBack);
    return React.createElement("div", {
      className: headingPrefixCls
    }, backIconDom, avatar && React.createElement(_avatar["default"], avatar), title && React.createElement("span", {
      className: "".concat(headingPrefixCls, "-title")
    }, title), subTitle && React.createElement("span", {
      className: "".concat(headingPrefixCls, "-sub-title")
    }, subTitle), tags && React.createElement("span", {
      className: "".concat(headingPrefixCls, "-tags")
    }, tags), extra && React.createElement("span", {
      className: "".concat(headingPrefixCls, "-extra")
    }, extra));
  }

  return null;
};

var renderFooter = function renderFooter(prefixCls, footer) {
  if (footer) {
    return React.createElement("div", {
      className: "".concat(prefixCls, "-footer")
    }, footer);
  }

  return null;
};

var renderChildren = function renderChildren(prefixCls, children) {
  return React.createElement("div", {
    className: "".concat(prefixCls, "-content")
  }, children);
};

var PageHeader = function PageHeader(props) {
  return React.createElement(_configProvider.ConfigConsumer, null, function (_ref2) {
    var getPrefixCls = _ref2.getPrefixCls,
        pageHeader = _ref2.pageHeader;
    var customizePrefixCls = props.prefixCls,
        style = props.style,
        footer = props.footer,
        children = props.children,
        breadcrumb = props.breadcrumb,
        customizeClassName = props.className;
    var ghost = true; // Use `ghost` from `props` or from `ConfigProvider` instead.

    if ('ghost' in props) {
      ghost = props.ghost;
    } else if (pageHeader && 'ghost' in pageHeader) {
      ghost = pageHeader.ghost;
    }

    var prefixCls = getPrefixCls('page-header', customizePrefixCls);
    var breadcrumbDom = breadcrumb && breadcrumb.routes ? renderBreadcrumb(breadcrumb) : null;
    var className = (0, _classnames2["default"])(prefixCls, customizeClassName, _defineProperty({
      'has-breadcrumb': breadcrumbDom,
      'has-footer': footer
    }, "".concat(prefixCls, "-ghost"), ghost));
    return React.createElement("div", {
      className: className,
      style: style
    }, breadcrumbDom, renderTitle(prefixCls, props), children && renderChildren(prefixCls, children), renderFooter(prefixCls, footer));
  });
};

PageHeader.defaultProps = {
  backIcon: React.createElement(_icon["default"], {
    type: "arrow-left"
  })
};
var _default = PageHeader;
exports["default"] = _default;
//# sourceMappingURL=index.js.map
