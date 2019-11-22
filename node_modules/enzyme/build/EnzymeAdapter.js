'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function unimplementedError(methodName, classname) {
  return new Error(String(methodName) + ' is a required method of ' + String(classname) + ', but was not implemented.');
}

var EnzymeAdapter = function () {
  function EnzymeAdapter() {
    _classCallCheck(this, EnzymeAdapter);

    this.options = {};
  }

  // Provided a bag of options, return an `EnzymeRenderer`. Some options can be implementation
  // specific, like `attach` etc. for React, but not part of this interface explicitly.
  // eslint-disable-next-line class-methods-use-this, no-unused-vars


  _createClass(EnzymeAdapter, [{
    key: 'createRenderer',
    value: function () {
      function createRenderer(options) {
        throw unimplementedError('createRenderer', 'EnzymeAdapter');
      }

      return createRenderer;
    }()

    // converts an RSTNode to the corresponding JSX Pragma Element. This will be needed
    // in order to implement the `Wrapper.mount()` and `Wrapper.shallow()` methods, but should
    // be pretty straightforward for people to implement.
    // eslint-disable-next-line class-methods-use-this, no-unused-vars

  }, {
    key: 'nodeToElement',
    value: function () {
      function nodeToElement(node) {
        throw unimplementedError('nodeToElement', 'EnzymeAdapter');
      }

      return nodeToElement;
    }()

    // eslint-disable-next-line class-methods-use-this

  }, {
    key: 'matchesElementType',
    value: function () {
      function matchesElementType(node, matchingType) {
        if (!node) {
          return node;
        }
        var type = node.type;

        return type === matchingType;
      }

      return matchesElementType;
    }()

    // eslint-disable-next-line class-methods-use-this, no-unused-vars

  }, {
    key: 'isValidElement',
    value: function () {
      function isValidElement(element) {
        throw unimplementedError('isValidElement', 'EnzymeAdapter');
      }

      return isValidElement;
    }()

    // eslint-disable-next-line class-methods-use-this, no-unused-vars

  }, {
    key: 'createElement',
    value: function () {
      function createElement(type, props) {
        throw unimplementedError('createElement', 'EnzymeAdapter');
      }

      return createElement;
    }()

    // eslint-disable-next-line class-methods-use-this

  }, {
    key: 'invokeSetStateCallback',
    value: function () {
      function invokeSetStateCallback(instance, callback) {
        callback.call(instance);
      }

      return invokeSetStateCallback;
    }()
  }]);

  return EnzymeAdapter;
}();

EnzymeAdapter.MODES = {
  STRING: 'string',
  MOUNT: 'mount',
  SHALLOW: 'shallow'
};

module.exports = EnzymeAdapter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Fbnp5bWVBZGFwdGVyLmpzIl0sIm5hbWVzIjpbInVuaW1wbGVtZW50ZWRFcnJvciIsIm1ldGhvZE5hbWUiLCJjbGFzc25hbWUiLCJFcnJvciIsIkVuenltZUFkYXB0ZXIiLCJvcHRpb25zIiwibm9kZSIsIm1hdGNoaW5nVHlwZSIsInR5cGUiLCJlbGVtZW50IiwicHJvcHMiLCJpbnN0YW5jZSIsImNhbGxiYWNrIiwiY2FsbCIsIk1PREVTIiwiU1RSSU5HIiwiTU9VTlQiLCJTSEFMTE9XIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsU0FBU0Esa0JBQVQsQ0FBNEJDLFVBQTVCLEVBQXdDQyxTQUF4QyxFQUFtRDtBQUNqRCxTQUFPLElBQUlDLEtBQUosUUFBYUYsVUFBYix5Q0FBbURDLFNBQW5ELGlDQUFQO0FBQ0Q7O0lBRUtFLGE7QUFDSiwyQkFBYztBQUFBOztBQUNaLFNBQUtDLE9BQUwsR0FBZSxFQUFmO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBOzs7Ozs7OEJBQ2VBLE8sRUFBUztBQUN0QixjQUFNTCxtQkFBbUIsZ0JBQW5CLEVBQXFDLGVBQXJDLENBQU47QUFDRDs7Ozs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7Ozs7NkJBQ2NNLEksRUFBTTtBQUNsQixjQUFNTixtQkFBbUIsZUFBbkIsRUFBb0MsZUFBcEMsQ0FBTjtBQUNEOzs7OztBQUVEOzs7OztrQ0FDbUJNLEksRUFBTUMsWSxFQUFjO0FBQ3JDLFlBQUksQ0FBQ0QsSUFBTCxFQUFXO0FBQ1QsaUJBQU9BLElBQVA7QUFDRDtBQUhvQyxZQUk3QkUsSUFKNkIsR0FJcEJGLElBSm9CLENBSTdCRSxJQUo2Qjs7QUFLckMsZUFBT0EsU0FBU0QsWUFBaEI7QUFDRDs7Ozs7QUFFRDs7Ozs7OEJBQ2VFLE8sRUFBUztBQUN0QixjQUFNVCxtQkFBbUIsZ0JBQW5CLEVBQXFDLGVBQXJDLENBQU47QUFDRDs7Ozs7QUFFRDs7Ozs7NkJBQ2NRLEksRUFBTUUsSyxFQUFvQjtBQUN0QyxjQUFNVixtQkFBbUIsZUFBbkIsRUFBb0MsZUFBcEMsQ0FBTjtBQUNEOzs7OztBQUVEOzs7OztzQ0FDdUJXLFEsRUFBVUMsUSxFQUFVO0FBQ3pDQSxpQkFBU0MsSUFBVCxDQUFjRixRQUFkO0FBQ0Q7Ozs7Ozs7OztBQUdIUCxjQUFjVSxLQUFkLEdBQXNCO0FBQ3BCQyxVQUFRLFFBRFk7QUFFcEJDLFNBQU8sT0FGYTtBQUdwQkMsV0FBUztBQUhXLENBQXRCOztBQU1BQyxPQUFPQyxPQUFQLEdBQWlCZixhQUFqQiIsImZpbGUiOiJFbnp5bWVBZGFwdGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gdW5pbXBsZW1lbnRlZEVycm9yKG1ldGhvZE5hbWUsIGNsYXNzbmFtZSkge1xuICByZXR1cm4gbmV3IEVycm9yKGAke21ldGhvZE5hbWV9IGlzIGEgcmVxdWlyZWQgbWV0aG9kIG9mICR7Y2xhc3NuYW1lfSwgYnV0IHdhcyBub3QgaW1wbGVtZW50ZWQuYCk7XG59XG5cbmNsYXNzIEVuenltZUFkYXB0ZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIC8vIFByb3ZpZGVkIGEgYmFnIG9mIG9wdGlvbnMsIHJldHVybiBhbiBgRW56eW1lUmVuZGVyZXJgLiBTb21lIG9wdGlvbnMgY2FuIGJlIGltcGxlbWVudGF0aW9uXG4gIC8vIHNwZWNpZmljLCBsaWtlIGBhdHRhY2hgIGV0Yy4gZm9yIFJlYWN0LCBidXQgbm90IHBhcnQgb2YgdGhpcyBpbnRlcmZhY2UgZXhwbGljaXRseS5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXMsIG5vLXVudXNlZC12YXJzXG4gIGNyZWF0ZVJlbmRlcmVyKG9wdGlvbnMpIHtcbiAgICB0aHJvdyB1bmltcGxlbWVudGVkRXJyb3IoJ2NyZWF0ZVJlbmRlcmVyJywgJ0VuenltZUFkYXB0ZXInKTtcbiAgfVxuXG4gIC8vIGNvbnZlcnRzIGFuIFJTVE5vZGUgdG8gdGhlIGNvcnJlc3BvbmRpbmcgSlNYIFByYWdtYSBFbGVtZW50LiBUaGlzIHdpbGwgYmUgbmVlZGVkXG4gIC8vIGluIG9yZGVyIHRvIGltcGxlbWVudCB0aGUgYFdyYXBwZXIubW91bnQoKWAgYW5kIGBXcmFwcGVyLnNoYWxsb3coKWAgbWV0aG9kcywgYnV0IHNob3VsZFxuICAvLyBiZSBwcmV0dHkgc3RyYWlnaHRmb3J3YXJkIGZvciBwZW9wbGUgdG8gaW1wbGVtZW50LlxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2xhc3MtbWV0aG9kcy11c2UtdGhpcywgbm8tdW51c2VkLXZhcnNcbiAgbm9kZVRvRWxlbWVudChub2RlKSB7XG4gICAgdGhyb3cgdW5pbXBsZW1lbnRlZEVycm9yKCdub2RlVG9FbGVtZW50JywgJ0VuenltZUFkYXB0ZXInKTtcbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjbGFzcy1tZXRob2RzLXVzZS10aGlzXG4gIG1hdGNoZXNFbGVtZW50VHlwZShub2RlLCBtYXRjaGluZ1R5cGUpIHtcbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgIHJldHVybiBub2RlO1xuICAgIH1cbiAgICBjb25zdCB7IHR5cGUgfSA9IG5vZGU7XG4gICAgcmV0dXJuIHR5cGUgPT09IG1hdGNoaW5nVHlwZTtcbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjbGFzcy1tZXRob2RzLXVzZS10aGlzLCBuby11bnVzZWQtdmFyc1xuICBpc1ZhbGlkRWxlbWVudChlbGVtZW50KSB7XG4gICAgdGhyb3cgdW5pbXBsZW1lbnRlZEVycm9yKCdpc1ZhbGlkRWxlbWVudCcsICdFbnp5bWVBZGFwdGVyJyk7XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2xhc3MtbWV0aG9kcy11c2UtdGhpcywgbm8tdW51c2VkLXZhcnNcbiAgY3JlYXRlRWxlbWVudCh0eXBlLCBwcm9wcywgLi4uY2hpbGRyZW4pIHtcbiAgICB0aHJvdyB1bmltcGxlbWVudGVkRXJyb3IoJ2NyZWF0ZUVsZW1lbnQnLCAnRW56eW1lQWRhcHRlcicpO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgaW52b2tlU2V0U3RhdGVDYWxsYmFjayhpbnN0YW5jZSwgY2FsbGJhY2spIHtcbiAgICBjYWxsYmFjay5jYWxsKGluc3RhbmNlKTtcbiAgfVxufVxuXG5Fbnp5bWVBZGFwdGVyLk1PREVTID0ge1xuICBTVFJJTkc6ICdzdHJpbmcnLFxuICBNT1VOVDogJ21vdW50JyxcbiAgU0hBTExPVzogJ3NoYWxsb3cnLFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFbnp5bWVBZGFwdGVyO1xuIl19
//# sourceMappingURL=EnzymeAdapter.js.map