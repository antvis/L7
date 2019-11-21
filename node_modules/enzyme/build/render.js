'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = render;

var _object = require('object.assign');

var _object2 = _interopRequireDefault(_object);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _getAdapter = require('./getAdapter');

var _getAdapter2 = _interopRequireDefault(_getAdapter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Renders a react component into static HTML and provides a cheerio wrapper around it. This is
 * somewhat asymmetric with `mount` and `shallow`, which don't use any external libraries, but
 * Cheerio's API is pretty close to what we actually want and has a significant amount of utility
 * that would be recreating the wheel if we didn't use it.
 *
 * I think there are a lot of good use cases to use `render` instead of `shallow` or `mount`, and
 * thus I'd like to keep this API in here even though it's not really "ours".
 *
 * @param node
 * @param options
 * @returns {Cheerio}
 */

function render(node) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var adapter = (0, _getAdapter2['default'])(options);
  var renderer = adapter.createRenderer((0, _object2['default'])({ mode: 'string' }, options));
  var html = renderer.render(node, options.context);
  return _cheerio2['default'].load('')(html);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZW5kZXIuanMiXSwibmFtZXMiOlsicmVuZGVyIiwibm9kZSIsIm9wdGlvbnMiLCJhZGFwdGVyIiwicmVuZGVyZXIiLCJjcmVhdGVSZW5kZXJlciIsIm1vZGUiLCJodG1sIiwiY29udGV4dCIsImNoZWVyaW8iLCJsb2FkIl0sIm1hcHBpbmdzIjoiOzs7OztxQkFpQndCQSxNOzs7Ozs7QUFqQnhCOzs7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7Ozs7Ozs7OztBQWNlLFNBQVNBLE1BQVQsQ0FBZ0JDLElBQWhCLEVBQW9DO0FBQUEsTUFBZEMsT0FBYyx1RUFBSixFQUFJOztBQUNqRCxNQUFNQyxVQUFVLDZCQUFXRCxPQUFYLENBQWhCO0FBQ0EsTUFBTUUsV0FBV0QsUUFBUUUsY0FBUiw0QkFBeUJDLE1BQU0sUUFBL0IsSUFBNENKLE9BQTVDLEVBQWpCO0FBQ0EsTUFBTUssT0FBT0gsU0FBU0osTUFBVCxDQUFnQkMsSUFBaEIsRUFBc0JDLFFBQVFNLE9BQTlCLENBQWI7QUFDQSxTQUFPQyxxQkFBUUMsSUFBUixDQUFhLEVBQWIsRUFBaUJILElBQWpCLENBQVA7QUFDRCIsImZpbGUiOiJyZW5kZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2hlZXJpbyBmcm9tICdjaGVlcmlvJztcbmltcG9ydCBnZXRBZGFwdGVyIGZyb20gJy4vZ2V0QWRhcHRlcic7XG5cbi8qKlxuICogUmVuZGVycyBhIHJlYWN0IGNvbXBvbmVudCBpbnRvIHN0YXRpYyBIVE1MIGFuZCBwcm92aWRlcyBhIGNoZWVyaW8gd3JhcHBlciBhcm91bmQgaXQuIFRoaXMgaXNcbiAqIHNvbWV3aGF0IGFzeW1tZXRyaWMgd2l0aCBgbW91bnRgIGFuZCBgc2hhbGxvd2AsIHdoaWNoIGRvbid0IHVzZSBhbnkgZXh0ZXJuYWwgbGlicmFyaWVzLCBidXRcbiAqIENoZWVyaW8ncyBBUEkgaXMgcHJldHR5IGNsb3NlIHRvIHdoYXQgd2UgYWN0dWFsbHkgd2FudCBhbmQgaGFzIGEgc2lnbmlmaWNhbnQgYW1vdW50IG9mIHV0aWxpdHlcbiAqIHRoYXQgd291bGQgYmUgcmVjcmVhdGluZyB0aGUgd2hlZWwgaWYgd2UgZGlkbid0IHVzZSBpdC5cbiAqXG4gKiBJIHRoaW5rIHRoZXJlIGFyZSBhIGxvdCBvZiBnb29kIHVzZSBjYXNlcyB0byB1c2UgYHJlbmRlcmAgaW5zdGVhZCBvZiBgc2hhbGxvd2Agb3IgYG1vdW50YCwgYW5kXG4gKiB0aHVzIEknZCBsaWtlIHRvIGtlZXAgdGhpcyBBUEkgaW4gaGVyZSBldmVuIHRob3VnaCBpdCdzIG5vdCByZWFsbHkgXCJvdXJzXCIuXG4gKlxuICogQHBhcmFtIG5vZGVcbiAqIEBwYXJhbSBvcHRpb25zXG4gKiBAcmV0dXJucyB7Q2hlZXJpb31cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZW5kZXIobm9kZSwgb3B0aW9ucyA9IHt9KSB7XG4gIGNvbnN0IGFkYXB0ZXIgPSBnZXRBZGFwdGVyKG9wdGlvbnMpO1xuICBjb25zdCByZW5kZXJlciA9IGFkYXB0ZXIuY3JlYXRlUmVuZGVyZXIoeyBtb2RlOiAnc3RyaW5nJywgLi4ub3B0aW9ucyB9KTtcbiAgY29uc3QgaHRtbCA9IHJlbmRlcmVyLnJlbmRlcihub2RlLCBvcHRpb25zLmNvbnRleHQpO1xuICByZXR1cm4gY2hlZXJpby5sb2FkKCcnKShodG1sKTtcbn1cbiJdfQ==
//# sourceMappingURL=render.js.map