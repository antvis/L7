'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.marksy = marksy;

exports.default = function (options) {
  return marksy(options);
};

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

var _babelStandalone = require('babel-standalone');

var _createRenderer = require('./createRenderer');

var _createRenderer2 = _interopRequireDefault(_createRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function marksy() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  // eslint-disable-next-line no-param-reassign
  options.components = options.components || {};

  var tracker = {
    tree: null,
    elements: null,
    nextElementId: null,
    toc: null,
    currentId: []
  };
  var renderer = (0, _createRenderer2.default)(tracker, options, {
    html: function html(_html) {
      try {
        // eslint-disable-next-line no-plusplus
        var elementId = tracker.nextElementId++;

        var _transform = (0, _babelStandalone.transform)(_html, {
          presets: ['react']
        }),
            code = _transform.code;

        var components = Object.keys(options.components).map(function (key) {
          return options.components[key];
        });
        var mockedReact = {
          createElement: function createElement(tag) {
            var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var componentProps = components.indexOf(tag) >= 0 ? Object.assign(props || {}, {
              // eslint-disable-next-line no-plusplus
              key: tracker.nextElementId++,
              context: tracker.context
            }) : props;

            for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
              children[_key - 2] = arguments[_key];
            }

            return options.createElement(tag, componentProps, children);
          }
        };

        tracker.elements[elementId] =
        // eslint-disable-next-line no-new-func
        new (Function.prototype.bind.apply(Function, [null].concat(['React'], _toConsumableArray(Object.keys(options.components)), ['return ' + code])))().apply(undefined, [mockedReact].concat(_toConsumableArray(components))) || null;

        tracker.tree.push(tracker.elements[elementId]);

        return '{{' + elementId + '}}';
      } catch (e) {
        //
      }
      return null;
    },
    code: function code(_code, language) {
      if (language === 'marksy') {
        return renderer.html(_code);
      }
      return (0, _createRenderer.codeRenderer)(tracker, options)(_code, language);
    }
  });

  return function compile(content) {
    var markedOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    tracker.tree = [];
    tracker.elements = {};
    tracker.toc = [];
    tracker.nextElementId = 0;
    tracker.context = context;
    tracker.currentId = [];
    (0, _marked2.default)(content, Object.assign({ renderer: renderer, smartypants: true }, markedOptions));

    return { tree: tracker.tree, toc: tracker.toc };
  };
}
//# sourceMappingURL=components.js.map