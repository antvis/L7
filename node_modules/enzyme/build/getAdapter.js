'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = getAdapter;

var _validateAdapter = require('./validateAdapter');

var _validateAdapter2 = _interopRequireDefault(_validateAdapter);

var _configuration = require('./configuration');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function getAdapter() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (options.adapter) {
    (0, _validateAdapter2['default'])(options.adapter);
    return options.adapter;
  }

  var _get = (0, _configuration.get)(),
      adapter = _get.adapter;

  (0, _validateAdapter2['default'])(adapter);
  return adapter;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9nZXRBZGFwdGVyLmpzIl0sIm5hbWVzIjpbImdldEFkYXB0ZXIiLCJvcHRpb25zIiwiYWRhcHRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7cUJBR3dCQSxVOztBQUh4Qjs7OztBQUNBOzs7O0FBRWUsU0FBU0EsVUFBVCxHQUFrQztBQUFBLE1BQWRDLE9BQWMsdUVBQUosRUFBSTs7QUFDL0MsTUFBSUEsUUFBUUMsT0FBWixFQUFxQjtBQUNuQixzQ0FBZ0JELFFBQVFDLE9BQXhCO0FBQ0EsV0FBT0QsUUFBUUMsT0FBZjtBQUNEOztBQUo4QyxhQUszQix5QkFMMkI7QUFBQSxNQUt2Q0EsT0FMdUMsUUFLdkNBLE9BTHVDOztBQU0vQyxvQ0FBZ0JBLE9BQWhCO0FBQ0EsU0FBT0EsT0FBUDtBQUNEIiwiZmlsZSI6ImdldEFkYXB0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdmFsaWRhdGVBZGFwdGVyIGZyb20gJy4vdmFsaWRhdGVBZGFwdGVyJztcbmltcG9ydCB7IGdldCB9IGZyb20gJy4vY29uZmlndXJhdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEFkYXB0ZXIob3B0aW9ucyA9IHt9KSB7XG4gIGlmIChvcHRpb25zLmFkYXB0ZXIpIHtcbiAgICB2YWxpZGF0ZUFkYXB0ZXIob3B0aW9ucy5hZGFwdGVyKTtcbiAgICByZXR1cm4gb3B0aW9ucy5hZGFwdGVyO1xuICB9XG4gIGNvbnN0IHsgYWRhcHRlciB9ID0gZ2V0KCk7XG4gIHZhbGlkYXRlQWRhcHRlcihhZGFwdGVyKTtcbiAgcmV0dXJuIGFkYXB0ZXI7XG59XG4iXX0=
//# sourceMappingURL=getAdapter.js.map