'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.propsOfNode = propsOfNode;
exports.childrenOfNode = childrenOfNode;
exports.hasClassName = hasClassName;
exports.treeForEach = treeForEach;
exports.treeFilter = treeFilter;
exports.findParentNode = findParentNode;
exports.pathToNode = pathToNode;
exports.parentsOfNode = parentsOfNode;
exports.nodeHasId = nodeHasId;
exports.nodeMatchesObjectProps = nodeMatchesObjectProps;
exports.getTextFromNode = getTextFromNode;
exports.getTextFromHostNodes = getTextFromHostNodes;
exports.getHTMLFromHostNodes = getHTMLFromHostNodes;

var _object = require('object.assign');

var _object2 = _interopRequireDefault(_object);

var _arrayPrototype = require('array.prototype.flat');

var _arrayPrototype2 = _interopRequireDefault(_arrayPrototype);

var _object3 = require('object.entries');

var _object4 = _interopRequireDefault(_object3);

var _isSubset = require('is-subset');

var _isSubset2 = _interopRequireDefault(_isSubset);

var _functionPrototype = require('function.prototype.name');

var _functionPrototype2 = _interopRequireDefault(_functionPrototype);

var _isRegex = require('is-regex');

var _isRegex2 = _interopRequireDefault(_isRegex);

var _getAdapter = require('./getAdapter');

var _getAdapter2 = _interopRequireDefault(_getAdapter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function propsOfNode(node) {
  return node && node.props || {};
}

function childrenOfNode(node) {
  if (!node) return [];

  var adapter = (0, _getAdapter2['default'])();
  var adapterHasIsFragment = adapter.isFragment && typeof adapter.isFragment === 'function';

  var renderedArray = Array.isArray(node.rendered) ? (0, _arrayPrototype2['default'])(node.rendered, 1) : [node.rendered];

  // React adapters before 16 will not have isFragment
  if (!adapterHasIsFragment) {
    return renderedArray;
  }

  return (0, _arrayPrototype2['default'])(renderedArray.map(function (currentChild) {
    // If the node is a Fragment, we want to return its children, not the fragment itself
    if (adapter.isFragment(currentChild)) {
      return childrenOfNode(currentChild);
    }

    return currentChild;
  }), 1);
}

function hasClassName(node, className) {
  var classes = propsOfNode(node).className || '';
  classes = String(classes).replace(/\s/g, ' ');
  if ((0, _isRegex2['default'])(className)) return className.test(classes);
  return (' ' + String(classes) + ' ').indexOf(' ' + String(className) + ' ') > -1;
}

function treeForEach(tree, fn) {
  if (tree) {
    fn(tree);
  }
  childrenOfNode(tree).forEach(function (node) {
    return treeForEach(node, fn);
  });
}

function treeFilter(tree, fn) {
  var results = [];
  treeForEach(tree, function (node) {
    if (fn(node)) {
      results.push(node);
    }
  });
  return results;
}

/**
 * To support sibling selectors we need to be able to find
 * the siblings of a node. The easiest way to do that is find
 * the parent of the node and access its children.
 *
 * This would be unneeded if the RST spec included sibling pointers
 * such as node.nextSibling and node.prevSibling
 * @param {*} root
 * @param {*} targetNode
 */
function findParentNode(root, targetNode) {
  var results = treeFilter(root, function (node) {
    if (!node.rendered) {
      return false;
    }

    return childrenOfNode(node).indexOf(targetNode) !== -1;
  });
  return results[0] || null;
}

function pathFilter(path, fn) {
  return path.filter(function (tree) {
    return treeFilter(tree, fn).length !== 0;
  });
}

function pathToNode(node, root) {
  var queue = [root];
  var path = [];

  var hasNode = function hasNode(testNode) {
    return node === testNode;
  };

  while (queue.length) {
    var current = queue.pop();
    var children = childrenOfNode(current);
    if (current === node) return pathFilter(path, hasNode);

    path.push(current);

    if (children.length === 0) {
      // leaf node. if it isn't the node we are looking for, we pop.
      path.pop();
    }
    queue.push.apply(queue, _toConsumableArray(children));
  }

  return null;
}

function parentsOfNode(node, root) {
  return (pathToNode(node, root) || []).reverse();
}

function nodeHasId(node, id) {
  return propsOfNode(node).id === id;
}

var CAN_NEVER_MATCH = {};
function replaceUndefined(v) {
  return typeof v !== 'undefined' ? v : CAN_NEVER_MATCH;
}
function replaceUndefinedValues(obj) {
  return (0, _object4['default'])(obj).reduce(function (acc, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        k = _ref2[0],
        v = _ref2[1];

    return (0, _object2['default'])({}, acc, _defineProperty({}, k, replaceUndefined(v)));
  }, {});
}

function nodeMatchesObjectProps(node, props) {
  return (0, _isSubset2['default'])(propsOfNode(node), replaceUndefinedValues(props));
}

function getTextFromHostNode(hostNode) {
  if (typeof hostNode === 'string') {
    return String(hostNode || '');
  }
  if (!hostNode) {
    return '';
  }
  return hostNode.textContent || '';
}

function getTextFromRSTNode(node, _ref3) {
  var getCustom = _ref3.getCustom,
      handleHostNodes = _ref3.handleHostNodes,
      recurse = _ref3.recurse,
      _ref3$nullRenderRetur = _ref3.nullRenderReturnsNull,
      nullRenderReturnsNull = _ref3$nullRenderRetur === undefined ? false : _ref3$nullRenderRetur;

  if (node == null) {
    return '';
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (getCustom && node.type && typeof node.type === 'function') {
    return getCustom(node);
  }

  if (handleHostNodes && node.nodeType === 'host') {
    return handleHostNodes(node);
  }
  if (node.rendered == null && nullRenderReturnsNull) {
    return null;
  }
  return childrenOfNode(node).map(recurse).join('');
}

function getTextFromNode(node) {
  return getTextFromRSTNode(node, {
    recurse: getTextFromNode,
    getCustom: function () {
      function getCustom(_ref4) {
        var type = _ref4.type;

        return '<' + String(type.displayName || (0, _functionPrototype2['default'])(type)) + ' />';
      }

      return getCustom;
    }()
  });
}

function getTextFromHostNodes(node, adapter) {
  return getTextFromRSTNode(node, {
    recurse: function () {
      function recurse(item) {
        return getTextFromHostNodes(item, adapter);
      }

      return recurse;
    }(),
    handleHostNodes: function () {
      function handleHostNodes(item) {
        var nodes = [].concat(adapter.nodeToHostNode(item, true));
        return nodes.map(getTextFromHostNode).join('');
      }

      return handleHostNodes;
    }()
  });
}

function getHTMLFromHostNode(hostNode) {
  if (hostNode == null) {
    return null;
  }
  return hostNode.outerHTML.replace(/\sdata-(reactid|reactroot)+="([^"]*)+"/g, '');
}

function getHTMLFromHostNodes(node, adapter) {
  return getTextFromRSTNode(node, {
    recurse: function () {
      function recurse(item) {
        return getHTMLFromHostNodes(item, adapter);
      }

      return recurse;
    }(),
    handleHostNodes: function () {
      function handleHostNodes(item) {
        var nodes = [].concat(adapter.nodeToHostNode(item, true));
        return nodes.map(getHTMLFromHostNode).join('');
      }

      return handleHostNodes;
    }(),

    nullRenderReturnsNull: true
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9SU1RUcmF2ZXJzYWwuanMiXSwibmFtZXMiOlsicHJvcHNPZk5vZGUiLCJjaGlsZHJlbk9mTm9kZSIsImhhc0NsYXNzTmFtZSIsInRyZWVGb3JFYWNoIiwidHJlZUZpbHRlciIsImZpbmRQYXJlbnROb2RlIiwicGF0aFRvTm9kZSIsInBhcmVudHNPZk5vZGUiLCJub2RlSGFzSWQiLCJub2RlTWF0Y2hlc09iamVjdFByb3BzIiwiZ2V0VGV4dEZyb21Ob2RlIiwiZ2V0VGV4dEZyb21Ib3N0Tm9kZXMiLCJnZXRIVE1MRnJvbUhvc3ROb2RlcyIsIm5vZGUiLCJwcm9wcyIsImFkYXB0ZXIiLCJhZGFwdGVySGFzSXNGcmFnbWVudCIsImlzRnJhZ21lbnQiLCJyZW5kZXJlZEFycmF5IiwiQXJyYXkiLCJpc0FycmF5IiwicmVuZGVyZWQiLCJtYXAiLCJjdXJyZW50Q2hpbGQiLCJjbGFzc05hbWUiLCJjbGFzc2VzIiwiU3RyaW5nIiwicmVwbGFjZSIsInRlc3QiLCJpbmRleE9mIiwidHJlZSIsImZuIiwiZm9yRWFjaCIsInJlc3VsdHMiLCJwdXNoIiwicm9vdCIsInRhcmdldE5vZGUiLCJwYXRoRmlsdGVyIiwicGF0aCIsImZpbHRlciIsImxlbmd0aCIsInF1ZXVlIiwiaGFzTm9kZSIsInRlc3ROb2RlIiwiY3VycmVudCIsInBvcCIsImNoaWxkcmVuIiwicmV2ZXJzZSIsImlkIiwiQ0FOX05FVkVSX01BVENIIiwicmVwbGFjZVVuZGVmaW5lZCIsInYiLCJyZXBsYWNlVW5kZWZpbmVkVmFsdWVzIiwib2JqIiwicmVkdWNlIiwiYWNjIiwiayIsImdldFRleHRGcm9tSG9zdE5vZGUiLCJob3N0Tm9kZSIsInRleHRDb250ZW50IiwiZ2V0VGV4dEZyb21SU1ROb2RlIiwiZ2V0Q3VzdG9tIiwiaGFuZGxlSG9zdE5vZGVzIiwicmVjdXJzZSIsIm51bGxSZW5kZXJSZXR1cm5zTnVsbCIsInR5cGUiLCJub2RlVHlwZSIsImpvaW4iLCJkaXNwbGF5TmFtZSIsIml0ZW0iLCJub2RlcyIsImNvbmNhdCIsIm5vZGVUb0hvc3ROb2RlIiwiZ2V0SFRNTEZyb21Ib3N0Tm9kZSIsIm91dGVySFRNTCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7UUFPZ0JBLFcsR0FBQUEsVztRQUlBQyxjLEdBQUFBLGM7UUF1QkFDLFksR0FBQUEsWTtRQU9BQyxXLEdBQUFBLFc7UUFPQUMsVSxHQUFBQSxVO1FBb0JBQyxjLEdBQUFBLGM7UUFrQkFDLFUsR0FBQUEsVTtRQXVCQUMsYSxHQUFBQSxhO1FBSUFDLFMsR0FBQUEsUztRQWFBQyxzQixHQUFBQSxzQjtRQXlDQUMsZSxHQUFBQSxlO1FBU0FDLG9CLEdBQUFBLG9CO1FBbUJBQyxvQixHQUFBQSxvQjs7Ozs7O0FBbk1oQjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7QUFFTyxTQUFTWixXQUFULENBQXFCYSxJQUFyQixFQUEyQjtBQUNoQyxTQUFRQSxRQUFRQSxLQUFLQyxLQUFkLElBQXdCLEVBQS9CO0FBQ0Q7O0FBRU0sU0FBU2IsY0FBVCxDQUF3QlksSUFBeEIsRUFBOEI7QUFDbkMsTUFBSSxDQUFDQSxJQUFMLEVBQVcsT0FBTyxFQUFQOztBQUVYLE1BQU1FLFVBQVUsOEJBQWhCO0FBQ0EsTUFBTUMsdUJBQXVCRCxRQUFRRSxVQUFSLElBQXNCLE9BQU9GLFFBQVFFLFVBQWYsS0FBOEIsVUFBakY7O0FBRUEsTUFBTUMsZ0JBQWdCQyxNQUFNQyxPQUFOLENBQWNQLEtBQUtRLFFBQW5CLElBQStCLGlDQUFLUixLQUFLUSxRQUFWLEVBQW9CLENBQXBCLENBQS9CLEdBQXdELENBQUNSLEtBQUtRLFFBQU4sQ0FBOUU7O0FBRUE7QUFDQSxNQUFJLENBQUNMLG9CQUFMLEVBQTJCO0FBQ3pCLFdBQU9FLGFBQVA7QUFDRDs7QUFFRCxTQUFPLGlDQUFLQSxjQUFjSSxHQUFkLENBQWtCLFVBQUNDLFlBQUQsRUFBa0I7QUFDOUM7QUFDQSxRQUFJUixRQUFRRSxVQUFSLENBQW1CTSxZQUFuQixDQUFKLEVBQXNDO0FBQ3BD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NkI7QUFBQTs7QUFROUJILDJCQUF1QjtBQVJPLEdBQXpCLENBQVA7QUFVRCIsImZpbGUiOiJSU1RUcmF2ZXJzYWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZmxhdCBmcm9tICdhcnJheS5wcm90b3R5cGUuZmxhdCc7XG5pbXBvcnQgZW50cmllcyBmcm9tICdvYmplY3QuZW50cmllcyc7XG5pbXBvcnQgaXNTdWJzZXQgZnJvbSAnaXMtc3Vic2V0JztcbmltcG9ydCBmdW5jdGlvbk5hbWUgZnJvbSAnZnVuY3Rpb24ucHJvdG90eXBlLm5hbWUnO1xuaW1wb3J0IGlzUmVnZXggZnJvbSAnaXMtcmVnZXgnO1xuaW1wb3J0IGdldEFkYXB0ZXIgZnJvbSAnLi9nZXRBZGFwdGVyJztcblxuZXhwb3J0IGZ1bmN0aW9uIHByb3BzT2ZOb2RlKG5vZGUpIHtcbiAgcmV0dXJuIChub2RlICYmIG5vZGUucHJvcHMpIHx8IHt9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2hpbGRyZW5PZk5vZGUobm9kZSkge1xuICBpZiAoIW5vZGUpIHJldHVybiBbXTtcblxuICBjb25zdCBhZGFwdGVyID0gZ2V0QWRhcHRlcigpO1xuICBjb25zdCBhZGFwdGVySGFzSXNGcmFnbWVudCA9IGFkYXB0ZXIuaXNGcmFnbWVudCAmJiB0eXBlb2YgYWRhcHRlci5pc0ZyYWdtZW50ID09PSAnZnVuY3Rpb24nO1xuXG4gIGNvbnN0IHJlbmRlcmVkQXJyYXkgPSBBcnJheS5pc0FycmF5KG5vZGUucmVuZGVyZWQpID8gZmxhdChub2RlLnJlbmRlcmVkLCAxKSA6IFtub2RlLnJlbmRlcmVkXTtcblxuICAvLyBSZWFjdCBhZGFwdGVycyBiZWZvcmUgMTYgd2lsbCBub3QgaGF2ZSBpc0ZyYWdtZW50XG4gIGlmICghYWRhcHRlckhhc0lzRnJhZ21lbnQpIHtcbiAgICByZXR1cm4gcmVuZGVyZWRBcnJheTtcbiAgfVxuXG4gIHJldHVybiBmbGF0KHJlbmRlcmVkQXJyYXkubWFwKChjdXJyZW50Q2hpbGQpID0+IHtcbiAgICAvLyBJZiB0aGUgbm9kZSBpcyBhIEZyYWdtZW50LCB3ZSB3YW50IHRvIHJldHVybiBpdHMgY2hpbGRyZW4sIG5vdCB0aGUgZnJhZ21lbnQgaXRzZWxmXG4gICAgaWYgKGFkYXB0ZXIuaXNGcmFnbWVudChjdXJyZW50Q2hpbGQpKSB7XG4gICAgICByZXR1cm4gY2hpbGRyZW5PZk5vZGUoY3VycmVudENoaWxkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY3VycmVudENoaWxkO1xuICB9KSwgMSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNDbGFzc05hbWUobm9kZSwgY2xhc3NOYW1lKSB7XG4gIGxldCBjbGFzc2VzID0gcHJvcHNPZk5vZGUobm9kZSkuY2xhc3NOYW1lIHx8ICcnO1xuICBjbGFzc2VzID0gU3RyaW5nKGNsYXNzZXMpLnJlcGxhY2UoL1xccy9nLCAnICcpO1xuICBpZiAoaXNSZWdleChjbGFzc05hbWUpKSByZXR1cm4gY2xhc3NOYW1lLnRlc3QoY2xhc3Nlcyk7XG4gIHJldHVybiBgICR7Y2xhc3Nlc30gYC5pbmRleE9mKGAgJHtjbGFzc05hbWV9IGApID4gLTE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmVlRm9yRWFjaCh0cmVlLCBmbikge1xuICBpZiAodHJlZSkge1xuICAgIGZuKHRyZWUpO1xuICB9XG4gIGNoaWxkcmVuT2ZOb2RlKHRyZWUpLmZvckVhY2gobm9kZSA9PiB0cmVlRm9yRWFjaChub2RlLCBmbikpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJlZUZpbHRlcih0cmVlLCBmbikge1xuICBjb25zdCByZXN1bHRzID0gW107XG4gIHRyZWVGb3JFYWNoKHRyZWUsIChub2RlKSA9PiB7XG4gICAgaWYgKGZuKG5vZGUpKSB7XG4gICAgICByZXN1bHRzLnB1c2gobm9kZSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdHM7XG59XG5cbi8qKlxuICogVG8gc3VwcG9ydCBzaWJsaW5nIHNlbGVjdG9ycyB3ZSBuZWVkIHRvIGJlIGFibGUgdG8gZmluZFxuICogdGhlIHNpYmxpbmdzIG9mIGEgbm9kZS4gVGhlIGVhc2llc3Qgd2F5IHRvIGRvIHRoYXQgaXMgZmluZFxuICogdGhlIHBhcmVudCBvZiB0aGUgbm9kZSBhbmQgYWNjZXNzIGl0cyBjaGlsZHJlbi5cbiAqXG4gKiBUaGlzIHdvdWxkIGJlIHVubmVlZGVkIGlmIHRoZSBSU1Qgc3BlYyBpbmNsdWRlZCBzaWJsaW5nIHBvaW50ZXJzXG4gKiBzdWNoIGFzIG5vZGUubmV4dFNpYmxpbmcgYW5kIG5vZGUucHJldlNpYmxpbmdcbiAqIEBwYXJhbSB7Kn0gcm9vdFxuICogQHBhcmFtIHsqfSB0YXJnZXROb2RlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kUGFyZW50Tm9kZShyb290LCB0YXJnZXROb2RlKSB7XG4gIGNvbnN0IHJlc3VsdHMgPSB0cmVlRmlsdGVyKFxuICAgIHJvb3QsXG4gICAgKG5vZGUpID0+IHtcbiAgICAgIGlmICghbm9kZS5yZW5kZXJlZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjaGlsZHJlbk9mTm9kZShub2RlKS5pbmRleE9mKHRhcmdldE5vZGUpICE9PSAtMTtcbiAgICB9LFxuICApO1xuICByZXR1cm4gcmVzdWx0c1swXSB8fCBudWxsO1xufVxuXG5mdW5jdGlvbiBwYXRoRmlsdGVyKHBhdGgsIGZuKSB7XG4gIHJldHVybiBwYXRoLmZpbHRlcih0cmVlID0+IHRyZWVGaWx0ZXIodHJlZSwgZm4pLmxlbmd0aCAhPT0gMCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXRoVG9Ob2RlKG5vZGUsIHJvb3QpIHtcbiAgY29uc3QgcXVldWUgPSBbcm9vdF07XG4gIGNvbnN0IHBhdGggPSBbXTtcblxuICBjb25zdCBoYXNOb2RlID0gdGVzdE5vZGUgPT4gbm9kZSA9PT0gdGVzdE5vZGU7XG5cbiAgd2hpbGUgKHF1ZXVlLmxlbmd0aCkge1xuICAgIGNvbnN0IGN1cnJlbnQgPSBxdWV1ZS5wb3AoKTtcbiAgICBjb25zdCBjaGlsZHJlbiA9IGNoaWxkcmVuT2ZOb2RlKGN1cnJlbnQpO1xuICAgIGlmIChjdXJyZW50ID09PSBub2RlKSByZXR1cm4gcGF0aEZpbHRlcihwYXRoLCBoYXNOb2RlKTtcblxuICAgIHBhdGgucHVzaChjdXJyZW50KTtcblxuICAgIGlmIChjaGlsZHJlbi5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIGxlYWYgbm9kZS4gaWYgaXQgaXNuJ3QgdGhlIG5vZGUgd2UgYXJlIGxvb2tpbmcgZm9yLCB3ZSBwb3AuXG4gICAgICBwYXRoLnBvcCgpO1xuICAgIH1cbiAgICBxdWV1ZS5wdXNoKC4uLmNoaWxkcmVuKTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyZW50c09mTm9kZShub2RlLCByb290KSB7XG4gIHJldHVybiAocGF0aFRvTm9kZShub2RlLCByb290KSB8fCBbXSkucmV2ZXJzZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbm9kZUhhc0lkKG5vZGUsIGlkKSB7XG4gIHJldHVybiBwcm9wc09mTm9kZShub2RlKS5pZCA9PT0gaWQ7XG59XG5cbmNvbnN0IENBTl9ORVZFUl9NQVRDSCA9IHt9O1xuZnVuY3Rpb24gcmVwbGFjZVVuZGVmaW5lZCh2KSB7XG4gIHJldHVybiB0eXBlb2YgdiAhPT0gJ3VuZGVmaW5lZCcgPyB2IDogQ0FOX05FVkVSX01BVENIO1xufVxuZnVuY3Rpb24gcmVwbGFjZVVuZGVmaW5lZFZhbHVlcyhvYmopIHtcbiAgcmV0dXJuIGVudHJpZXMob2JqKVxuICAgIC5yZWR1Y2UoKGFjYywgW2ssIHZdKSA9PiAoeyAuLi5hY2MsIFtrXTogcmVwbGFjZVVuZGVmaW5lZCh2KSB9KSwge30pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbm9kZU1hdGNoZXNPYmplY3RQcm9wcyhub2RlLCBwcm9wcykge1xuICByZXR1cm4gaXNTdWJzZXQocHJvcHNPZk5vZGUobm9kZSksIHJlcGxhY2VVbmRlZmluZWRWYWx1ZXMocHJvcHMpKTtcbn1cblxuZnVuY3Rpb24gZ2V0VGV4dEZyb21Ib3N0Tm9kZShob3N0Tm9kZSkge1xuICBpZiAodHlwZW9mIGhvc3ROb2RlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBTdHJpbmcoaG9zdE5vZGUgfHwgJycpO1xuICB9XG4gIGlmICghaG9zdE5vZGUpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgcmV0dXJuIGhvc3ROb2RlLnRleHRDb250ZW50IHx8ICcnO1xufVxuXG5mdW5jdGlvbiBnZXRUZXh0RnJvbVJTVE5vZGUobm9kZSwge1xuICBnZXRDdXN0b20sXG4gIGhhbmRsZUhvc3ROb2RlcyxcbiAgcmVjdXJzZSxcbiAgbnVsbFJlbmRlclJldHVybnNOdWxsID0gZmFsc2UsXG59KSB7XG4gIGlmIChub2RlID09IG51bGwpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICBpZiAodHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBub2RlID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiBTdHJpbmcobm9kZSk7XG4gIH1cblxuICBpZiAoZ2V0Q3VzdG9tICYmIG5vZGUudHlwZSAmJiB0eXBlb2Ygbm9kZS50eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGdldEN1c3RvbShub2RlKTtcbiAgfVxuXG4gIGlmIChoYW5kbGVIb3N0Tm9kZXMgJiYgbm9kZS5ub2RlVHlwZSA9PT0gJ2hvc3QnKSB7XG4gICAgcmV0dXJuIGhhbmRsZUhvc3ROb2Rlcyhub2RlKTtcbiAgfVxuICBpZiAobm9kZS5yZW5kZXJlZCA9PSBudWxsICYmIG51bGxSZW5kZXJSZXR1cm5zTnVsbCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiBjaGlsZHJlbk9mTm9kZShub2RlKS5tYXAocmVjdXJzZSkuam9pbignJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUZXh0RnJvbU5vZGUobm9kZSkge1xuICByZXR1cm4gZ2V0VGV4dEZyb21SU1ROb2RlKG5vZGUsIHtcbiAgICByZWN1cnNlOiBnZXRUZXh0RnJvbU5vZGUsXG4gICAgZ2V0Q3VzdG9tKHsgdHlwZSB9KSB7XG4gICAgICByZXR1cm4gYDwke3R5cGUuZGlzcGxheU5hbWUgfHwgZnVuY3Rpb25OYW1lKHR5cGUpfSAvPmA7XG4gICAgfSxcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUZXh0RnJvbUhvc3ROb2Rlcyhub2RlLCBhZGFwdGVyKSB7XG4gIHJldHVybiBnZXRUZXh0RnJvbVJTVE5vZGUobm9kZSwge1xuICAgIHJlY3Vyc2UoaXRlbSkge1xuICAgICAgcmV0dXJuIGdldFRleHRGcm9tSG9zdE5vZGVzKGl0ZW0sIGFkYXB0ZXIpO1xuICAgIH0sXG4gICAgaGFuZGxlSG9zdE5vZGVzKGl0ZW0pIHtcbiAgICAgIGNvbnN0IG5vZGVzID0gW10uY29uY2F0KGFkYXB0ZXIubm9kZVRvSG9zdE5vZGUoaXRlbSwgdHJ1ZSkpO1xuICAgICAgcmV0dXJuIG5vZGVzLm1hcChnZXRUZXh0RnJvbUhvc3ROb2RlKS5qb2luKCcnKTtcbiAgICB9LFxuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0SFRNTEZyb21Ib3N0Tm9kZShob3N0Tm9kZSkge1xuICBpZiAoaG9zdE5vZGUgPT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiBob3N0Tm9kZS5vdXRlckhUTUwucmVwbGFjZSgvXFxzZGF0YS0ocmVhY3RpZHxyZWFjdHJvb3QpKz1cIihbXlwiXSopK1wiL2csICcnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEhUTUxGcm9tSG9zdE5vZGVzKG5vZGUsIGFkYXB0ZXIpIHtcbiAgcmV0dXJuIGdldFRleHRGcm9tUlNUTm9kZShub2RlLCB7XG4gICAgcmVjdXJzZShpdGVtKSB7XG4gICAgICByZXR1cm4gZ2V0SFRNTEZyb21Ib3N0Tm9kZXMoaXRlbSwgYWRhcHRlcik7XG4gICAgfSxcbiAgICBoYW5kbGVIb3N0Tm9kZXMoaXRlbSkge1xuICAgICAgY29uc3Qgbm9kZXMgPSBbXS5jb25jYXQoYWRhcHRlci5ub2RlVG9Ib3N0Tm9kZShpdGVtLCB0cnVlKSk7XG4gICAgICByZXR1cm4gbm9kZXMubWFwKGdldEhUTUxGcm9tSG9zdE5vZGUpLmpvaW4oJycpO1xuICAgIH0sXG4gICAgbnVsbFJlbmRlclJldHVybnNOdWxsOiB0cnVlLFxuICB9KTtcbn1cbiJdfQ==
//# sourceMappingURL=RSTTraversal.js.map