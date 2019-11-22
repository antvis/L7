'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var TAB = '    ';
var SIZE_PROPS = function SIZE_PROPS(key) {
  return (/(width|height|background\-size)/g.test(key)
  );
};
var PROP_VALUE = function PROP_VALUE(size, key) {
  return key === 'background-size' ? size.width + 'px ' + size.height + 'px' : size[key] + 'px';
};
var PROP_SIZE = function PROP_SIZE() {
  for (var _len = arguments.length, prop = Array(_len), _key = 0; _key < _len; _key++) {
    prop[_key] = arguments[_key];
  }

  return '' + TAB + prop[1] + ': ' + PROP_VALUE.apply(null, prop) + ';';
};
var BASE_CSS = function BASE_CSS(data) {
  return ['', '.' + data.class.replace(/\s+/gi, '_') + ' {', TAB + 'background-image: url(\'' + data.background + '\');'];
};
var SIZE = function SIZE(data) {
  return Object.keys(data).filter(SIZE_PROPS).map(PROP_SIZE.bind(null, data.dimensions));
};

exports.default = function (data) {
  return BASE_CSS(data).concat(SIZE(data), ['}']).join('\n');
};