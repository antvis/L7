'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.typeName = typeName;
exports.spaces = spaces;
exports.indent = indent;
exports.debugNode = debugNode;
exports.debugNodes = debugNodes;

var _lodash = require('lodash.escape');

var _lodash2 = _interopRequireDefault(_lodash);

var _functionPrototype = require('function.prototype.name');

var _functionPrototype2 = _interopRequireDefault(_functionPrototype);

var _isString = require('is-string');

var _isString2 = _interopRequireDefault(_isString);

var _isNumberObject = require('is-number-object');

var _isNumberObject2 = _interopRequireDefault(_isNumberObject);

var _isCallable = require('is-callable');

var _isCallable2 = _interopRequireDefault(_isCallable);

var _isBooleanObject = require('is-boolean-object');

var _isBooleanObject2 = _interopRequireDefault(_isBooleanObject);

var _objectInspect = require('object-inspect');

var _objectInspect2 = _interopRequireDefault(_objectInspect);

var _has = require('has');

var _has2 = _interopRequireDefault(_has);

var _RSTTraversal = require('./RSTTraversal');

var _getAdapter = require('./getAdapter');

var _getAdapter2 = _interopRequireDefault(_getAdapter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var booleanValue = Function.bind.call(Function.call, Boolean.prototype.valueOf);

function typeName(node) {
  var adapter = (0, _getAdapter2['default'])();
  if (adapter.displayNameOfNode) {
    return (0, _getAdapter2['default'])().displayNameOfNode(node) || 'Component';
  }
  return typeof node.type === 'function' ? node.type.displayName || (0, _functionPrototype2['default'])(node.type) || 'Component' : node.type;
}

function spaces(n) {
  return Array(n + 1).join(' ');
}

function indent(depth, string) {
  return string.split('\n').map(function (x) {
    return '' + String(spaces(depth)) + String(x);
  }).join('\n');
}

function propString(prop, options) {
  if ((0, _isString2['default'])(prop)) {
    return (0, _objectInspect2['default'])(String(prop), { quoteStyle: 'double' });
  }
  if ((0, _isNumberObject2['default'])(prop)) {
    return '{' + String((0, _objectInspect2['default'])(Number(prop))) + '}';
  }
  if ((0, _isBooleanObject2['default'])(prop)) {
    return '{' + String((0, _objectInspect2['default'])(booleanValue(prop))) + '}';
  }
  if ((0, _isCallable2['default'])(prop)) {
    return '{' + String((0, _objectInspect2['default'])(prop)) + '}';
  }
  if ((typeof prop === 'undefined' ? 'undefined' : _typeof(prop)) === 'object') {
    if (options.verbose) {
      return '{' + String((0, _objectInspect2['default'])(prop)) + '}';
    }

    return '{{...}}';
  }
  return '{[' + (typeof prop === 'undefined' ? 'undefined' : _typeof(prop)) + ']}';
}

function propsString(node, options) {
  var props = (0, _RSTTraversal.propsOfNode)(node);
  var keys = Object.keys(props).filter(function (x) {
    return x !== 'children';
  });
  return keys.map(function (key) {
    return String(key) + '=' + String(propString(props[key], options));
  }).join(' ');
}

function indentChildren(childrenStrs, indentLength) {
  return childrenStrs.length ? '\n' + String(childrenStrs.map(function (x) {
    return indent(indentLength, x);
  }).join('\n')) + '\n' : '';
}

function isRSTNodeLike(node) {
  return (0, _has2['default'])(node, 'nodeType') && typeof node.nodeType === 'string' && (0, _has2['default'])(node, 'type') && (0, _has2['default'])(node, 'key') && (0, _has2['default'])(node, 'ref') && (0, _has2['default'])(node, 'instance') && (0, _has2['default'])(node, 'rendered');
}

function debugNode(node) {
  var indentLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (typeof node === 'string' || typeof node === 'number') return (0, _lodash2['default'])(node);
  if (typeof node === 'function') {
    var name = (0, _functionPrototype2['default'])(node);
    return '[function' + (name ? ' ' + String(name) : '') + ']';
  }
  if (!node) return '';

  var adapter = (0, _getAdapter2['default'])();
  if (!adapter.isValidElement(node) && !isRSTNodeLike(node)) {
    return '{' + String((0, _objectInspect2['default'])(node)) + '}';
  }

  var childrenStrs = (0, _RSTTraversal.childrenOfNode)(node).map(function (n) {
    return debugNode(n, indentLength, options);
  }).filter(Boolean);
  var type = typeName(node);

  var props = options.ignoreProps ? '' : propsString(node, options);
  var beforeProps = props ? ' ' : '';
  var afterProps = childrenStrs.length ? '>' : ' ';
  var childrenIndented = indentChildren(childrenStrs, indentLength);
  var nodeClose = childrenStrs.length ? '</' + String(type) + '>' : '/>';
  return '<' + String(type) + beforeProps + String(props) + afterProps + String(childrenIndented) + nodeClose;
}

function debugNodes(nodes) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return nodes.map(function (node) {
    return debugNode(node, undefined, options);
  }).join('\n\n\n');
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9EZWJ1Zy5qcyJdLCJuYW1lcyI6WyJ0eXBlTmFtZSIsInNwYWNlcyIsImluZGVudCIsImRlYnVnTm9kZSIsImRlYnVnTm9kZXMiLCJib29sZWFuVmFsdWUiLCJGdW5jdGlvbiIsImJpbmQiLCJjYWxsIiwiQm9vbGVhbiIsInByb3RvdHlwZSIsInZhbHVlT2YiLCJub2RlIiwiYWRhcHRlciIsImRpc3BsYXlOYW1lT2ZOb2RlIiwidHlwZSIsImRpc3BsYXlOYW1lIiwibiIsIkFycmF5Iiwiam9pbiIsImRlcHRoIiwic3RyaW5nIiwic3BsaXQiLCJtYXAiLCJ4IiwicHJvcFN0cmluZyIsInByb3AiLCJvcHRpb25zIiwiU3RyaW5nIiwicXVvdGVTdHlsZSIsIk51bWJlciIsInZlcmJvc2UiLCJwcm9wc1N0cmluZyIsInByb3BzIiwia2V5cyIsIk9iamVjdCIsImZpbHRlciIsImtleSIsImluZGVudENoaWxkcmVuIiwiY2hpbGRyZW5TdHJzIiwiaW5kZW50TGVuZ3RoIiwibGVuZ3RoIiwiaXNSU1ROb2RlTGlrZSIsIm5vZGVUeXBlIiwibmFtZSIsImlzVmFsaWRFbGVtZW50IiwiaWdub3JlUHJvcHMiLCJiZWZvcmVQcm9wcyIsImFmdGVyUHJvcHMiLCJjaGlsZHJlbkluZGVudGVkIiwibm9kZUNsb3NlIiwibm9kZXMiLCJ1bmRlZmluZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O1FBaUJnQkEsUSxHQUFBQSxRO1FBVUFDLE0sR0FBQUEsTTtRQUlBQyxNLEdBQUFBLE07UUFpREFDLFMsR0FBQUEsUztRQTRCQUMsVSxHQUFBQSxVOztBQTVHaEI7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOztBQUlBOzs7Ozs7QUFFQSxJQUFNQyxlQUFlQyxTQUFTQyxJQUFULENBQWNDLElBQWQsQ0FBbUJGLFNBQVNFLElBQTVCLEVBQWtDQyxRQUFRQyxTQUFSLENBQWtCQyxPQUFwRCxDQUFyQjs7QUFF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YUFBYUUsTUFBYixHQUNmLEdBRGUsR0FFZixHQUZKO0FBR0EsTUFBTVEsbUJBQW1CWCxlQUFlQyxZQUFmLEVBQTZCQyxZQUE3QixDQUF6QjtBQUNBLE1BQU1VLFlBQVlYLGFBQWFFLE1BQWIsaUJBQTJCMUIsSUFBM0IsVUFBcUMsSUFBdkQ7QUFDQSxzQkFBV0EsSUFBWCxJQUFrQmdDLFdBQWxCLFVBQWdDZCxLQUFoQyxJQUF3Q2UsVUFBeEMsVUFBcURDLGdCQUFyRCxJQUF3RUMsU0FBeEU7QUFDRDs7QUFFTSxTQUFTOUMsVUFBVCxDQUFvQitDLEtBQXBCLEVBQXlDO0FBQUEsTUFBZHhCLE9BQWMsdUVBQUosRUFBSTs7QUFDOUMsU0FBT3dCLE1BQU01QixHQUFOLENBQVU7QUFBQSxXQUFRcEIsVUFBVVMsSUFBVixFQUFnQndDLFNBQWhCLEVBQTJCekIsT0FBM0IsQ0FBUjtBQUFBLEdBQVYsRUFBdURSLElBQXZELENBQTRELFFBQTVELENBQVA7QUFDRCIsImZpbGUiOiJEZWJ1Zy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBlc2NhcGUgZnJvbSAnbG9kYXNoLmVzY2FwZSc7XG5pbXBvcnQgZnVuY3Rpb25OYW1lIGZyb20gJ2Z1bmN0aW9uLnByb3RvdHlwZS5uYW1lJztcbmltcG9ydCBpc1N0cmluZyBmcm9tICdpcy1zdHJpbmcnO1xuaW1wb3J0IGlzTnVtYmVyIGZyb20gJ2lzLW51bWJlci1vYmplY3QnO1xuaW1wb3J0IGlzQ2FsbGFibGUgZnJvbSAnaXMtY2FsbGFibGUnO1xuaW1wb3J0IGlzQm9vbGVhbiBmcm9tICdpcy1ib29sZWFuLW9iamVjdCc7XG5pbXBvcnQgaW5zcGVjdCBmcm9tICdvYmplY3QtaW5zcGVjdCc7XG5pbXBvcnQgaGFzIGZyb20gJ2hhcyc7XG5cbmltcG9ydCB7XG4gIHByb3BzT2ZOb2RlLFxuICBjaGlsZHJlbk9mTm9kZSxcbn0gZnJvbSAnLi9SU1RUcmF2ZXJzYWwnO1xuaW1wb3J0IGdldEFkYXB0ZXIgZnJvbSAnLi9nZXRBZGFwdGVyJztcblxuY29uc3QgYm9vbGVhblZhbHVlID0gRnVuY3Rpb24uYmluZC5jYWxsKEZ1bmN0aW9uLmNhbGwsIEJvb2xlYW4ucHJvdG90eXBlLnZhbHVlT2YpO1xuXG5leHBvcnQgZnVuY3Rpb24gdHlwZU5hbWUobm9kZSkge1xuICBjb25zdCBhZGFwdGVyID0gZ2V0QWRhcHRlcigpO1xuICBpZiAoYWRhcHRlci5kaXNwbGF5TmFtZU9mTm9kZSkge1xuICAgIHJldHVybiBnZXRBZGFwdGVyKCkuZGlzcGxheU5hbWVPZk5vZGUobm9kZSkgfHwgJ0NvbXBvbmVudCc7XG4gIH1cbiAgcmV0dXJuIHR5cGVvZiBub2RlLnR5cGUgPT09ICdmdW5jdGlvbidcbiAgICA/IChub2RlLnR5cGUuZGlzcGxheU5hbWUgfHwgZnVuY3Rpb25OYW1lKG5vZGUudHlwZSkgfHwgJ0NvbXBvbmVudCcpXG4gICAgOiBub2RlLnR5cGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzcGFjZXMobikge1xuICByZXR1cm4gQXJyYXkobiArIDEpLmpvaW4oJyAnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluZGVudChkZXB0aCwgc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcuc3BsaXQoJ1xcbicpLm1hcCh4ID0+IGAke3NwYWNlcyhkZXB0aCl9JHt4fWApLmpvaW4oJ1xcbicpO1xufVxuXG5mdW5jdGlvbiBwcm9wU3RyaW5nKHByb3AsIG9wdGlvbnMpIHtcbiAgaWYgKGlzU3RyaW5nKHByb3ApKSB7XG4gICAgcmV0dXJuIGluc3BlY3QoU3RyaW5nKHByb3ApLCB7IHF1b3RlU3R5bGU6ICdkb3VibGUnIH0pO1xuICB9XG4gIGlmIChpc051bWJlcihwcm9wKSkge1xuICAgIHJldHVybiBgeyR7aW5zcGVjdChOdW1iZXIocHJvcCkpfX1gO1xuICB9XG4gIGlmIChpc0Jvb2xlYW4ocHJvcCkpIHtcbiAgICByZXR1cm4gYHske2luc3BlY3QoYm9vbGVhblZhbHVlKHByb3ApKX19YDtcbiAgfVxuICBpZiAoaXNDYWxsYWJsZShwcm9wKSkge1xuICAgIHJldHVybiBgeyR7aW5zcGVjdChwcm9wKX19YDtcbiAgfVxuICBpZiAodHlwZW9mIHByb3AgPT09ICdvYmplY3QnKSB7XG4gICAgaWYgKG9wdGlvbnMudmVyYm9zZSkge1xuICAgICAgcmV0dXJuIGB7JHtpbnNwZWN0KHByb3ApfX1gO1xuICAgIH1cblxuICAgIHJldHVybiAne3suLi59fSc7XG4gIH1cbiAgcmV0dXJuIGB7WyR7dHlwZW9mIHByb3B9XX1gO1xufVxuXG5mdW5jdGlvbiBwcm9wc1N0cmluZyhub2RlLCBvcHRpb25zKSB7XG4gIGNvbnN0IHByb3BzID0gcHJvcHNPZk5vZGUobm9kZSk7XG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhwcm9wcykuZmlsdGVyKHggPT4geCAhPT0gJ2NoaWxkcmVuJyk7XG4gIHJldHVybiBrZXlzLm1hcChrZXkgPT4gYCR7a2V5fT0ke3Byb3BTdHJpbmcocHJvcHNba2V5XSwgb3B0aW9ucyl9YCkuam9pbignICcpO1xufVxuXG5mdW5jdGlvbiBpbmRlbnRDaGlsZHJlbihjaGlsZHJlblN0cnMsIGluZGVudExlbmd0aCkge1xuICByZXR1cm4gY2hpbGRyZW5TdHJzLmxlbmd0aFxuICAgID8gYFxcbiR7Y2hpbGRyZW5TdHJzLm1hcCh4ID0+IGluZGVudChpbmRlbnRMZW5ndGgsIHgpKS5qb2luKCdcXG4nKX1cXG5gXG4gICAgOiAnJztcbn1cblxuZnVuY3Rpb24gaXNSU1ROb2RlTGlrZShub2RlKSB7XG4gIHJldHVybiBoYXMobm9kZSwgJ25vZGVUeXBlJylcbiAgICAmJiB0eXBlb2Ygbm9kZS5ub2RlVHlwZSA9PT0gJ3N0cmluZydcbiAgICAmJiBoYXMobm9kZSwgJ3R5cGUnKVxuICAgICYmIGhhcyhub2RlLCAna2V5JylcbiAgICAmJiBoYXMobm9kZSwgJ3JlZicpXG4gICAgJiYgaGFzKG5vZGUsICdpbnN0YW5jZScpXG4gICAgJiYgaGFzKG5vZGUsICdyZW5kZXJlZCcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVidWdOb2RlKG5vZGUsIGluZGVudExlbmd0aCA9IDIsIG9wdGlvbnMgPSB7fSkge1xuICBpZiAodHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBub2RlID09PSAnbnVtYmVyJykgcmV0dXJuIGVzY2FwZShub2RlKTtcbiAgaWYgKHR5cGVvZiBub2RlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY29uc3QgbmFtZSA9IGZ1bmN0aW9uTmFtZShub2RlKTtcbiAgICByZXR1cm4gYFtmdW5jdGlvbiR7bmFtZSA/IGAgJHtuYW1lfWAgOiAnJ31dYDtcbiAgfVxuICBpZiAoIW5vZGUpIHJldHVybiAnJztcblxuICBjb25zdCBhZGFwdGVyID0gZ2V0QWRhcHRlcigpO1xuICBpZiAoIWFkYXB0ZXIuaXNWYWxpZEVsZW1lbnQobm9kZSkgJiYgIWlzUlNUTm9kZUxpa2Uobm9kZSkpIHtcbiAgICByZXR1cm4gYHske2luc3BlY3Qobm9kZSl9fWA7XG4gIH1cblxuICBjb25zdCBjaGlsZHJlblN0cnMgPSBjaGlsZHJlbk9mTm9kZShub2RlKVxuICAgIC5tYXAobiA9PiBkZWJ1Z05vZGUobiwgaW5kZW50TGVuZ3RoLCBvcHRpb25zKSlcbiAgICAuZmlsdGVyKEJvb2xlYW4pO1xuICBjb25zdCB0eXBlID0gdHlwZU5hbWUobm9kZSk7XG5cbiAgY29uc3QgcHJvcHMgPSBvcHRpb25zLmlnbm9yZVByb3BzID8gJycgOiBwcm9wc1N0cmluZyhub2RlLCBvcHRpb25zKTtcbiAgY29uc3QgYmVmb3JlUHJvcHMgPSBwcm9wcyA/ICcgJyA6ICcnO1xuICBjb25zdCBhZnRlclByb3BzID0gY2hpbGRyZW5TdHJzLmxlbmd0aFxuICAgID8gJz4nXG4gICAgOiAnICc7XG4gIGNvbnN0IGNoaWxkcmVuSW5kZW50ZWQgPSBpbmRlbnRDaGlsZHJlbihjaGlsZHJlblN0cnMsIGluZGVudExlbmd0aCk7XG4gIGNvbnN0IG5vZGVDbG9zZSA9IGNoaWxkcmVuU3Rycy5sZW5ndGggPyBgPC8ke3R5cGV9PmAgOiAnLz4nO1xuICByZXR1cm4gYDwke3R5cGV9JHtiZWZvcmVQcm9wc30ke3Byb3BzfSR7YWZ0ZXJQcm9wc30ke2NoaWxkcmVuSW5kZW50ZWR9JHtub2RlQ2xvc2V9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlYnVnTm9kZXMobm9kZXMsIG9wdGlvbnMgPSB7fSkge1xuICByZXR1cm4gbm9kZXMubWFwKG5vZGUgPT4gZGVidWdOb2RlKG5vZGUsIHVuZGVmaW5lZCwgb3B0aW9ucykpLmpvaW4oJ1xcblxcblxcbicpO1xufVxuIl19
//# sourceMappingURL=Debug.js.map