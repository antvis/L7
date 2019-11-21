'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = mount;

var _ReactWrapper = require('./ReactWrapper');

var _ReactWrapper2 = _interopRequireDefault(_ReactWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Mounts and renders a react component into the document and provides a testing wrapper around it.
 *
 * @param node
 * @returns {ReactWrapper}
 */
function mount(node, options) {
  return new _ReactWrapper2['default'](node, null, options);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb3VudC5qcyJdLCJuYW1lcyI6WyJtb3VudCIsIm5vZGUiLCJvcHRpb25zIiwiUmVhY3RXcmFwcGVyIl0sIm1hcHBpbmdzIjoiOzs7OztxQkFRd0JBLEs7O0FBUnhCOzs7Ozs7QUFFQTs7Ozs7O0FBTWUsU0FBU0EsS0FBVCxDQUFlQyxJQUFmLEVBQXFCQyxPQUFyQixFQUE4QjtBQUMzQyxTQUFPLElBQUlDLHlCQUFKLENBQWlCRixJQUFqQixFQUF1QixJQUF2QixFQUE2QkMsT0FBN0IsQ0FBUDtBQUNEIiwiZmlsZSI6Im1vdW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0V3JhcHBlciBmcm9tICcuL1JlYWN0V3JhcHBlcic7XG5cbi8qKlxuICogTW91bnRzIGFuZCByZW5kZXJzIGEgcmVhY3QgY29tcG9uZW50IGludG8gdGhlIGRvY3VtZW50IGFuZCBwcm92aWRlcyBhIHRlc3Rpbmcgd3JhcHBlciBhcm91bmQgaXQuXG4gKlxuICogQHBhcmFtIG5vZGVcbiAqIEByZXR1cm5zIHtSZWFjdFdyYXBwZXJ9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1vdW50KG5vZGUsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIG5ldyBSZWFjdFdyYXBwZXIobm9kZSwgbnVsbCwgb3B0aW9ucyk7XG59XG4iXX0=
//# sourceMappingURL=mount.js.map