'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports['default'] = wrap;

var _object = require('object.assign');

var _object2 = _interopRequireDefault(_object);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _semver = require('semver');

var _airbnbPropTypes = require('airbnb-prop-types');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propTypes = {
  children: (0, _airbnbPropTypes.or)([(0, _airbnbPropTypes.explicitNull)().isRequired, _propTypes2['default'].node.isRequired])
};

var defaultProps = {
  children: undefined
};

var Wrapper = ((0, _semver.intersects)('>= 0.14', _react2['default'].version)
// eslint-disable-next-line prefer-arrow-callback
? function () {
  return (0, _object2['default'])(function () {
    function SimpleSFCWrapper(_ref) {
      var children = _ref.children;

      return children;
    }

    return SimpleSFCWrapper;
  }(), { propTypes: propTypes, defaultProps: defaultProps });
} : function () {
  var SimpleClassWrapper = function (_React$Component) {
    _inherits(SimpleClassWrapper, _React$Component);

    function SimpleClassWrapper() {
      _classCallCheck(this, SimpleClassWrapper);

      return _possibleConstructorReturn(this, (SimpleClassWrapper.__proto__ || Object.getPrototypeOf(SimpleClassWrapper)).apply(this, arguments));
    }

    _createClass(SimpleClassWrapper, [{
      key: 'render',
      value: function () {
        function render() {
          var children = this.props.children;

          return children;
        }

        return render;
      }()
    }]);

    return SimpleClassWrapper;
  }(_react2['default'].Component);

  SimpleClassWrapper.propTypes = propTypes;
  SimpleClassWrapper.defaultProps = defaultProps;
  return SimpleClassWrapper;
})();

function wrap(element) {
  return _react2['default'].createElement(
    Wrapper,
    null,
    element
  );
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93cmFwV2l0aFNpbXBsZVdyYXBwZXIuanN4Il0sIm5hbWVzIjpbIndyYXAiLCJwcm9wVHlwZXMiLCJjaGlsZHJlbiIsImlzUmVxdWlyZWQiLCJQcm9wVHlwZXMiLCJub2RlIiwiZGVmYXVsdFByb3BzIiwidW5kZWZpbmVkIiwiV3JhcHBlciIsIlJlYWN0IiwidmVyc2lvbiIsIlNpbXBsZVNGQ1dyYXBwZXIiLCJTaW1wbGVDbGFzc1dyYXBwZXIiLCJwcm9wcyIsIkNvbXBvbmVudCIsImVsZW1lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O3FCQStCd0JBLEk7Ozs7OztBQS9CeEI7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUMsWUFBWTtBQUNoQkMsWUFBVSx5QkFBRyxDQUFDLHFDQUFlQyxVQUFoQixFQUE0QkMsdUJBQVVDLElBQVYsQ0FBZUYsVUFBM0MsQ0FBSDtBQURNLENBQWxCOztBQUlBLElBQU1HLGVBQWU7QUFDbkJKLFlBQVVLO0FBRFMsQ0FBckI7O0FBSUEsSUFBTUMsVUFBVSxDQUFDLHdCQUFXLFNBQVgsRUFBc0JDLG1CQUFNQyxPQUE1QjtBQUNmO0FBRGUsRUFFYjtBQUFBLFNBQU07QUFBYyxhQUFTQyxnQkFBVCxPQUF3QztBQUFBLFVBQVpULFFBQVksUUFBWkEsUUFBWTs7QUFDNUQsYUFBT0EsUUFBUDtBQUNEOztBQUZPLFdBQXVCUyxnQkFBdkI7QUFBQSxPQUVMLEVBQUVWLG9CQUFGLEVBQWFLLDBCQUFiLEVBRkssQ0FBTjtBQUFBLENBRmEsR0FLYixZQUFNO0FBQUEsTUFDQU0sa0JBREE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUEsMEJBRUs7QUFBQSxjQUNDVixRQURELEdBQ2MsS0FBS1csS0FEbkIsQ0FDQ1gsUUFERDs7QUFFUCxpQkFBT0EsUUFBUDtBQUNEOztBQUxHO0FBQUE7QUFBQTs7QUFBQTtBQUFBLElBQzJCTyxtQkFBTUssU0FEakM7O0FBT05GLHFCQUFtQlgsU0FBbkIsR0FBK0JBLFNBQS9CO0FBQ0FXLHFCQUFtQk4sWUFBbkIsR0FBa0NBLFlBQWxDO0FBQ0EsU0FBT00sa0JBQVA7QUFDRCxDQWZhLEdBQWhCOztBQWtCZSxTQUFTWixJQUFULENBQWNlLE9BQWQsRUFBdUI7QUFDcEMsU0FBTztBQUFDLFdBQUQ7QUFBQTtBQUFVQTtBQUFWLEdBQVA7QUFDRCIsImZpbGUiOiJ3cmFwV2l0aFNpbXBsZVdyYXBwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgaW50ZXJzZWN0cyB9IGZyb20gJ3NlbXZlcic7XG5pbXBvcnQgeyBvciwgZXhwbGljaXROdWxsIH0gZnJvbSAnYWlyYm5iLXByb3AtdHlwZXMnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBjaGlsZHJlbjogb3IoW2V4cGxpY2l0TnVsbCgpLmlzUmVxdWlyZWQsIFByb3BUeXBlcy5ub2RlLmlzUmVxdWlyZWRdKSxcbn07XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgY2hpbGRyZW46IHVuZGVmaW5lZCxcbn07XG5cbmNvbnN0IFdyYXBwZXIgPSAoaW50ZXJzZWN0cygnPj0gMC4xNCcsIFJlYWN0LnZlcnNpb24pXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItYXJyb3ctY2FsbGJhY2tcbiAgPyAoKSA9PiBPYmplY3QuYXNzaWduKGZ1bmN0aW9uIFNpbXBsZVNGQ1dyYXBwZXIoeyBjaGlsZHJlbiB9KSB7XG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9LCB7IHByb3BUeXBlcywgZGVmYXVsdFByb3BzIH0pXG4gIDogKCkgPT4ge1xuICAgIGNsYXNzIFNpbXBsZUNsYXNzV3JhcHBlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHsgY2hpbGRyZW4gfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIHJldHVybiBjaGlsZHJlbjtcbiAgICAgIH1cbiAgICB9XG4gICAgU2ltcGxlQ2xhc3NXcmFwcGVyLnByb3BUeXBlcyA9IHByb3BUeXBlcztcbiAgICBTaW1wbGVDbGFzc1dyYXBwZXIuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuICAgIHJldHVybiBTaW1wbGVDbGFzc1dyYXBwZXI7XG4gIH1cbikoKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gd3JhcChlbGVtZW50KSB7XG4gIHJldHVybiA8V3JhcHBlcj57ZWxlbWVudH08L1dyYXBwZXI+O1xufVxuIl19
//# sourceMappingURL=wrapWithSimpleWrapper.js.map