'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _enzymeAdapterUtils = require('enzyme-adapter-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function getFiber(element) {
  var container = global.document.createElement('div');
  var inst = null;

  var Tester = function (_React$Component) {
    _inherits(Tester, _React$Component);

    function Tester() {
      _classCallCheck(this, Tester);

      return _possibleConstructorReturn(this, (Tester.__proto__ || Object.getPrototypeOf(Tester)).apply(this, arguments));
    }

    _createClass(Tester, [{
      key: 'render',
      value: function () {
        function render() {
          inst = this;
          return element;
        }

        return render;
      }()
    }]);

    return Tester;
  }(_react2['default'].Component);

  _reactDom2['default'].render(_react2['default'].createElement(Tester), container);
  return inst._reactInternalFiber.child;
}

function getLazyFiber(LazyComponent) {
  var container = global.document.createElement('div');
  var inst = null;
  // eslint-disable-next-line react/prefer-stateless-function

  var Tester = function (_React$Component2) {
    _inherits(Tester, _React$Component2);

    function Tester() {
      _classCallCheck(this, Tester);

      return _possibleConstructorReturn(this, (Tester.__proto__ || Object.getPrototypeOf(Tester)).apply(this, arguments));
    }

    _createClass(Tester, [{
      key: 'render',
      value: function () {
        function render() {
          inst = this;
          return _react2['default'].createElement(LazyComponent);
        }

        return render;
      }()
    }]);

    return Tester;
  }(_react2['default'].Component);
  // eslint-disable-next-line react/prefer-stateless-function


  var SuspenseWrapper = function (_React$Component3) {
    _inherits(SuspenseWrapper, _React$Component3);

    function SuspenseWrapper() {
      _classCallCheck(this, SuspenseWrapper);

      return _possibleConstructorReturn(this, (SuspenseWrapper.__proto__ || Object.getPrototypeOf(SuspenseWrapper)).apply(this, arguments));
    }

    _createClass(SuspenseWrapper, [{
      key: 'render',
      value: function () {
        function render() {
          return _react2['default'].createElement(_react2['default'].Suspense, { fallback: false }, _react2['default'].createElement(Tester));
        }

        return render;
      }()
    }]);

    return SuspenseWrapper;
  }(_react2['default'].Component);

  _reactDom2['default'].render(_react2['default'].createElement(SuspenseWrapper), container);
  return inst._reactInternalFiber.child;
}

module.exports = function () {
  function detectFiberTags() {
    var supportsMode = typeof _react2['default'].StrictMode !== 'undefined';
    var supportsContext = typeof _react2['default'].createContext !== 'undefined';
    var supportsForwardRef = typeof _react2['default'].forwardRef !== 'undefined';
    var supportsMemo = typeof _react2['default'].memo !== 'undefined';
    var supportsProfiler = typeof _react2['default'].unstable_Profiler !== 'undefined' || typeof _react2['default'].Profiler !== 'undefined';
    var supportsSuspense = typeof _react2['default'].Suspense !== 'undefined';
    var supportsLazy = typeof _react2['default'].lazy !== 'undefined';

    function Fn() {
      return null;
    }
    // eslint-disable-next-line react/prefer-stateless-function

    var Cls = function (_React$Component4) {
      _inherits(Cls, _React$Component4);

      function Cls() {
        _classCallCheck(this, Cls);

        return _possibleConstructorReturn(this, (Cls.__proto__ || Object.getPrototypeOf(Cls)).apply(this, arguments));
      }

      _createClass(Cls, [{
        key: 'render',
        value: function () {
          function render() {
            return null;
          }

          return render;
        }()
      }]);

      return Cls;
    }(_react2['default'].Component);

    var Ctx = null;
    var FwdRef = null;
    var LazyComponent = null;
    if (supportsContext) {
      Ctx = _react2['default'].createContext();
    }
    if (supportsForwardRef) {
      // React will warn if we don't have both arguments.
      // eslint-disable-next-line no-unused-vars
      FwdRef = _react2['default'].forwardRef(function (props, ref) {
        return null;
      });
    }
    if (supportsLazy) {
      LazyComponent = _react2['default'].lazy(function () {
        return (0, _enzymeAdapterUtils.fakeDynamicImport)(function () {
          return null;
        });
      });
    }

    return {
      HostRoot: getFiber('test')['return']['return'].tag, // Go two levels above to find the root
      ClassComponent: getFiber(_react2['default'].createElement(Cls)).tag,
      Fragment: getFiber([['nested']]).tag,
      FunctionalComponent: getFiber(_react2['default'].createElement(Fn)).tag,
      MemoSFC: supportsMemo ? getFiber(_react2['default'].createElement(_react2['default'].memo(Fn))).tag : -1,
      MemoClass: supportsMemo ? getFiber(_react2['default'].createElement(_react2['default'].memo(Cls))).tag : -1,
      HostPortal: getFiber(_reactDom2['default'].createPortal(null, global.document.createElement('div'))).tag,
      HostComponent: getFiber(_react2['default'].createElement('span')).tag,
      HostText: getFiber('text').tag,
      Mode: supportsMode ? getFiber(_react2['default'].createElement(_react2['default'].StrictMode)).tag : -1,
      ContextConsumer: supportsContext ? getFiber(_react2['default'].createElement(Ctx.Consumer, null, function () {
        return null;
      })).tag : -1,
      ContextProvider: supportsContext ? getFiber(_react2['default'].createElement(Ctx.Provider, { value: null }, null)).tag : -1,
      ForwardRef: supportsForwardRef ? getFiber(_react2['default'].createElement(FwdRef)).tag : -1,
      Profiler: supportsProfiler ? getFiber(_react2['default'].createElement(_react2['default'].Profiler || _react2['default'].unstable_Profiler, { id: 'mock', onRender: function () {
          function onRender() {}

          return onRender;
        }()
      })).tag : -1,
      Suspense: supportsSuspense ? getFiber(_react2['default'].createElement(_react2['default'].Suspense, { fallback: false })).tag : -1,
      Lazy: supportsLazy ? getLazyFiber(LazyComponent).tag : -1
    };
  }

  return detectFiberTags;
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kZXRlY3RGaWJlclRhZ3MuanMiXSwibmFtZXMiOlsiZ2V0RmliZXIiLCJlbGVtZW50IiwiY29udGFpbmVyIiwiZ2xvYmFsIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaW5zdCIsIlRlc3RlciIsIlJlYWN0IiwiQ29tcG9uZW50IiwiUmVhY3RET00iLCJyZW5kZXIiLCJfcmVhY3RJbnRlcm5hbEZpYmVyIiwiY2hpbGQiLCJnZXRMYXp5RmliZXIiLCJMYXp5Q29tcG9uZW50IiwiU3VzcGVuc2VXcmFwcGVyIiwiU3VzcGVuc2UiLCJmYWxsYmFjayIsIm1vZHVsZSIsImV4cG9ydHMiLCJkZXRlY3RGaWJlclRhZ3MiLCJzdXBwb3J0c01vZGUiLCJTdHJpY3RNb2RlIiwic3VwcG9ydHNDb250ZXh0IiwiY3JlYXRlQ29udGV4dCIsInN1cHBvcnRzRm9yd2FyZFJlZiIsImZvcndhcmRSZWYiLCJzdXBwb3J0c01lbW8iLCJtZW1vIiwic3VwcG9ydHNQcm9maWxlciIsInVuc3RhYmxlX1Byb2ZpbGVyIiwiUHJvZmlsZXIiLCJzdXBwb3J0c1N1c3BlbnNlIiwic3VwcG9ydHNMYXp5IiwibGF6eSIsIkZuIiwiQ2xzIiwiQ3R4IiwiRndkUmVmIiwicHJvcHMiLCJyZWYiLCJIb3N0Um9vdCIsInRhZyIsIkNsYXNzQ29tcG9uZW50IiwiRnJhZ21lbnQiLCJGdW5jdGlvbmFsQ29tcG9uZW50IiwiTWVtb1NGQyIsIk1lbW9DbGFzcyIsIkhvc3RQb3J0YWwiLCJjcmVhdGVQb3J0YWwiLCJIb3N0Q29tcG9uZW50IiwiSG9zdFRleHQiLCJNb2RlIiwiQ29udGV4dENvbnN1bWVyIiwiQ29uc3VtZXIiLCJDb250ZXh0UHJvdmlkZXIiLCJQcm92aWRlciIsInZhbHVlIiwiRm9yd2FyZFJlZiIsImlkIiwib25SZW5kZXIiLCJMYXp5Il0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7O0FBRUEsU0FBU0EsUUFBVCxDQUFrQkMsT0FB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cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB7IGZha2VEeW5hbWljSW1wb3J0IH0gZnJvbSAnZW56eW1lLWFkYXB0ZXItdXRpbHMnO1xuXG5mdW5jdGlvbiBnZXRGaWJlcihlbGVtZW50KSB7XG4gIGNvbnN0IGNvbnRhaW5lciA9IGdsb2JhbC5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgbGV0IGluc3QgPSBudWxsO1xuICBjbGFzcyBUZXN0ZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIHJlbmRlcigpIHtcbiAgICAgIGluc3QgPSB0aGlzO1xuICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfVxuICB9XG4gIFJlYWN0RE9NLnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KFRlc3RlciksIGNvbnRhaW5lcik7XG4gIHJldHVybiBpbnN0Ll9yZWFjdEludGVybmFsRmliZXIuY2hpbGQ7XG59XG5cbmZ1bmN0aW9uIGdldExhenlGaWJlcihMYXp5Q29tcG9uZW50KSB7XG4gIGNvbnN0IGNvbnRhaW5lciA9IGdsb2JhbC5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgbGV0IGluc3QgPSBudWxsO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QvcHJlZmVyLXN0YXRlbGVzcy1mdW5jdGlvblxuICBjbGFzcyBUZXN0ZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIHJlbmRlcigpIHtcbiAgICAgIGluc3QgPSB0aGlzO1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGF6eUNvbXBvbmVudCk7XG4gICAgfVxuICB9XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC9wcmVmZXItc3RhdGVsZXNzLWZ1bmN0aW9uXG4gIGNsYXNzIFN1c3BlbnNlV3JhcHBlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgcmVuZGVyKCkge1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIFJlYWN0LlN1c3BlbnNlLFxuICAgICAgICB7IGZhbGxiYWNrOiBmYWxzZSB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRlc3RlciksXG4gICAgICApO1xuICAgIH1cbiAgfVxuICBSZWFjdERPTS5yZW5kZXIoUmVhY3QuY3JlYXRlRWxlbWVudChTdXNwZW5zZVdyYXBwZXIpLCBjb250YWluZXIpO1xuICByZXR1cm4gaW5zdC5fcmVhY3RJbnRlcm5hbEZpYmVyLmNoaWxkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRldGVjdEZpYmVyVGFncygpIHtcbiAgY29uc3Qgc3VwcG9ydHNNb2RlID0gdHlwZW9mIFJlYWN0LlN0cmljdE1vZGUgIT09ICd1bmRlZmluZWQnO1xuICBjb25zdCBzdXBwb3J0c0NvbnRleHQgPSB0eXBlb2YgUmVhY3QuY3JlYXRlQ29udGV4dCAhPT0gJ3VuZGVmaW5lZCc7XG4gIGNvbnN0IHN1cHBvcnRzRm9yd2FyZFJlZiA9IHR5cGVvZiBSZWFjdC5mb3J3YXJkUmVmICE9PSAndW5kZWZpbmVkJztcbiAgY29uc3Qgc3VwcG9ydHNNZW1vID0gdHlwZW9mIFJlYWN0Lm1lbW8gIT09ICd1bmRlZmluZWQnO1xuICBjb25zdCBzdXBwb3J0c1Byb2ZpbGVyID0gdHlwZW9mIFJlYWN0LnVuc3RhYmxlX1Byb2ZpbGVyICE9PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgUmVhY3QuUHJvZmlsZXIgIT09ICd1bmRlZmluZWQnO1xuICBjb25zdCBzdXBwb3J0c1N1c3BlbnNlID0gdHlwZW9mIFJlYWN0LlN1c3BlbnNlICE9PSAndW5kZWZpbmVkJztcbiAgY29uc3Qgc3VwcG9ydHNMYXp5ID0gdHlwZW9mIFJlYWN0LmxhenkgIT09ICd1bmRlZmluZWQnO1xuXG4gIGZ1bmN0aW9uIEZuKCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC9wcmVmZXItc3RhdGVsZXNzLWZ1bmN0aW9uXG4gIGNsYXNzIENscyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgcmVuZGVyKCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG4gIGxldCBDdHggPSBudWxsO1xuICBsZXQgRndkUmVmID0gbnVsbDtcbiAgbGV0IExhenlDb21wb25lbnQgPSBudWxsO1xuICBpZiAoc3VwcG9ydHNDb250ZXh0KSB7XG4gICAgQ3R4ID0gUmVhY3QuY3JlYXRlQ29udGV4dCgpO1xuICB9XG4gIGlmIChzdXBwb3J0c0ZvcndhcmRSZWYpIHtcbiAgICAvLyBSZWFjdCB3aWxsIHdhcm4gaWYgd2UgZG9uJ3QgaGF2ZSBib3RoIGFyZ3VtZW50cy5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICBGd2RSZWYgPSBSZWFjdC5mb3J3YXJkUmVmKChwcm9wcywgcmVmKSA9PiBudWxsKTtcbiAgfVxuICBpZiAoc3VwcG9ydHNMYXp5KSB7XG4gICAgTGF6eUNvbXBvbmVudCA9IFJlYWN0LmxhenkoKCkgPT4gZmFrZUR5bmFtaWNJbXBvcnQoKCkgPT4gbnVsbCkpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBIb3N0Um9vdDogZ2V0RmliZXIoJ3Rlc3QnKS5yZXR1cm4ucmV0dXJuLnRhZywgLy8gR28gdHdvIGxldmVscyBhYm92ZSB0byBmaW5kIHRoZSByb290XG4gICAgQ2xhc3NDb21wb25lbnQ6IGdldEZpYmVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ2xzKSkudGFnLFxuICAgIEZyYWdtZW50OiBnZXRGaWJlcihbWyduZXN0ZWQnXV0pLnRhZyxcbiAgICBGdW5jdGlvbmFsQ29tcG9uZW50OiBnZXRGaWJlcihSZWFjdC5jcmVhdGVFbGVtZW50KEZuKSkudGFnLFxuICAgIE1lbW9TRkM6IHN1cHBvcnRzTWVtb1xuICAgICAgPyBnZXRGaWJlcihSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0Lm1lbW8oRm4pKSkudGFnXG4gICAgICA6IC0xLFxuICAgIE1lbW9DbGFzczogc3VwcG9ydHNNZW1vXG4gICAgICA/IGdldEZpYmVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QubWVtbyhDbHMpKSkudGFnXG4gICAgICA6IC0xLFxuICAgIEhvc3RQb3J0YWw6IGdldEZpYmVyKFJlYWN0RE9NLmNyZWF0ZVBvcnRhbChudWxsLCBnbG9iYWwuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpKS50YWcsXG4gICAgSG9zdENvbXBvbmVudDogZ2V0RmliZXIoUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicpKS50YWcsXG4gICAgSG9zdFRleHQ6IGdldEZpYmVyKCd0ZXh0JykudGFnLFxuICAgIE1vZGU6IHN1cHBvcnRzTW9kZVxuICAgICAgPyBnZXRGaWJlcihSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LlN0cmljdE1vZGUpKS50YWdcbiAgICAgIDogLTEsXG4gICAgQ29udGV4dENvbnN1bWVyOiBzdXBwb3J0c0NvbnRleHRcbiAgICAgID8gZ2V0RmliZXIoUmVhY3QuY3JlYXRlRWxlbWVudChDdHguQ29uc3VtZXIsIG51bGwsICgpID0+IG51bGwpKS50YWdcbiAgICAgIDogLTEsXG4gICAgQ29udGV4dFByb3ZpZGVyOiBzdXBwb3J0c0NvbnRleHRcbiAgICAgID8gZ2V0RmliZXIoUmVhY3QuY3JlYXRlRWxlbWVudChDdHguUHJvdmlkZXIsIHsgdmFsdWU6IG51bGwgfSwgbnVsbCkpLnRhZ1xuICAgICAgOiAtMSxcbiAgICBGb3J3YXJkUmVmOiBzdXBwb3J0c0ZvcndhcmRSZWZcbiAgICAgID8gZ2V0RmliZXIoUmVhY3QuY3JlYXRlRWxlbWVudChGd2RSZWYpKS50YWdcbiAgICAgIDogLTEsXG4gICAgUHJvZmlsZXI6IHN1cHBvcnRzUHJvZmlsZXJcbiAgICAgID8gZ2V0RmliZXIoUmVhY3QuY3JlYXRlRWxlbWVudCgoUmVhY3QuUHJvZmlsZXIgfHwgUmVhY3QudW5zdGFibGVfUHJvZmlsZXIpLCB7IGlkOiAnbW9jaycsIG9uUmVuZGVyKCkge30gfSkpLnRhZ1xuICAgICAgOiAtMSxcbiAgICBTdXNwZW5zZTogc3VwcG9ydHNTdXNwZW5zZVxuICAgICAgPyBnZXRGaWJlcihSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LlN1c3BlbnNlLCB7IGZhbGxiYWNrOiBmYWxzZSB9KSkudGFnXG4gICAgICA6IC0xLFxuICAgIExhenk6IHN1cHBvcnRzTGF6eVxuICAgICAgPyBnZXRMYXp5RmliZXIoTGF6eUNvbXBvbmVudCkudGFnXG4gICAgICA6IC0xLFxuICB9O1xufTtcbiJdfQ==
//# sourceMappingURL=detectFiberTags.js.map