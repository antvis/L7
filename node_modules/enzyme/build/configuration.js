'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.merge = merge;
exports.reset = reset;

var _object = require('object.assign');

var _object2 = _interopRequireDefault(_object);

var _validateAdapter = require('./validateAdapter');

var _validateAdapter2 = _interopRequireDefault(_validateAdapter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var configuration = {};

function get() {
  return (0, _object2['default'])({}, configuration);
}

function merge(extra) {
  if (extra.adapter) {
    (0, _validateAdapter2['default'])(extra.adapter);
  }
  (0, _object2['default'])(configuration, extra);
}

function reset() {
  var replacementConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  configuration = {};
  merge(replacementConfig);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25maWd1cmF0aW9uLmpzIl0sIm5hbWVzIjpbImdldCIsIm1lcmdlIiwicmVzZXQiLCJjb25maWd1cmF0aW9uIiwiZXh0cmEiLCJhZGFwdGVyIiwicmVwbGFjZW1lbnRDb25maWciXSwibWFwcGluZ3MiOiI7Ozs7O1FBSWdCQSxHLEdBQUFBLEc7UUFJQUMsSyxHQUFBQSxLO1FBT0FDLEssR0FBQUEsSzs7Ozs7O0FBZmhCOzs7Ozs7QUFFQSxJQUFJQyxnQkFBZ0IsRUFBcEI7O0FBRU8sU0FBU0gsR0FBVCxHQUFlO0FBQ3BCLHNDQUFZRyxhQUFaO0FBQ0Q7O0FBRU0sU0FBU0YsS0FBVCxDQUFlRyxLQUFmLEVBQXNCO0FBQzNCLE1BQUlBLE1BQU1DLE9BQVYsRUFBbUI7QUFDakIsc0NBQWdCRCxNQUFNQyxPQUF0QjtBQUNEO0FBQ0QsMkJBQWNGLGFBQWQsRUFBNkJDLEtBQTdCO0FBQ0Q7O0FBRU0sU0FBU0YsS0FBVCxHQUF1QztBQUFBLE1BQXhCSSxpQkFBd0IsdUVBQUosRUFBSTs7QUFDNUNILGtCQUFnQixFQUFoQjtBQUNBRixRQUFNSyxpQkFBTjtBQUNEIiwiZmlsZSI6ImNvbmZpZ3VyYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdmFsaWRhdGVBZGFwdGVyIGZyb20gJy4vdmFsaWRhdGVBZGFwdGVyJztcblxubGV0IGNvbmZpZ3VyYXRpb24gPSB7fTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldCgpIHtcbiAgcmV0dXJuIHsgLi4uY29uZmlndXJhdGlvbiB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2UoZXh0cmEpIHtcbiAgaWYgKGV4dHJhLmFkYXB0ZXIpIHtcbiAgICB2YWxpZGF0ZUFkYXB0ZXIoZXh0cmEuYWRhcHRlcik7XG4gIH1cbiAgT2JqZWN0LmFzc2lnbihjb25maWd1cmF0aW9uLCBleHRyYSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNldChyZXBsYWNlbWVudENvbmZpZyA9IHt9KSB7XG4gIGNvbmZpZ3VyYXRpb24gPSB7fTtcbiAgbWVyZ2UocmVwbGFjZW1lbnRDb25maWcpO1xufVxuIl19
//# sourceMappingURL=configuration.js.map