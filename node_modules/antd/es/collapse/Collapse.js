function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import * as React from 'react';
import RcCollapse from 'rc-collapse';
import classNames from 'classnames';
import CollapsePanel from './CollapsePanel';
import Icon from '../icon';
import { ConfigConsumer } from '../config-provider';
import animation from '../_util/openAnimation';

var Collapse =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Collapse, _React$Component);

  function Collapse() {
    var _this;

    _classCallCheck(this, Collapse);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Collapse).apply(this, arguments));

    _this.renderExpandIcon = function () {
      var panelProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var prefixCls = arguments.length > 1 ? arguments[1] : undefined;
      var expandIcon = _this.props.expandIcon;
      var icon = expandIcon ? expandIcon(panelProps) : React.createElement(Icon, {
        type: "right",
        rotate: panelProps.isActive ? 90 : undefined
      });
      return React.isValidElement(icon) ? React.cloneElement(icon, {
        className: classNames(icon.props.className, "".concat(prefixCls, "-arrow"))
      }) : icon;
    };

    _this.renderCollapse = function (_ref) {
      var _classNames;

      var getPrefixCls = _ref.getPrefixCls;
      var _this$props = _this.props,
          customizePrefixCls = _this$props.prefixCls,
          _this$props$className = _this$props.className,
          className = _this$props$className === void 0 ? '' : _this$props$className,
          bordered = _this$props.bordered,
          expandIconPosition = _this$props.expandIconPosition;
      var prefixCls = getPrefixCls('collapse', customizePrefixCls);
      var collapseClassName = classNames((_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-borderless"), !bordered), _defineProperty(_classNames, "".concat(prefixCls, "-icon-position-").concat(expandIconPosition), true), _classNames), className);
      return React.createElement(RcCollapse, _extends({}, _this.props, {
        expandIcon: function expandIcon(panelProps) {
          return _this.renderExpandIcon(panelProps, prefixCls);
        },
        prefixCls: prefixCls,
        className: collapseClassName
      }));
    };

    return _this;
  }

  _createClass(Collapse, [{
    key: "render",
    value: function render() {
      return React.createElement(ConfigConsumer, null, this.renderCollapse);
    }
  }]);

  return Collapse;
}(React.Component);

export { Collapse as default };
Collapse.Panel = CollapsePanel;
Collapse.defaultProps = {
  bordered: true,
  openAnimation: _extends(_extends({}, animation), {
    appear: function appear() {}
  }),
  expandIconPosition: 'left'
};
//# sourceMappingURL=Collapse.js.map
