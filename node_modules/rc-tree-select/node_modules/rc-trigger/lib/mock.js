'use strict';

exports.__esModule = true;

var _Portal = require('rc-util/lib/Portal');

var _Portal2 = _interopRequireDefault(_Portal);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_Portal2['default'].prototype.render = function () {
  // eslint-disable-line
  return this.props.children;
};

var render = _index2['default'].prototype.render;

_index2['default'].prototype.render = function () {
  // eslint-disable-line
  var tree = render.call(this);

  if (this.state.popupVisible || this._component) {
    return tree;
  }

  return tree[0];
};

exports['default'] = _index2['default'];
module.exports = exports['default'];