'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports['default'] = createRenderWrapper;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function createRenderWrapper(node, context, childContextTypes) {
  var ContextWrapper = function (_React$Component) {
    _inherits(ContextWrapper, _React$Component);

    function ContextWrapper() {
      _classCallCheck(this, ContextWrapper);

      return _possibleConstructorReturn(this, (ContextWrapper.__proto__ || Object.getPrototypeOf(ContextWrapper)).apply(this, arguments));
    }

    _createClass(ContextWrapper, [{
      key: 'getChildContext',
      value: function () {
        function getChildContext() {
          return context;
        }

        return getChildContext;
      }()
    }, {
      key: 'render',
      value: function () {
        function render() {
          return node;
        }

        return render;
      }()
    }]);

    return ContextWrapper;
  }(_react2['default'].Component);

  ContextWrapper.childContextTypes = childContextTypes;
  return ContextWrapper;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jcmVhdGVSZW5kZXJXcmFwcGVyLmpzeCJdLCJuYW1lcyI6WyJjcmVhdGVSZW5kZXJXcmFwcGVyIiwibm9kZSIsImNvbnRleHQiLCJjaGlsZENvbnRleHRUeXBlcyIsIkNvbnRleHRXcmFwcGVyIiwiUmVhY3QiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O3FCQUV3QkEsbUI7O0FBRnhCOzs7Ozs7Ozs7Ozs7QUFFZSxTQUFTQSxtQkFBVCxDQUE2QkMsSUFBN0IsRUFBbUNDLE9BQW5DLEVBQTRDQyxpQkFBNUMsRUFBK0Q7QUFBQSxNQUN0RUMsY0FEc0U7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUEsbUNBRXhEO0FBQ2hCLGlCQUFPRixPQUFQO0FBQ0Q7O0FBSnlFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSwwQkFNakU7QUFDUCxpQkFBT0QsSUFBUDtBQUNEOztBQVJ5RTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxJQUMvQ0ksbUJBQU1DLFNBRHlDOztBQVU1RUYsaUJBQWVELGlCQUFmLEdBQW1DQSxpQkFBbkM7QUFDQSxTQUFPQyxjQUFQO0FBQ0QiLCJmaWxlIjoiY3JlYXRlUmVuZGVyV3JhcHBlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZVJlbmRlcldyYXBwZXIobm9kZSwgY29udGV4dCwgY2hpbGRDb250ZXh0VHlwZXMpIHtcbiAgY2xhc3MgQ29udGV4dFdyYXBwZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGdldENoaWxkQ29udGV4dCgpIHtcbiAgICAgIHJldHVybiBjb250ZXh0O1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgIHJldHVybiBub2RlO1xuICAgIH1cbiAgfVxuICBDb250ZXh0V3JhcHBlci5jaGlsZENvbnRleHRUeXBlcyA9IGNoaWxkQ29udGV4dFR5cGVzO1xuICByZXR1cm4gQ29udGV4dFdyYXBwZXI7XG59XG4iXX0=
//# sourceMappingURL=createRenderWrapper.js.map