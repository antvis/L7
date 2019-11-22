'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ITERATOR_SYMBOL = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.getAdapter = getAdapter;
exports.makeOptions = makeOptions;
exports.isCustomComponent = isCustomComponent;
exports.isCustomComponentElement = isCustomComponentElement;
exports.propsOfNode = propsOfNode;
exports.typeOfNode = typeOfNode;
exports.nodeHasType = nodeHasType;
exports.nodeMatches = nodeMatches;
exports.nodeEqual = nodeEqual;
exports.containsChildrenSubArray = containsChildrenSubArray;
exports.childrenToSimplifiedArray = childrenToSimplifiedArray;
exports.isReactElementAlike = isReactElementAlike;
exports.withSetStateAllowed = withSetStateAllowed;
exports.AND = AND;
exports.displayNameOfNode = displayNameOfNode;
exports.sym = sym;
exports.privateSet = privateSet;
exports.cloneElement = cloneElement;
exports.spyMethod = spyMethod;
exports.shallowEqual = shallowEqual;
exports.isEmptyValue = isEmptyValue;
exports.renderedDive = renderedDive;

var _object = require('object.assign');

var _object2 = _interopRequireDefault(_object);

var _lodash = require('lodash.isequal');

var _lodash2 = _interopRequireDefault(_lodash);

var _objectIs = require('object-is');

var _objectIs2 = _interopRequireDefault(_objectIs);

var _object3 = require('object.entries');

var _object4 = _interopRequireDefault(_object3);

var _functionPrototype = require('function.prototype.name');

var _functionPrototype2 = _interopRequireDefault(_functionPrototype);

var _has = require('has');

var _has2 = _interopRequireDefault(_has);

var _arrayPrototype = require('array.prototype.flat');

var _arrayPrototype2 = _interopRequireDefault(_arrayPrototype);

var _stringPrototype = require('string.prototype.trim');

var _stringPrototype2 = _interopRequireDefault(_stringPrototype);

var _configuration = require('./configuration');

var _RSTTraversal = require('./RSTTraversal');

var _getAdapter = require('./getAdapter');

var _getAdapter2 = _interopRequireDefault(_getAdapter);

var _validateAdapter = require('./validateAdapter');

var _validateAdapter2 = _interopRequireDefault(_validateAdapter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /* eslint no-use-before-define: 0 */


var ITERATOR_SYMBOL = exports.ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;

function getAdapter() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  console.warn('getAdapter from Utils is deprecated; please use ./getAdapter instead');
  return (0, _getAdapter2['default'])(options);
}

function validateMountOptions(attachTo, hydrateIn) {
  if (attachTo && hydrateIn && attachTo !== hydrateIn) {
    throw new TypeError('If both the `attachTo` and `hydrateIn` options are provided, they must be === (for backwards compatibility)');
  }
}

function makeOptions(options) {
  var _get = (0, _configuration.get)(),
      configAttachTo = _get.attachTo,
      configHydrateIn = _get.hydrateIn,
      config = _objectWithoutProperties(_get, ['attachTo', 'hydrateIn']);

  validateMountOptions(configAttachTo, configHydrateIn);

  var attachTo = options.attachTo,
      hydrateIn = options.hydrateIn;

  validateMountOptions(attachTo, hydrateIn);

  // neither present: both undefined
  // only attachTo present: attachTo set, hydrateIn undefined
  // only hydrateIn present: both set to hydrateIn
  // both present (and ===, per above): both set to hydrateIn
  var finalAttachTo = hydrateIn || configHydrateIn || configAttachTo || attachTo || undefined;
  var finalHydrateIn = hydrateIn || configHydrateIn || undefined;
  var mountTargets = (0, _object2['default'])({}, finalAttachTo && { attachTo: finalAttachTo }, finalHydrateIn && { hydrateIn: finalHydrateIn });

  return (0, _object2['default'])({}, config, options, mountTargets);
}

function isCustomComponent(component, adapter) {
  (0, _validateAdapter2['default'])(adapter);
  if (adapter.isCustomComponent) {
    return !!adapter.isCustomComponent(component);
  }
  return typeof component === 'function';
}

function isCustomComponentElement(inst, adapter) {
  if (adapter.isCustomComponentElement) {
    return !!adapter.isCustomComponentElement(inst);
  }
  return !!inst && adapter.isValidElement(inst) && typeof inst.type === 'function';
}

function propsOfNode(node) {
  return (0, _object4['default'])(node && node.props || {}).filter(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        value = _ref2[1];

    return typeof value !== 'undefined';
  }).reduce(function (acc, _ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        key = _ref4[0],
        value = _ref4[1];

    return (0, _object2['default'])(acc, _defineProperty({}, key, value));
  }, {});
}

function typeOfNode(node) {
  return node ? node.type : null;
}

function nodeHasType(node, type) {
  if (!type || !node) return false;

  var adapter = (0, _getAdapter2['default'])();
  if (adapter.displayNameOfNode) {
    var displayName = adapter.displayNameOfNode(node);
    return displayName === type;
  }

  if (!node.type) return false;
  if (typeof node.type === 'string') return node.type === type;
  return (typeof node.type === 'function' ? (0, _functionPrototype2['default'])(node.type) === type : node.type.name === type) || node.type.displayName === type;
}

function internalChildrenCompare(a, b, lenComp, isLoose) {
  var nodeCompare = isLoose ? nodeMatches : nodeEqual;

  if (a === b) return true;
  if (!Array.isArray(a) && !Array.isArray(b)) {
    return nodeCompare(a, b, lenComp);
  }
  var flatA = (0, _arrayPrototype2['default'])(a, Infinity);
  var flatB = (0, _arrayPrototype2['default'])(b, Infinity);
  if (flatA.length !== flatB.length) return false;
  if (flatA.length === 0 && flatB.length === 0) return true;
  for (var i = 0; i < flatA.length; i += 1) {
    if (!nodeCompare(flatA[i], flatB[i], lenComp)) return false;
  }
  return true;
}

function childrenMatch(a, b, lenComp) {
  return internalChildrenCompare(a, b, lenComp, true);
}

function childrenEqual(a, b, lenComp) {
  return internalChildrenCompare(a, b, lenComp, false);
}

function removeNullaryReducer(acc, _ref5) {
  var _ref6 = _slicedToArray(_ref5, 2),
      key = _ref6[0],
      value = _ref6[1];

  var addition = value == null ? {} : _defineProperty({}, key, value);
  return (0, _object2['default'])({}, acc, addition);
}

function internalNodeCompare(a, b, lenComp, isLoose) {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.type !== b.type) return false;

  var left = propsOfNode(a);
  var right = propsOfNode(b);
  if (isLoose) {
    left = (0, _object4['default'])(left).reduce(removeNullaryReducer, {});
    right = (0, _object4['default'])(right).reduce(removeNullaryReducer, {});
  }

  var leftKeys = Object.keys(left);
  for (var i = 0; i < leftKeys.length; i += 1) {
    var prop = leftKeys[i];
    // we will check children later
    if (prop === 'children') {
      // continue;
    } else if (!(prop in right)) {
      return false;
    } else if (right[prop] === left[prop]) {
      // continue;
    } else if (_typeof(right[prop]) === _typeof(left[prop]) && _typeof(left[prop]) === 'object') {
      if (!(0, _lodash2['default'])(left[prop], right[prop])) return false;
    } else {
      return false;
    }
  }

  var leftHasChildren = 'children' in left;
  var rightHasChildren = 'children' in right;
  var childCompare = isLoose ? childrenMatch : childrenEqual;
  if (leftHasChildren || rightHasChildren) {
    if (!childCompare(childrenToSimplifiedArray(left.children, isLoose), childrenToSimplifiedArray(right.children, isLoose), lenComp)) {
      return false;
    }
  }

  if (!isTextualNode(a)) {
    var rightKeys = Object.keys(right);
    return lenComp(leftKeys.length - leftHasChildren, rightKeys.length - rightHasChildren);
  }

  return false;
}

function nodeMatches(a, b) {
  var lenComp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _objectIs2['default'];

  return internalNodeCompare(a, b, lenComp, true);
}

function nodeEqual(a, b) {
  var lenComp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _objectIs2['default'];

  return internalNodeCompare(a, b, lenComp, false);
}

function containsChildrenSubArray(match, node, subArray) {
  var children = (0, _RSTTraversal.childrenOfNode)(node);
  var checker = function checker(_, i) {
    return arraysEqual(match, children.slice(i, i + subArray.length), subArray);
  };
  return children.some(checker);
}

function arraysEqual(match, left, right) {
  return left.length === right.length && left.every(function (el, i) {
    return match(el, right[i]);
  });
}

function childrenToArray(children) {
  var result = [];

  var push = function push(el) {
    if (el === null || el === false || typeof el === 'undefined') return;
    result.push(el);
  };

  if (Array.isArray(children)) {
    children.forEach(push);
  } else {
    push(children);
  }
  return result;
}

function childrenToSimplifiedArray(nodeChildren) {
  var isLoose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var childrenArray = childrenToArray(nodeChildren);
  var simplifiedArray = [];

  for (var i = 0; i < childrenArray.length; i += 1) {
    var child = childrenArray[i];
    var previousChild = simplifiedArray.pop();

    if (typeof previousChild === 'undefined') {
      simplifiedArray.push(child);
    } else if (isTextualNode(child) && isTextualNode(previousChild)) {
      simplifiedArray.push(previousChild + child);
    } else {
      simplifiedArray.push(previousChild);
      simplifiedArray.push(child);
    }
  }

  if (isLoose) {
    return simplifiedArray.map(function (x) {
      return typeof x === 'string' ? (0, _stringPrototype2['default'])(x) : x;
    });
  }

  return simplifiedArray;
}

function isTextualNode(node) {
  return typeof node === 'string' || typeof node === 'number';
}

function isReactElementAlike(arg, adapter) {
  return adapter.isValidElement(arg) || isTextualNode(arg) || Array.isArray(arg);
}

// TODO(lmr): can we get rid of this outside of the adapter?
function withSetStateAllowed(fn) {
  // NOTE(lmr):
  // this is currently here to circumvent a React bug where `setState()` is
  // not allowed without global being defined.
  var cleanup = false;
  if (typeof global.document === 'undefined') {
    cleanup = true;
    global.document = {};
  }
  fn();
  if (cleanup) {
    // This works around a bug in node/jest in that developers aren't able to
    // delete things from global when running in a node vm.
    global.document = undefined;
    delete global.document;
  }
}

function AND(fns) {
  var fnsReversed = fns.slice().reverse();
  return function (x) {
    return fnsReversed.every(function (fn) {
      return fn(x);
    });
  };
}

function displayNameOfNode(node) {
  if (!node) return null;

  var type = node.type;


  if (!type) return null;

  return type.displayName || (typeof type === 'function' ? (0, _functionPrototype2['default'])(type) : type.name || type);
}

function sym(s) {
  return typeof Symbol === 'function' ? Symbol['for']('enzyme.' + String(s)) : s;
}

function privateSet(obj, prop, value) {
  Object.defineProperty(obj, prop, {
    value: value,
    enumerable: false,
    writable: true
  });
}

function cloneElement(adapter, el, props) {
  return adapter.createElement(el.type, (0, _object2['default'])({}, el.props, props));
}

function spyMethod(instance, methodName) {
  var getStub = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

  var lastReturnValue = void 0;
  var originalMethod = instance[methodName];
  var hasOwn = (0, _has2['default'])(instance, methodName);
  var descriptor = void 0;
  if (hasOwn) {
    descriptor = Object.getOwnPropertyDescriptor(instance, methodName);
  }
  Object.defineProperty(instance, methodName, {
    configurable: true,
    enumerable: !descriptor || !!descriptor.enumerable,
    value: getStub(originalMethod) || function () {
      function spied() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var result = originalMethod.apply(this, args);
        lastReturnValue = result;
        return result;
      }

      return spied;
    }()
  });
  return {
    restore: function () {
      function restore() {
        if (hasOwn) {
          if (descriptor) {
            Object.defineProperty(instance, methodName, descriptor);
          } else {
            /* eslint-disable no-param-reassign */
            instance[methodName] = originalMethod;
            /* eslint-enable no-param-reassign */
          }
        } else {
          /* eslint-disable no-param-reassign */
          delete instance[methodName];
          /* eslint-enable no-param-reassign */
        }
      }

      return restore;
    }(),
    getLastReturnValue: function () {
      function getLastReturnValue() {
        return lastReturnValue;
      }

      return getLastReturnValue;
    }()
  };
}

// adapted from https://github.com/facebook/react/blob/144328fe81719e916b946e22660479e31561bb0b/packages/shared/shallowEqual.js#L36-L68
function shallowEqual(objA, objB) {
  if ((0, _objectIs2['default'])(objA, objB)) {
    return true;
  }

  if (!objA || !objB || (typeof objA === 'undefined' ? 'undefined' : _typeof(objA)) !== 'object' || (typeof objB === 'undefined' ? 'undefined' : _typeof(objB)) !== 'object') {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  keysA.sort();
  keysB.sort();

  // Test for A's keys different from B.
  for (var i = 0; i < keysA.length; i += 1) {
    if (!(0, _has2['default'])(objB, keysA[i]) || !(0, _objectIs2['default'])(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

function isEmptyValue(renderedValue) {
  return renderedValue === null || renderedValue === false;
}

function renderedDive(nodes) {
  if (isEmptyValue(nodes)) {
    return true;
  }

  return [].concat(nodes).every(function (n) {
    if (n) {
      var rendered = n.rendered;

      return isEmptyValue(rendered) || renderedDive(rendered);
    }

    return isEmptyValue(n);
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9VdGlscy5qcyJdLCJuYW1lcyI6WyJnZXRBZGFwdGVyIiwibWFrZU9wdGlvbnMiLCJpc0N1c3RvbUNvbXBvbmVudCIsImlzQ3VzdG9tQ29tcG9uZW50RWxlbWVudCIsInByb3BzT2ZOb2RlIiwidHlwZU9mTm9kZSIsIm5vZGVIYXNUeXBlIiwibm9kZU1hdGNoZXMiLCJub2RlRXF1YWwiLCJjb250YWluc0NoaWxkcmVuU3ViQXJyYXkiLCJjaGlsZHJlblRvU2ltcGxpZmllZEFycmF5IiwiaXNSZWFjdEVsZW1lbnRBbGlrZSIsIndpdGhTZXRTdGF0ZUFsbG93ZWQiLCJBTkQiLCJkaXNwbGF5TmFtZU9mTm9kZSIsInN5bSIsInByaXZhdGVTZXQiLCJjbG9uZUVsZW1lbnQiLCJzcHlNZXRob2QiLCJzaGFsbG93RXF1YWwiLCJpc0VtcHR5VmFsdWUiLCJyZW5kZXJlZERpdmUiLCJJVEVSQVRPUl9TWU1CT0wiLCJTeW1ib2wiLCJpdGVyYXRvciIsIm9wdGlvbnMiLCJjb25zb2xlIiwid2FybiIsInZhbGlkYXRlTW91bnRPcHRpb25zIiwiYXR0YWNoVG8iLCJoeWRyYXRlSW4iLCJUeXBlRXJyb3IiLCJjb25maWdBdHRhY2hUbyIsImNvbmZpZ0h5ZHJhdGVJbiIsImNvbmZpZyIsImZpbmFsQXR0YWNoVG8iLCJ1bmRlZmluZWQiLCJmaW5hbEh5ZHJhdGVJbiIsIm1vdW50VGFyZ2V0cyIsImNvbXBvbmVudCIsImFkYXB0ZXIiLCJpbnN0IiwiaXNWYWxpZEVsZW1lbnQiLCJ0eXBlIiwibm9kZSIsInByb3BzIiwiZmlsdGVyIiwidmFsdWUiLCJyZWR1Y2UiLCJhY2MiLCJrZXkiLCJkaXNwbGF5TmFtZSIsIm5hbWUiLCJpbnRlcm5hbENoaWxkcmVuQ29tcGFyZSIsImEiLCJiIiwibGVuQ29tcCIsImlzTG9vc2UiLCJub2RlQ29tcGFyZSIsIkFycmF5IiwiaXNBcnJheSIsImZsYXRBIiwiSW5maW5pdHkiLCJmbGF0QiIsImxlbmd0aCIsImkiLCJjaGlsZHJlbk1hdGNoIiwiY2hpbGRyZW5FcXVhbCIsInJlbW92ZU51bGxhcnlSZWR1Y2VyIiwiYWRkaXRpb24iLCJpbnRlcm5hbE5vZGVDb21wYXJlIiwibGVmdCIsInJpZ2h0IiwibGVmdEtleXMiLCJPYmplY3QiLCJrZXlzIiwicHJvcCIsImxlZnRIYXNDaGlsZHJlbiIsInJpZ2h0SGFzQ2hpbGRyZW4iLCJjaGlsZENvbXBhcmUiLCJjaGlsZHJlbiIsImlzVGV4dHVhbE5vZGUiLCJyaWdodEtleXMiLCJpcyIsIm1hdGNoIiwic3ViQXJyYXkiLCJjaGVja2VyIiwiXyIsImFycmF5c0VxdWFsIiwic2xpY2UiLCJzb21lIiwiZXZlcnkiLCJlbCIsImNoaWxkcmVuVG9BcnJheSIsInJlc3VsdCIsInB1c2giLCJmb3JFYWNoIiwibm9kZUNoaWxkcmVuIiwiY2hpbGRyZW5BcnJheSIsInNpbXBsaWZpZWRBcnJheSIsImNoaWxkIiwicHJldmlvdXNDaGlsZCIsInBvcCIsIm1hcCIsIngiLCJhcmciLCJmbiIsImNsZWFudXAiLCJnbG9iYWwiLCJkb2N1bWVudCIsImZucyIsImZuc1JldmVyc2VkIiwicmV2ZXJzZSIsInMiLCJvYmoiLCJkZWZpbmVQcm9wZXJ0eSIsImVudW1lcmFibGUiLCJ3cml0YWJsZSIsImNyZWF0ZUVsZW1lbnQiLCJpbnN0YW5jZSIsIm1ldGhvZE5hbWUiLCJnZXRTdHViIiwibGFzdFJldHVyblZhbHVlIiwib3JpZ2luYWxNZXRob2QiLCJoYXNPd24iLCJkZXNjcmlwdG9yIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiY29uZmlndXJhYmxlIiwic3BpZWQiLCJhcmdzIiwiYXBwbHkiLCJyZXN0b3JlIiwiZ2V0TGFzdFJldHVyblZhbHVlIiwib2JqQSIsIm9iakIiLCJrZXlzQSIsImtleXNCIiwic29ydCIsInJlbmRlcmVkVmFsdWUiLCJub2RlcyIsImNvbmNhdCIsIm4iLCJyZW5kZXJlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7UUFnQmdCQSxVLEdBQUFBLFU7UUFXQUMsVyxHQUFBQSxXO1FB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QkQsQ0FEaEIsQ0FDR0MsUUFESDs7QUFFTCxhQUFPMUgsYUFBYTBILFFBQWIsS0FBMEJ6SCxhQUFheUgsUUFBYixDQUFqQztBQUNEOztBQUVELFdBQU8xSCxhQUFheUgsQ0FBYixDQUFQO0FBQ0QsR0FQTSxDQUFQO0FBUUQiLCJmaWxlIjoiVXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQgbm8tdXNlLWJlZm9yZS1kZWZpbmU6IDAgKi9cbmltcG9ydCBpc0VxdWFsIGZyb20gJ2xvZGFzaC5pc2VxdWFsJztcbmltcG9ydCBpcyBmcm9tICdvYmplY3QtaXMnO1xuaW1wb3J0IGVudHJpZXMgZnJvbSAnb2JqZWN0LmVudHJpZXMnO1xuaW1wb3J0IGZ1bmN0aW9uTmFtZSBmcm9tICdmdW5jdGlvbi5wcm90b3R5cGUubmFtZSc7XG5pbXBvcnQgaGFzIGZyb20gJ2hhcyc7XG5pbXBvcnQgZmxhdCBmcm9tICdhcnJheS5wcm90b3R5cGUuZmxhdCc7XG5pbXBvcnQgdHJpbSBmcm9tICdzdHJpbmcucHJvdG90eXBlLnRyaW0nO1xuXG5pbXBvcnQgeyBnZXQgfSBmcm9tICcuL2NvbmZpZ3VyYXRpb24nO1xuaW1wb3J0IHsgY2hpbGRyZW5PZk5vZGUgfSBmcm9tICcuL1JTVFRyYXZlcnNhbCc7XG5pbXBvcnQgcmVhbEdldEFkYXB0ZXIgZnJvbSAnLi9nZXRBZGFwdGVyJztcbmltcG9ydCB2YWxpZGF0ZUFkYXB0ZXIgZnJvbSAnLi92YWxpZGF0ZUFkYXB0ZXInO1xuXG5leHBvcnQgY29uc3QgSVRFUkFUT1JfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuaXRlcmF0b3I7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBZGFwdGVyKG9wdGlvbnMgPSB7fSkge1xuICBjb25zb2xlLndhcm4oJ2dldEFkYXB0ZXIgZnJvbSBVdGlscyBpcyBkZXByZWNhdGVkOyBwbGVhc2UgdXNlIC4vZ2V0QWRhcHRlciBpbnN0ZWFkJyk7XG4gIHJldHVybiByZWFsR2V0QWRhcHRlcihvcHRpb25zKTtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVNb3VudE9wdGlvbnMoYXR0YWNoVG8sIGh5ZHJhdGVJbikge1xuICBpZiAoYXR0YWNoVG8gJiYgaHlkcmF0ZUluICYmIGF0dGFjaFRvICE9PSBoeWRyYXRlSW4pIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJZiBib3RoIHRoZSBgYXR0YWNoVG9gIGFuZCBgaHlkcmF0ZUluYCBvcHRpb25zIGFyZSBwcm92aWRlZCwgdGhleSBtdXN0IGJlID09PSAoZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5KScpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlT3B0aW9ucyhvcHRpb25zKSB7XG4gIGNvbnN0IHsgYXR0YWNoVG86IGNvbmZpZ0F0dGFjaFRvLCBoeWRyYXRlSW46IGNvbmZpZ0h5ZHJhdGVJbiwgLi4uY29uZmlnIH0gPSBnZXQoKTtcbiAgdmFsaWRhdGVNb3VudE9wdGlvbnMoY29uZmlnQXR0YWNoVG8sIGNvbmZpZ0h5ZHJhdGVJbik7XG5cbiAgY29uc3QgeyBhdHRhY2hUbywgaHlkcmF0ZUluIH0gPSBvcHRpb25zO1xuICB2YWxpZGF0ZU1vdW50T3B0aW9ucyhhdHRhY2hUbywgaHlkcmF0ZUluKTtcblxuICAvLyBuZWl0aGVyIHByZXNlbnQ6IGJvdGggdW5kZWZpbmVkXG4gIC8vIG9ubHkgYXR0YWNoVG8gcHJlc2VudDogYXR0YWNoVG8gc2V0LCBoeWRyYXRlSW4gdW5kZWZpbmVkXG4gIC8vIG9ubHkgaHlkcmF0ZUluIHByZXNlbnQ6IGJvdGggc2V0IHRvIGh5ZHJhdGVJblxuICAvLyBib3RoIHByZXNlbnQgKGFuZCA9PT0sIHBlciBhYm92ZSk6IGJvdGggc2V0IHRvIGh5ZHJhdGVJblxuICBjb25zdCBmaW5hbEF0dGFjaFRvID0gaHlkcmF0ZUluIHx8IGNvbmZpZ0h5ZHJhdGVJbiB8fCBjb25maWdBdHRhY2hUbyB8fCBhdHRhY2hUbyB8fCB1bmRlZmluZWQ7XG4gIGNvbnN0IGZpbmFsSHlkcmF0ZUluID0gaHlkcmF0ZUluIHx8IGNvbmZpZ0h5ZHJhdGVJbiB8fCB1bmRlZmluZWQ7XG4gIGNvbnN0IG1vdW50VGFyZ2V0cyA9IHtcbiAgICAuLi4oZmluYWxBdHRhY2hUbyAmJiB7IGF0dGFjaFRvOiBmaW5hbEF0dGFjaFRvIH0pLFxuICAgIC4uLihmaW5hbEh5ZHJhdGVJbiAmJiB7IGh5ZHJhdGVJbjogZmluYWxIeWRyYXRlSW4gfSksXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5jb25maWcsXG4gICAgLi4ub3B0aW9ucyxcbiAgICAuLi5tb3VudFRhcmdldHMsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0N1c3RvbUNvbXBvbmVudChjb21wb25lbnQsIGFkYXB0ZXIpIHtcbiAgdmFsaWRhdGVBZGFwdGVyKGFkYXB0ZXIpO1xuICBpZiAoYWRhcHRlci5pc0N1c3RvbUNvbXBvbmVudCkge1xuICAgIHJldHVybiAhIWFkYXB0ZXIuaXNDdXN0b21Db21wb25lbnQoY29tcG9uZW50KTtcbiAgfVxuICByZXR1cm4gdHlwZW9mIGNvbXBvbmVudCA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ3VzdG9tQ29tcG9uZW50RWxlbWVudChpbnN0LCBhZGFwdGVyKSB7XG4gIGlmIChhZGFwdGVyLmlzQ3VzdG9tQ29tcG9uZW50RWxlbWVudCkge1xuICAgIHJldHVybiAhIWFkYXB0ZXIuaXNDdXN0b21Db21wb25lbnRFbGVtZW50KGluc3QpO1xuICB9XG4gIHJldHVybiAhIWluc3QgJiYgYWRhcHRlci5pc1ZhbGlkRWxlbWVudChpbnN0KSAmJiB0eXBlb2YgaW5zdC50eXBlID09PSAnZnVuY3Rpb24nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvcHNPZk5vZGUobm9kZSkge1xuICByZXR1cm4gZW50cmllcygobm9kZSAmJiBub2RlLnByb3BzKSB8fCB7fSlcbiAgICAuZmlsdGVyKChbLCB2YWx1ZV0pID0+IHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgLnJlZHVjZSgoYWNjLCBba2V5LCB2YWx1ZV0pID0+IE9iamVjdC5hc3NpZ24oYWNjLCB7IFtrZXldOiB2YWx1ZSB9KSwge30pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdHlwZU9mTm9kZShub2RlKSB7XG4gIHJldHVybiBub2RlID8gbm9kZS50eXBlIDogbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vZGVIYXNUeXBlKG5vZGUsIHR5cGUpIHtcbiAgaWYgKCF0eXBlIHx8ICFub2RlKSByZXR1cm4gZmFsc2U7XG5cbiAgY29uc3QgYWRhcHRlciA9IHJlYWxHZXRBZGFwdGVyKCk7XG4gIGlmIChhZGFwdGVyLmRpc3BsYXlOYW1lT2ZOb2RlKSB7XG4gICAgY29uc3QgZGlzcGxheU5hbWUgPSBhZGFwdGVyLmRpc3BsYXlOYW1lT2ZOb2RlKG5vZGUpO1xuICAgIHJldHVybiBkaXNwbGF5TmFtZSA9PT0gdHlwZTtcbiAgfVxuXG4gIGlmICghbm9kZS50eXBlKSByZXR1cm4gZmFsc2U7XG4gIGlmICh0eXBlb2Ygbm9kZS50eXBlID09PSAnc3RyaW5nJykgcmV0dXJuIG5vZGUudHlwZSA9PT0gdHlwZTtcbiAgcmV0dXJuIChcbiAgICB0eXBlb2Ygbm9kZS50eXBlID09PSAnZnVuY3Rpb24nID8gZnVuY3Rpb25OYW1lKG5vZGUudHlwZSkgPT09IHR5cGUgOiBub2RlLnR5cGUubmFtZSA9PT0gdHlwZVxuICApIHx8IG5vZGUudHlwZS5kaXNwbGF5TmFtZSA9PT0gdHlwZTtcbn1cblxuZnVuY3Rpb24gaW50ZXJuYWxDaGlsZHJlbkNvbXBhcmUoYSwgYiwgbGVuQ29tcCwgaXNMb29zZSkge1xuICBjb25zdCBub2RlQ29tcGFyZSA9IGlzTG9vc2UgPyBub2RlTWF0Y2hlcyA6IG5vZGVFcXVhbDtcblxuICBpZiAoYSA9PT0gYikgcmV0dXJuIHRydWU7XG4gIGlmICghQXJyYXkuaXNBcnJheShhKSAmJiAhQXJyYXkuaXNBcnJheShiKSkge1xuICAgIHJldHVybiBub2RlQ29tcGFyZShhLCBiLCBsZW5Db21wKTtcbiAgfVxuICBjb25zdCBmbGF0QSA9IGZsYXQoYSwgSW5maW5pdHkpO1xuICBjb25zdCBmbGF0QiA9IGZsYXQoYiwgSW5maW5pdHkpO1xuICBpZiAoZmxhdEEubGVuZ3RoICE9PSBmbGF0Qi5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgaWYgKGZsYXRBLmxlbmd0aCA9PT0gMCAmJiBmbGF0Qi5sZW5ndGggPT09IDApIHJldHVybiB0cnVlO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGZsYXRBLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgaWYgKCFub2RlQ29tcGFyZShmbGF0QVtpXSwgZmxhdEJbaV0sIGxlbkNvbXApKSByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGNoaWxkcmVuTWF0Y2goYSwgYiwgbGVuQ29tcCkge1xuICByZXR1cm4gaW50ZXJuYWxDaGlsZHJlbkNvbXBhcmUoYSwgYiwgbGVuQ29tcCwgdHJ1ZSk7XG59XG5cbmZ1bmN0aW9uIGNoaWxkcmVuRXF1YWwoYSwgYiwgbGVuQ29tcCkge1xuICByZXR1cm4gaW50ZXJuYWxDaGlsZHJlbkNvbXBhcmUoYSwgYiwgbGVuQ29tcCwgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVOdWxsYXJ5UmVkdWNlcihhY2MsIFtrZXksIHZhbHVlXSkge1xuICBjb25zdCBhZGRpdGlvbiA9IHZhbHVlID09IG51bGwgPyB7fSA6IHsgW2tleV06IHZhbHVlIH07XG4gIHJldHVybiB7IC4uLmFjYywgLi4uYWRkaXRpb24gfTtcbn1cblxuZnVuY3Rpb24gaW50ZXJuYWxOb2RlQ29tcGFyZShhLCBiLCBsZW5Db21wLCBpc0xvb3NlKSB7XG4gIGlmIChhID09PSBiKSByZXR1cm4gdHJ1ZTtcbiAgaWYgKCFhIHx8ICFiKSByZXR1cm4gZmFsc2U7XG4gIGlmIChhLnR5cGUgIT09IGIudHlwZSkgcmV0dXJuIGZhbHNlO1xuXG4gIGxldCBsZWZ0ID0gcHJvcHNPZk5vZGUoYSk7XG4gIGxldCByaWdodCA9IHByb3BzT2ZOb2RlKGIpO1xuICBpZiAoaXNMb29zZSkge1xuICAgIGxlZnQgPSBlbnRyaWVzKGxlZnQpLnJlZHVjZShyZW1vdmVOdWxsYXJ5UmVkdWNlciwge30pO1xuICAgIHJpZ2h0ID0gZW50cmllcyhyaWdodCkucmVkdWNlKHJlbW92ZU51bGxhcnlSZWR1Y2VyLCB7fSk7XG4gIH1cblxuICBjb25zdCBsZWZ0S2V5cyA9IE9iamVjdC5rZXlzKGxlZnQpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlZnRLZXlzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgY29uc3QgcHJvcCA9IGxlZnRLZXlzW2ldO1xuICAgIC8vIHdlIHdpbGwgY2hlY2sgY2hpbGRyZW4gbGF0ZXJcbiAgICBpZiAocHJvcCA9PT0gJ2NoaWxkcmVuJykge1xuICAgICAgLy8gY29udGludWU7XG4gICAgfSBlbHNlIGlmICghKHByb3AgaW4gcmlnaHQpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChyaWdodFtwcm9wXSA9PT0gbGVmdFtwcm9wXSkge1xuICAgICAgLy8gY29udGludWU7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcmlnaHRbcHJvcF0gPT09IHR5cGVvZiBsZWZ0W3Byb3BdICYmIHR5cGVvZiBsZWZ0W3Byb3BdID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKCFpc0VxdWFsKGxlZnRbcHJvcF0sIHJpZ2h0W3Byb3BdKSkgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgbGVmdEhhc0NoaWxkcmVuID0gJ2NoaWxkcmVuJyBpbiBsZWZ0O1xuICBjb25zdCByaWdodEhhc0NoaWxkcmVuID0gJ2NoaWxkcmVuJyBpbiByaWdodDtcbiAgY29uc3QgY2hpbGRDb21wYXJlID0gaXNMb29zZSA/IGNoaWxkcmVuTWF0Y2ggOiBjaGlsZHJlbkVxdWFsO1xuICBpZiAobGVmdEhhc0NoaWxkcmVuIHx8IHJpZ2h0SGFzQ2hpbGRyZW4pIHtcbiAgICBpZiAoIWNoaWxkQ29tcGFyZShcbiAgICAgIGNoaWxkcmVuVG9TaW1wbGlmaWVkQXJyYXkobGVmdC5jaGlsZHJlbiwgaXNMb29zZSksXG4gICAgICBjaGlsZHJlblRvU2ltcGxpZmllZEFycmF5KHJpZ2h0LmNoaWxkcmVuLCBpc0xvb3NlKSxcbiAgICAgIGxlbkNvbXAsXG4gICAgKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGlmICghaXNUZXh0dWFsTm9kZShhKSkge1xuICAgIGNvbnN0IHJpZ2h0S2V5cyA9IE9iamVjdC5rZXlzKHJpZ2h0KTtcbiAgICByZXR1cm4gbGVuQ29tcChsZWZ0S2V5cy5sZW5ndGggLSBsZWZ0SGFzQ2hpbGRyZW4sIHJpZ2h0S2V5cy5sZW5ndGggLSByaWdodEhhc0NoaWxkcmVuKTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vZGVNYXRjaGVzKGEsIGIsIGxlbkNvbXAgPSBpcykge1xuICByZXR1cm4gaW50ZXJuYWxOb2RlQ29tcGFyZShhLCBiLCBsZW5Db21wLCB0cnVlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vZGVFcXVhbChhLCBiLCBsZW5Db21wID0gaXMpIHtcbiAgcmV0dXJuIGludGVybmFsTm9kZUNvbXBhcmUoYSwgYiwgbGVuQ29tcCwgZmFsc2UpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29udGFpbnNDaGlsZHJlblN1YkFycmF5KG1hdGNoLCBub2RlLCBzdWJBcnJheSkge1xuICBjb25zdCBjaGlsZHJlbiA9IGNoaWxkcmVuT2ZOb2RlKG5vZGUpO1xuICBjb25zdCBjaGVja2VyID0gKF8sIGkpID0+IGFycmF5c0VxdWFsKG1hdGNoLCBjaGlsZHJlbi5zbGljZShpLCBpICsgc3ViQXJyYXkubGVuZ3RoKSwgc3ViQXJyYXkpO1xuICByZXR1cm4gY2hpbGRyZW4uc29tZShjaGVja2VyKTtcbn1cblxuZnVuY3Rpb24gYXJyYXlzRXF1YWwobWF0Y2gsIGxlZnQsIHJpZ2h0KSB7XG4gIHJldHVybiBsZWZ0Lmxlbmd0aCA9PT0gcmlnaHQubGVuZ3RoICYmIGxlZnQuZXZlcnkoKGVsLCBpKSA9PiBtYXRjaChlbCwgcmlnaHRbaV0pKTtcbn1cblxuZnVuY3Rpb24gY2hpbGRyZW5Ub0FycmF5KGNoaWxkcmVuKSB7XG4gIGNvbnN0IHJlc3VsdCA9IFtdO1xuXG4gIGNvbnN0IHB1c2ggPSAoZWwpID0+IHtcbiAgICBpZiAoZWwgPT09IG51bGwgfHwgZWwgPT09IGZhbHNlIHx8IHR5cGVvZiBlbCA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybjtcbiAgICByZXN1bHQucHVzaChlbCk7XG4gIH07XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pKSB7XG4gICAgY2hpbGRyZW4uZm9yRWFjaChwdXNoKTtcbiAgfSBlbHNlIHtcbiAgICBwdXNoKGNoaWxkcmVuKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2hpbGRyZW5Ub1NpbXBsaWZpZWRBcnJheShub2RlQ2hpbGRyZW4sIGlzTG9vc2UgPSBmYWxzZSkge1xuICBjb25zdCBjaGlsZHJlbkFycmF5ID0gY2hpbGRyZW5Ub0FycmF5KG5vZGVDaGlsZHJlbik7XG4gIGNvbnN0IHNpbXBsaWZpZWRBcnJheSA9IFtdO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW5BcnJheS5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGNvbnN0IGNoaWxkID0gY2hpbGRyZW5BcnJheVtpXTtcbiAgICBjb25zdCBwcmV2aW91c0NoaWxkID0gc2ltcGxpZmllZEFycmF5LnBvcCgpO1xuXG4gICAgaWYgKHR5cGVvZiBwcmV2aW91c0NoaWxkID09PSAndW5kZWZpbmVkJykge1xuICAgICAgc2ltcGxpZmllZEFycmF5LnB1c2goY2hpbGQpO1xuICAgIH0gZWxzZSBpZiAoaXNUZXh0dWFsTm9kZShjaGlsZCkgJiYgaXNUZXh0dWFsTm9kZShwcmV2aW91c0NoaWxkKSkge1xuICAgICAgc2ltcGxpZmllZEFycmF5LnB1c2gocHJldmlvdXNDaGlsZCArIGNoaWxkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2ltcGxpZmllZEFycmF5LnB1c2gocHJldmlvdXNDaGlsZCk7XG4gICAgICBzaW1wbGlmaWVkQXJyYXkucHVzaChjaGlsZCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGlzTG9vc2UpIHtcbiAgICByZXR1cm4gc2ltcGxpZmllZEFycmF5Lm1hcCh4ID0+ICh0eXBlb2YgeCA9PT0gJ3N0cmluZycgPyB0cmltKHgpIDogeCkpO1xuICB9XG5cbiAgcmV0dXJuIHNpbXBsaWZpZWRBcnJheTtcbn1cblxuZnVuY3Rpb24gaXNUZXh0dWFsTm9kZShub2RlKSB7XG4gIHJldHVybiB0eXBlb2Ygbm9kZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIG5vZGUgPT09ICdudW1iZXInO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNSZWFjdEVsZW1lbnRBbGlrZShhcmcsIGFkYXB0ZXIpIHtcbiAgcmV0dXJuIGFkYXB0ZXIuaXNWYWxpZEVsZW1lbnQoYXJnKSB8fCBpc1RleHR1YWxOb2RlKGFyZykgfHwgQXJyYXkuaXNBcnJheShhcmcpO1xufVxuXG4vLyBUT0RPKGxtcik6IGNhbiB3ZSBnZXQgcmlkIG9mIHRoaXMgb3V0c2lkZSBvZiB0aGUgYWRhcHRlcj9cbmV4cG9ydCBmdW5jdGlvbiB3aXRoU2V0U3RhdGVBbGxvd2VkKGZuKSB7XG4gIC8vIE5PVEUobG1yKTpcbiAgLy8gdGhpcyBpcyBjdXJyZW50bHkgaGVyZSB0byBjaXJjdW12ZW50IGEgUmVhY3QgYnVnIHdoZXJlIGBzZXRTdGF0ZSgpYCBpc1xuICAvLyBub3QgYWxsb3dlZCB3aXRob3V0IGdsb2JhbCBiZWluZyBkZWZpbmVkLlxuICBsZXQgY2xlYW51cCA9IGZhbHNlO1xuICBpZiAodHlwZW9mIGdsb2JhbC5kb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBjbGVhbnVwID0gdHJ1ZTtcbiAgICBnbG9iYWwuZG9jdW1lbnQgPSB7fTtcbiAgfVxuICBmbigpO1xuICBpZiAoY2xlYW51cCkge1xuICAgIC8vIFRoaXMgd29ya3MgYXJvdW5kIGEgYnVnIGluIG5vZGUvamVzdCBpbiB0aGF0IGRldmVsb3BlcnMgYXJlbid0IGFibGUgdG9cbiAgICAvLyBkZWxldGUgdGhpbmdzIGZyb20gZ2xvYmFsIHdoZW4gcnVubmluZyBpbiBhIG5vZGUgdm0uXG4gICAgZ2xvYmFsLmRvY3VtZW50ID0gdW5kZWZpbmVkO1xuICAgIGRlbGV0ZSBnbG9iYWwuZG9jdW1lbnQ7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEFORChmbnMpIHtcbiAgY29uc3QgZm5zUmV2ZXJzZWQgPSBmbnMuc2xpY2UoKS5yZXZlcnNlKCk7XG4gIHJldHVybiB4ID0+IGZuc1JldmVyc2VkLmV2ZXJ5KGZuID0+IGZuKHgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlOYW1lT2ZOb2RlKG5vZGUpIHtcbiAgaWYgKCFub2RlKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCB7IHR5cGUgfSA9IG5vZGU7XG5cbiAgaWYgKCF0eXBlKSByZXR1cm4gbnVsbDtcblxuICByZXR1cm4gdHlwZS5kaXNwbGF5TmFtZSB8fCAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicgPyBmdW5jdGlvbk5hbWUodHlwZSkgOiB0eXBlLm5hbWUgfHwgdHlwZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzeW0ocykge1xuICByZXR1cm4gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyA/IFN5bWJvbC5mb3IoYGVuenltZS4ke3N9YCkgOiBzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJpdmF0ZVNldChvYmosIHByb3AsIHZhbHVlKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHByb3AsIHtcbiAgICB2YWx1ZSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9uZUVsZW1lbnQoYWRhcHRlciwgZWwsIHByb3BzKSB7XG4gIHJldHVybiBhZGFwdGVyLmNyZWF0ZUVsZW1lbnQoXG4gICAgZWwudHlwZSxcbiAgICB7IC4uLmVsLnByb3BzLCAuLi5wcm9wcyB9LFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3B5TWV0aG9kKGluc3RhbmNlLCBtZXRob2ROYW1lLCBnZXRTdHViID0gKCkgPT4ge30pIHtcbiAgbGV0IGxhc3RSZXR1cm5WYWx1ZTtcbiAgY29uc3Qgb3JpZ2luYWxNZXRob2QgPSBpbnN0YW5jZVttZXRob2ROYW1lXTtcbiAgY29uc3QgaGFzT3duID0gaGFzKGluc3RhbmNlLCBtZXRob2ROYW1lKTtcbiAgbGV0IGRlc2NyaXB0b3I7XG4gIGlmIChoYXNPd24pIHtcbiAgICBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihpbnN0YW5jZSwgbWV0aG9kTmFtZSk7XG4gIH1cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGluc3RhbmNlLCBtZXRob2ROYW1lLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGVudW1lcmFibGU6ICFkZXNjcmlwdG9yIHx8ICEhZGVzY3JpcHRvci5lbnVtZXJhYmxlLFxuICAgIHZhbHVlOiBnZXRTdHViKG9yaWdpbmFsTWV0aG9kKSB8fCBmdW5jdGlvbiBzcGllZCguLi5hcmdzKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBvcmlnaW5hbE1ldGhvZC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgIGxhc3RSZXR1cm5WYWx1ZSA9IHJlc3VsdDtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcbiAgfSk7XG4gIHJldHVybiB7XG4gICAgcmVzdG9yZSgpIHtcbiAgICAgIGlmIChoYXNPd24pIHtcbiAgICAgICAgaWYgKGRlc2NyaXB0b3IpIHtcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoaW5zdGFuY2UsIG1ldGhvZE5hbWUsIGRlc2NyaXB0b3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG4gICAgICAgICAgaW5zdGFuY2VbbWV0aG9kTmFtZV0gPSBvcmlnaW5hbE1ldGhvZDtcbiAgICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG4gICAgICAgIGRlbGV0ZSBpbnN0YW5jZVttZXRob2ROYW1lXTtcbiAgICAgICAgLyogZXNsaW50LWVuYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0TGFzdFJldHVyblZhbHVlKCkge1xuICAgICAgcmV0dXJuIGxhc3RSZXR1cm5WYWx1ZTtcbiAgICB9LFxuICB9O1xufVxuXG4vLyBhZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2Jsb2IvMTQ0MzI4ZmU4MTcxOWU5MTZiOTQ2ZTIyNjYwNDc5ZTMxNTYxYmIwYi9wYWNrYWdlcy9zaGFyZWQvc2hhbGxvd0VxdWFsLmpzI0wzNi1MNjhcbmV4cG9ydCBmdW5jdGlvbiBzaGFsbG93RXF1YWwob2JqQSwgb2JqQikge1xuICBpZiAoaXMob2JqQSwgb2JqQikpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG5cbiAgaWYgKCFvYmpBIHx8ICFvYmpCIHx8IHR5cGVvZiBvYmpBICE9PSAnb2JqZWN0JyB8fCB0eXBlb2Ygb2JqQiAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBrZXlzQSA9IE9iamVjdC5rZXlzKG9iakEpO1xuICBjb25zdCBrZXlzQiA9IE9iamVjdC5rZXlzKG9iakIpO1xuXG4gIGlmIChrZXlzQS5sZW5ndGggIT09IGtleXNCLmxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGtleXNBLnNvcnQoKTtcbiAga2V5c0Iuc29ydCgpO1xuXG4gIC8vIFRlc3QgZm9yIEEncyBrZXlzIGRpZmZlcmVudCBmcm9tIEIuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwga2V5c0EubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBpZiAoIWhhcyhvYmpCLCBrZXlzQVtpXSkgfHwgIWlzKG9iakFba2V5c0FbaV1dLCBvYmpCW2tleXNBW2ldXSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRW1wdHlWYWx1ZShyZW5kZXJlZFZhbHVlKSB7XG4gIHJldHVybiByZW5kZXJlZFZhbHVlID09PSBudWxsIHx8IHJlbmRlcmVkVmFsdWUgPT09IGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyZWREaXZlKG5vZGVzKSB7XG4gIGlmIChpc0VtcHR5VmFsdWUobm9kZXMpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gW10uY29uY2F0KG5vZGVzKS5ldmVyeSgobikgPT4ge1xuICAgIGlmIChuKSB7XG4gICAgICBjb25zdCB7IHJlbmRlcmVkIH0gPSBuO1xuICAgICAgcmV0dXJuIGlzRW1wdHlWYWx1ZShyZW5kZXJlZCkgfHwgcmVuZGVyZWREaXZlKHJlbmRlcmVkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaXNFbXB0eVZhbHVlKG4pO1xuICB9KTtcbn1cbiJdfQ==
//# sourceMappingURL=Utils.js.map