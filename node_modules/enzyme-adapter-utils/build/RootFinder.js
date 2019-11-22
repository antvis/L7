'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RootFinder = function (_React$Component) {
  _inherits(RootFinder, _React$Component);

  function RootFinder() {
    _classCallCheck(this, RootFinder);

    return _possibleConstructorReturn(this, (RootFinder.__proto__ || Object.getPrototypeOf(RootFinder)).apply(this, arguments));
  }

  _createClass(RootFinder, [{
    key: 'render',
    value: function () {
      function render() {
        var children = this.props.children;

        return children;
      }

      return render;
    }()
  }]);

  return RootFinder;
}(_react2['default'].Component);

exports['default'] = RootFinder;

RootFinder.propTypes = {
  children: _propTypes2['default'].node
};
RootFinder.defaultProps = {
  children: null
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Sb290RmluZGVyLmpzeCJdLCJuYW1lcyI6WyJSb290RmluZGVyIiwiY2hpbGRyZW4iLCJwcm9wcyIsIlJlYWN0IiwiQ29tcG9uZW50IiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwibm9kZSIsImRlZmF1bHRQcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFcUJBLFU7Ozs7Ozs7Ozs7Ozt3QkFDVjtBQUFBLFlBQ0NDLFFBREQsR0FDYyxLQUFLQyxLQURuQixDQUNDRCxRQUREOztBQUVQLGVBQU9BLFFBQVA7QUFDRDs7Ozs7OztFQUpxQ0UsbUJBQU1DLFM7O3FCQUF6QkosVTs7QUFNckJBLFdBQVdLLFNBQVgsR0FBdUI7QUFDckJKLFlBQVVLLHVCQUFVQztBQURDLENBQXZCO0FBR0FQLFdBQVdRLFlBQVgsR0FBMEI7QUFDeEJQLFlBQVU7QUFEYyxDQUExQiIsImZpbGUiOiJSb290RmluZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJvb3RGaW5kZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBjaGlsZHJlbiB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH1cbn1cblJvb3RGaW5kZXIucHJvcFR5cGVzID0ge1xuICBjaGlsZHJlbjogUHJvcFR5cGVzLm5vZGUsXG59O1xuUm9vdEZpbmRlci5kZWZhdWx0UHJvcHMgPSB7XG4gIGNoaWxkcmVuOiBudWxsLFxufTtcbiJdfQ==
//# sourceMappingURL=RootFinder.js.map