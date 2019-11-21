import Portal from 'rc-util/es/Portal';
import Trigger from './index';

Portal.prototype.render = function () {
  // eslint-disable-line
  return this.props.children;
};

var render = Trigger.prototype.render;

Trigger.prototype.render = function () {
  // eslint-disable-line
  var tree = render.call(this);

  if (this.state.popupVisible || this._component) {
    return tree;
  }

  return tree[0];
};

export default Trigger;