"use strict";

require("core-js/modules/es.array.slice");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-own-property-descriptor");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.links = void 0;

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@storybook/react");

var _addonActions = require("@storybook/addon-actions");

var _WithTooltip = require("./WithTooltip");

var _TooltipLinkList = require("./TooltipLinkList");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var onLinkClick = (0, _addonActions.action)('onLinkClick');

var StoryLinkWrapper = function StoryLinkWrapper(_ref) {
  var href = _ref.href,
      passHref = _ref.passHref,
      children = _ref.children;

  var child = _react.Children.only(children);

  return _react["default"].cloneElement(child, {
    href: passHref && href,
    onClick: function onClick(e) {
      e.preventDefault();
      onLinkClick(href);
    }
  });
};

StoryLinkWrapper.defaultProps = {
  passHref: false
};
var links = [{
  id: '1',
  title: 'Link',
  href: 'http://google.com'
}, {
  id: '2',
  title: 'Link',
  href: 'http://google.com'
}, {
  id: '3',
  title: 'callback',
  onClick: (0, _addonActions.action)('onClick')
}];
exports.links = links;

var _ref2 =
/*#__PURE__*/
_react["default"].createElement("div", null, "Tooltip");

var _ref3 =
/*#__PURE__*/
_react["default"].createElement(_TooltipLinkList.TooltipLinkList, {
  links: links,
  LinkWrapper: StoryLinkWrapper
});

(0, _react2.storiesOf)('basics/Tooltip/TooltipLinkList', module).addDecorator(function (storyFn) {
  return _react["default"].createElement("div", {
    style: {
      height: '300px'
    }
  }, _react["default"].createElement(_WithTooltip.WithTooltip, {
    placement: "top",
    trigger: "click",
    startOpen: true,
    tooltip: storyFn()
  }, _ref2));
}).add('links', function () {
  return _react["default"].createElement(_TooltipLinkList.TooltipLinkList, {
    links: links.slice(0, 2),
    LinkWrapper: StoryLinkWrapper
  });
}).add('links and callback', function () {
  return _ref3;
});