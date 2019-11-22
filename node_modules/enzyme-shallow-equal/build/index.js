'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports['default'] = shallowEqual;

var _objectIs = require('object-is');

var _objectIs2 = _interopRequireDefault(_objectIs);

var _has = require('has');

var _has2 = _interopRequireDefault(_has);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJzaGFsbG93RXF1YWwiLCJvYmpBIiwib2JqQiIsImtleXNBIiwiT2JqZWN0Iiwia2V5cyIsImtleXNCIiwibGVuZ3RoIiwic29ydCIsImkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O3FCQUl3QkEsWTs7QUFKeEI7Ozs7QUFDQTs7Ozs7O0FBRUE7QUFDZSxTQUFTQSxZQUFULENBQXNCQyxJQUF0QixFQUE0QkMsSUFBNUIsRUFBa0M7QUFDL0MsTUFBSSwyQkFBR0QsSUFBSCxFQUFTQyxJQUFULENBQUosRUFBb0I7QUFDbEIsV0FBTyxJQUFQO0FBQ0Q7O0FBRUQsTUFBSSxDQUFDRCxJQUFELElBQVMsQ0FBQ0MsSUFBVixJQUFrQixRQUFPRCxJQUFQLHlDQUFPQSxJQUFQLE9BQWdCLFFBQWxDLElBQThDLFFBQU9DLElBQVAseUNBQU9BLElBQVAsT0FBZ0IsUUFBbEUsRUFBNEU7QUFDMUUsV0FBTyxLQUFQO0FBQ0Q7O0FBRUQsTUFBTUMsUUFBUUMsT0FBT0MsSUFBUCxDQUFZSixJQUFaLENBQWQ7QUFDQSxNQUFNSyxRQUFRRixPQUFPQyxJQUFQLENBQVlILElBQVosQ0FBZDs7QUFFQSxNQUFJQyxNQUFNSSxNQUFOLEtBQWlCRCxNQUFNQyxNQUEzQixFQUFtQztBQUNqQyxXQUFPLEtBQVA7QUFDRDs7QUFFREosUUFBTUssSUFBTjtBQUNBRixRQUFNRSxJQUFOOztBQUVBO0FBQ0EsT0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlOLE1BQU1JLE1BQTFCLEVBQWtDRSxLQUFLLENBQXZDLEVBQTBDO0FBQ3hDLFFBQUksQ0FBQyxzQkFBSVAsSUFBSixFQUFVQyxNQUFNTSxDQUFOLENBQVYsQ0FBRCxJQUF3QixDQUFDLDJCQUFHUixLQUFLRSxNQUFNTSxDQUFOLENBQUwsQ0FBSCxFQUFtQlAsS0FBS0MsTUFBTU0sQ0FBTixDQUFMLENBQW5CLENBQTdCLEVBQWlFO0FBQy9ELGFBQU8sS0FBUDtBQUNEO0FBQ0Y7O0FBRUQsU0FBTyxJQUFQO0FBQ0QiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaXMgZnJvbSAnb2JqZWN0LWlzJztcbmltcG9ydCBoYXMgZnJvbSAnaGFzJztcblxuLy8gYWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9ibG9iLzE0NDMyOGZlODE3MTllOTE2Yjk0NmUyMjY2MDQ3OWUzMTU2MWJiMGIvcGFja2FnZXMvc2hhcmVkL3NoYWxsb3dFcXVhbC5qcyNMMzYtTDY4XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzaGFsbG93RXF1YWwob2JqQSwgb2JqQikge1xuICBpZiAoaXMob2JqQSwgb2JqQikpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmICghb2JqQSB8fCAhb2JqQiB8fCB0eXBlb2Ygb2JqQSAhPT0gJ29iamVjdCcgfHwgdHlwZW9mIG9iakIgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3Qga2V5c0EgPSBPYmplY3Qua2V5cyhvYmpBKTtcbiAgY29uc3Qga2V5c0IgPSBPYmplY3Qua2V5cyhvYmpCKTtcblxuICBpZiAoa2V5c0EubGVuZ3RoICE9PSBrZXlzQi5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBrZXlzQS5zb3J0KCk7XG4gIGtleXNCLnNvcnQoKTtcblxuICAvLyBUZXN0IGZvciBBJ3Mga2V5cyBkaWZmZXJlbnQgZnJvbSBCLlxuICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXNBLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgaWYgKCFoYXMob2JqQiwga2V5c0FbaV0pIHx8ICFpcyhvYmpBW2tleXNBW2ldXSwgb2JqQltrZXlzQVtpXV0pKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG4iXX0=
//# sourceMappingURL=index.js.map