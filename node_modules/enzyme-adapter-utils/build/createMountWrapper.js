'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports['default'] = createMountWrapper;

var _object = require('object.assign');

var _object2 = _interopRequireDefault(_object);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _airbnbPropTypes = require('airbnb-prop-types');

var _RootFinder = require('./RootFinder');

var _RootFinder2 = _interopRequireDefault(_RootFinder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint react/forbid-prop-types: 0 */

var stringOrFunction = _propTypes2['default'].oneOfType([_propTypes2['default'].func, _propTypes2['default'].string]);
var makeValidElementType = function makeValidElementType(adapter) {
  if (!adapter) {
    return stringOrFunction;
  }

  function validElementType(props, propName) {
    if (!adapter.isValidElementType) {
      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      return stringOrFunction.apply(undefined, [props, propName].concat(args));
    }
    var propValue = props[propName];
    if (propValue == null || adapter.isValidElementType(propValue)) {
      return null;
    }
    return new TypeError(String(propName) + ' must be a valid element type!');
  }
  validElementType.isRequired = function () {
    function validElementTypeRequired(props, propName) {
      if (!adapter.isValidElementType) {
        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          args[_key2 - 2] = arguments[_key2];
        }

        return stringOrFunction.isRequired.apply(stringOrFunction, [props, propName].concat(args));
      }
      var propValue = props[propName]; // eslint-disable-line react/destructuring-assignment
      if (adapter.isValidElementType(propValue)) {
        return null;
      }
      return new TypeError(String(propName) + ' must be a valid element type!');
    }

    return validElementTypeRequired;
  }();
  return validElementType;
};

/**
 * This is a utility component to wrap around the nodes we are
 * passing in to `mount()`. Theoretically, you could do everything
 * we are doing without this, but this makes it easier since
 * `renderIntoDocument()` doesn't really pass back a reference to
 * the DOM node it rendered to, so we can't really "re-render" to
 * pass new props in.
 */
function createMountWrapper(node) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var adapter = options.adapter,
      WrappingComponent = options.wrappingComponent;

  var WrapperComponent = function (_React$Component) {
    _inherits(WrapperComponent, _React$Component);

    function WrapperComponent() {
      var _ref;

      _classCallCheck(this, WrapperComponent);

      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      var _this = _possibleConstructorReturn(this, (_ref = WrapperComponent.__proto__ || Object.getPrototypeOf(WrapperComponent)).call.apply(_ref, [this].concat(args)));

      var _this$props = _this.props,
          props = _this$props.props,
          wrappingComponentProps = _this$props.wrappingComponentProps,
          context = _this$props.context;

      _this.state = {
        mount: true,
        props: props,
        wrappingComponentProps: wrappingComponentProps,
        context: context
      };
      return _this;
    }

    _createClass(WrapperComponent, [{
      key: 'setChildProps',
      value: function () {
        function setChildProps(newProps, newContext) {
          var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
          var _state = this.state,
              oldProps = _state.props,
              oldContext = _state.context;

          var props = (0, _object2['default'])({}, oldProps, newProps);
          var context = (0, _object2['default'])({}, oldContext, newContext);
          this.setState({ props: props, context: context }, callback);
        }

        return setChildProps;
      }()
    }, {
      key: 'setWrappingComponentProps',
      value: function () {
        function setWrappingComponentProps(props) {
          var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

          this.setState({ wrappingComponentProps: props }, callback);
        }

        return setWrappingComponentProps;
      }()
    }, {
      key: 'render',
      value: function () {
        function render() {
          var _props = this.props,
              Component = _props.Component,
              refProp = _props.refProp;
          var _state2 = this.state,
              mount = _state2.mount,
              props = _state2.props,
              wrappingComponentProps = _state2.wrappingComponentProps;

          if (!mount) return null;
          // eslint-disable-next-line react/jsx-props-no-spreading
          var component = _react2['default'].createElement(Component, _extends({ ref: refProp }, props));
          if (WrappingComponent) {
            return (
              // eslint-disable-next-line react/jsx-props-no-spreading
              _react2['default'].createElement(
                WrappingComponent,
                wrappingComponentProps,
                _react2['default'].createElement(
                  _RootFinder2['default'],
                  null,
                  component
                )
              )
            );
          }
          return component;
        }

        return render;
      }()
    }]);

    return WrapperComponent;
  }(_react2['default'].Component);

  WrapperComponent.propTypes = {
    Component: makeValidElementType(adapter).isRequired,
    refProp: _propTypes2['default'].oneOfType([_propTypes2['default'].string, (0, _airbnbPropTypes.ref)()]),
    props: _propTypes2['default'].object.isRequired,
    wrappingComponentProps: _propTypes2['default'].object,
    context: _propTypes2['default'].object
  };
  WrapperComponent.defaultProps = {
    refProp: null,
    context: null,
    wrappingComponentProps: null
  };

  if (options.context && (node.type.contextTypes || options.childContextTypes)) {
    // For full rendering, we are using this wrapper component to provide context if it is
    // specified in both the options AND the child component defines `contextTypes` statically
    // OR the merged context types for all children (the node component or deeper children) are
    // specified in options parameter under childContextTypes.
    // In that case, we define both a `getChildContext()` function and a `childContextTypes` prop.
    var childContextTypes = (0, _object2['default'])({}, node.type.contextTypes, options.childContextTypes);

    WrapperComponent.prototype.getChildContext = function () {
      function getChildContext() {
        return this.state.context;
      }

      return getChildContext;
    }();
    WrapperComponent.childContextTypes = childContextTypes;
  }
  return WrapperComponent;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jcmVhdGVNb3VudFdyYXBwZXIuanN4Il0sIm5hbWVzIjpbImNyZWF0ZU1vdW50V3JhcHBlciIsInN0cmluZ09yRnVuY3Rpb24iLCJQcm9wVHlwZXMiLCJvbmVPZlR5cGUiLCJmdW5jIiwic3RyaW5nIiwibWFrZVZhbGlkRWxlbWVudFR5cGUiLCJhZGFwdGVyIiwidmFsaWRFbGVtZW50VHlwZSIsInByb3BzIiwicHJvcE5hbWUiLCJpc1ZhbGlkRWxlbWVudFR5cGUiLCJhcmdzIiwicHJvcFZhbHVlIiwiVHlwZUVycm9yIiwiaXNSZXF1aXJlZCIsInZhbGlkRWxlbWVudFR5cGVSZXF1aXJlZCIsIm5vZGUiLCJvcHRpb25zIiwiV3JhcHBpbmdDb21wb25lbnQiLCJ3cmFwcGluZ0NvbXBvbmVudCIsIldyYXBwZXJDb21wb25lbnQiLCJ3cmFwcGluZ0NvbXBvbmVudFByb3BzIiwiY29udGV4dCIsInN0YXRlIiwibW91bnQiLCJuZXdQcm9wcyIsIm5ld0NvbnRleHQiLCJjYWxsYmFjayIsInVuZGVmaW5lZCIsIm9sZFByb3BzIiwib2xkQ29udGV4dCIsInNldFN0YXRlIiwiQ29tcG9uZW50IiwicmVmUHJvcCIsImNvbXBvbmVudCIsIlJlYWN0IiwicHJvcFR5cGVzIiwib2JqZWN0IiwiZGVmYXVsdFByb3BzIiwidHlwZSIsImNvbnRleHRUeXBlcyIsImNoaWxkQ29udGV4dFR5cGVzIiwicHJvdG90eXBlIiwiZ2V0Q2hpbGRDb250ZXh0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3FCQTRDd0JBLGtCOzs7Ozs7QUE1Q3hCOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUE7O0FBRUEsSUFBTUMsbUJBQW1CQyx1QkFBVUMsU0FBVixDQUFvQixDQUFDRCx1QkFBVUUsSUFBWCxFQUFpQkYsdUJBQVVHLE1BQTNCLENBQXBCLENBQXpCO0FBQ0EsSUFBTUMsdUJBQXVCLFNBQXZCQSxvQkFBdUIsQ0FBQ0MsT0FBRCxFQUFhO0FBQ3hDLE1BQUks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RTtBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTUEsaURBQ0R6QixLQUFLdUIsSUFBTCxDQUFVQyxZQURULEVBRUR2QixRQUFRd0IsaUJBRlAsQ0FBTjs7QUFLQXJCLHFCQUFpQnNCLFNBQWpCLENBQTJCQyxlQUEzQjtBQUE2QyxlQUFTQSxlQUFULEdBQTJCO0FBQ3RFLGVBQU8sS0FBS3BCLEtBQUwsQ0FBV0QsT0FBbEI7QUFDRDs7QUFGRCxhQUFzRHFCLGVBQXREO0FBQUE7QUFHQXZCLHFCQUFpQnFCLGlCQUFqQixHQUFxQ0EsaUJBQXJDO0FBQ0Q7QUFDRCxTQUFPckIsZ0JBQVA7QUFDRCIsImZpbGUiOiJjcmVhdGVNb3VudFdyYXBwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7IHJlZiB9IGZyb20gJ2FpcmJuYi1wcm9wLXR5cGVzJztcbmltcG9ydCBSb290RmluZGVyIGZyb20gJy4vUm9vdEZpbmRlcic7XG5cbi8qIGVzbGludCByZWFjdC9mb3JiaWQtcHJvcC10eXBlczogMCAqL1xuXG5jb25zdCBzdHJpbmdPckZ1bmN0aW9uID0gUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLmZ1bmMsIFByb3BUeXBlcy5zdHJpbmddKTtcbmNvbnN0IG1ha2VWYWxpZEVsZW1lbnRUeXBlID0gKGFkYXB0ZXIpID0+IHtcbiAgaWYgKCFhZGFwdGVyKSB7XG4gICAgcmV0dXJuIHN0cmluZ09yRnVuY3Rpb247XG4gIH1cblxuICBmdW5jdGlvbiB2YWxpZEVsZW1lbnRUeXBlKHByb3BzLCBwcm9wTmFtZSwgLi4uYXJncykge1xuICAgIGlmICghYWRhcHRlci5pc1ZhbGlkRWxlbWVudFR5cGUpIHtcbiAgICAgIHJldHVybiBzdHJpbmdPckZ1bmN0aW9uKHByb3BzLCBwcm9wTmFtZSwgLi4uYXJncyk7XG4gICAgfVxuICAgIGNvbnN0IHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICBpZiAocHJvcFZhbHVlID09IG51bGwgfHwgYWRhcHRlci5pc1ZhbGlkRWxlbWVudFR5cGUocHJvcFZhbHVlKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBuZXcgVHlwZUVycm9yKGAke3Byb3BOYW1lfSBtdXN0IGJlIGEgdmFsaWQgZWxlbWVudCB0eXBlIWApO1xuICB9XG4gIHZhbGlkRWxlbWVudFR5cGUuaXNSZXF1aXJlZCA9IGZ1bmN0aW9uIHZhbGlkRWxlbWVudFR5cGVSZXF1aXJlZChwcm9wcywgcHJvcE5hbWUsIC4uLmFyZ3MpIHtcbiAgICBpZiAoIWFkYXB0ZXIuaXNWYWxpZEVsZW1lbnRUeXBlKSB7XG4gICAgICByZXR1cm4gc3RyaW5nT3JGdW5jdGlvbi5pc1JlcXVpcmVkKHByb3BzLCBwcm9wTmFtZSwgLi4uYXJncyk7XG4gICAgfVxuICAgIGNvbnN0IHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSByZWFjdC9kZXN0cnVjdHVyaW5nLWFzc2lnbm1lbnRcbiAgICBpZiAoYWRhcHRlci5pc1ZhbGlkRWxlbWVudFR5cGUocHJvcFZhbHVlKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBuZXcgVHlwZUVycm9yKGAke3Byb3BOYW1lfSBtdXN0IGJlIGEgdmFsaWQgZWxlbWVudCB0eXBlIWApO1xuICB9O1xuICByZXR1cm4gdmFsaWRFbGVtZW50VHlwZTtcbn07XG5cbi8qKlxuICogVGhpcyBpcyBhIHV0aWxpdHkgY29tcG9uZW50IHRvIHdyYXAgYXJvdW5kIHRoZSBub2RlcyB3ZSBhcmVcbiAqIHBhc3NpbmcgaW4gdG8gYG1vdW50KClgLiBUaGVvcmV0aWNhbGx5LCB5b3UgY291bGQgZG8gZXZlcnl0aGluZ1xuICogd2UgYXJlIGRvaW5nIHdpdGhvdXQgdGhpcywgYnV0IHRoaXMgbWFrZXMgaXQgZWFzaWVyIHNpbmNlXG4gKiBgcmVuZGVySW50b0RvY3VtZW50KClgIGRvZXNuJ3QgcmVhbGx5IHBhc3MgYmFjayBhIHJlZmVyZW5jZSB0b1xuICogdGhlIERPTSBub2RlIGl0IHJlbmRlcmVkIHRvLCBzbyB3ZSBjYW4ndCByZWFsbHkgXCJyZS1yZW5kZXJcIiB0b1xuICogcGFzcyBuZXcgcHJvcHMgaW4uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZU1vdW50V3JhcHBlcihub2RlLCBvcHRpb25zID0ge30pIHtcbiAgY29uc3QgeyBhZGFwdGVyLCB3cmFwcGluZ0NvbXBvbmVudDogV3JhcHBpbmdDb21wb25lbnQgfSA9IG9wdGlvbnM7XG5cbiAgY2xhc3MgV3JhcHBlckNvbXBvbmVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgICAgc3VwZXIoLi4uYXJncyk7XG4gICAgICBjb25zdCB7IHByb3BzLCB3cmFwcGluZ0NvbXBvbmVudFByb3BzLCBjb250ZXh0IH0gPSB0aGlzLnByb3BzO1xuICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgbW91bnQ6IHRydWUsXG4gICAgICAgIHByb3BzLFxuICAgICAgICB3cmFwcGluZ0NvbXBvbmVudFByb3BzLFxuICAgICAgICBjb250ZXh0LFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBzZXRDaGlsZFByb3BzKG5ld1Byb3BzLCBuZXdDb250ZXh0LCBjYWxsYmFjayA9IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgeyBwcm9wczogb2xkUHJvcHMsIGNvbnRleHQ6IG9sZENvbnRleHQgfSA9IHRoaXMuc3RhdGU7XG4gICAgICBjb25zdCBwcm9wcyA9IHsgLi4ub2xkUHJvcHMsIC4uLm5ld1Byb3BzIH07XG4gICAgICBjb25zdCBjb250ZXh0ID0geyAuLi5vbGRDb250ZXh0LCAuLi5uZXdDb250ZXh0IH07XG4gICAgICB0aGlzLnNldFN0YXRlKHsgcHJvcHMsIGNvbnRleHQgfSwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHNldFdyYXBwaW5nQ29tcG9uZW50UHJvcHMocHJvcHMsIGNhbGxiYWNrID0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgd3JhcHBpbmdDb21wb25lbnRQcm9wczogcHJvcHMgfSwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHsgQ29tcG9uZW50LCByZWZQcm9wIH0gPSB0aGlzLnByb3BzO1xuICAgICAgY29uc3QgeyBtb3VudCwgcHJvcHMsIHdyYXBwaW5nQ29tcG9uZW50UHJvcHMgfSA9IHRoaXMuc3RhdGU7XG4gICAgICBpZiAoIW1vdW50KSByZXR1cm4gbnVsbDtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC9qc3gtcHJvcHMtbm8tc3ByZWFkaW5nXG4gICAgICBjb25zdCBjb21wb25lbnQgPSA8Q29tcG9uZW50IHJlZj17cmVmUHJvcH0gey4uLnByb3BzfSAvPjtcbiAgICAgIGlmIChXcmFwcGluZ0NvbXBvbmVudCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC9qc3gtcHJvcHMtbm8tc3ByZWFkaW5nXG4gICAgICAgICAgPFdyYXBwaW5nQ29tcG9uZW50IHsuLi53cmFwcGluZ0NvbXBvbmVudFByb3BzfT5cbiAgICAgICAgICAgIDxSb290RmluZGVyPntjb21wb25lbnR9PC9Sb290RmluZGVyPlxuICAgICAgICAgIDwvV3JhcHBpbmdDb21wb25lbnQ+XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29tcG9uZW50O1xuICAgIH1cbiAgfVxuICBXcmFwcGVyQ29tcG9uZW50LnByb3BUeXBlcyA9IHtcbiAgICBDb21wb25lbnQ6IG1ha2VWYWxpZEVsZW1lbnRUeXBlKGFkYXB0ZXIpLmlzUmVxdWlyZWQsXG4gICAgcmVmUHJvcDogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLnN0cmluZywgcmVmKCldKSxcbiAgICBwcm9wczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHdyYXBwaW5nQ29tcG9uZW50UHJvcHM6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgY29udGV4dDogUHJvcFR5cGVzLm9iamVjdCxcbiAgfTtcbiAgV3JhcHBlckNvbXBvbmVudC5kZWZhdWx0UHJvcHMgPSB7XG4gICAgcmVmUHJvcDogbnVsbCxcbiAgICBjb250ZXh0OiBudWxsLFxuICAgIHdyYXBwaW5nQ29tcG9uZW50UHJvcHM6IG51bGwsXG4gIH07XG5cbiAgaWYgKG9wdGlvbnMuY29udGV4dCAmJiAobm9kZS50eXBlLmNvbnRleHRUeXBlcyB8fCBvcHRpb25zLmNoaWxkQ29udGV4dFR5cGVzKSkge1xuICAgIC8vIEZvciBmdWxsIHJlbmRlcmluZywgd2UgYXJlIHVzaW5nIHRoaXMgd3JhcHBlciBjb21wb25lbnQgdG8gcHJvdmlkZSBjb250ZXh0IGlmIGl0IGlzXG4gICAgLy8gc3BlY2lmaWVkIGluIGJvdGggdGhlIG9wdGlvbnMgQU5EIHRoZSBjaGlsZCBjb21wb25lbnQgZGVmaW5lcyBgY29udGV4dFR5cGVzYCBzdGF0aWNhbGx5XG4gICAgLy8gT1IgdGhlIG1lcmdlZCBjb250ZXh0IHR5cGVzIGZvciBhbGwgY2hpbGRyZW4gKHRoZSBub2RlIGNvbXBvbmVudCBvciBkZWVwZXIgY2hpbGRyZW4pIGFyZVxuICAgIC8vIHNwZWNpZmllZCBpbiBvcHRpb25zIHBhcmFtZXRlciB1bmRlciBjaGlsZENvbnRleHRUeXBlcy5cbiAgICAvLyBJbiB0aGF0IGNhc2UsIHdlIGRlZmluZSBib3RoIGEgYGdldENoaWxkQ29udGV4dCgpYCBmdW5jdGlvbiBhbmQgYSBgY2hpbGRDb250ZXh0VHlwZXNgIHByb3AuXG4gICAgY29uc3QgY2hpbGRDb250ZXh0VHlwZXMgPSB7XG4gICAgICAuLi5ub2RlLnR5cGUuY29udGV4dFR5cGVzLFxuICAgICAgLi4ub3B0aW9ucy5jaGlsZENvbnRleHRUeXBlcyxcbiAgICB9O1xuXG4gICAgV3JhcHBlckNvbXBvbmVudC5wcm90b3R5cGUuZ2V0Q2hpbGRDb250ZXh0ID0gZnVuY3Rpb24gZ2V0Q2hpbGRDb250ZXh0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RhdGUuY29udGV4dDtcbiAgICB9O1xuICAgIFdyYXBwZXJDb21wb25lbnQuY2hpbGRDb250ZXh0VHlwZXMgPSBjaGlsZENvbnRleHRUeXBlcztcbiAgfVxuICByZXR1cm4gV3JhcHBlckNvbXBvbmVudDtcbn1cbiJdfQ==
//# sourceMappingURL=createMountWrapper.js.map