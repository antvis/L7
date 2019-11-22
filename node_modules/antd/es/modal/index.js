function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from 'react';
import Modal, { destroyFns } from './Modal';
import confirm from './confirm';
import Icon from '../icon';

function modalWarn(props) {
  var config = _extends({
    type: 'warning',
    icon: React.createElement(Icon, {
      type: "exclamation-circle"
    }),
    okCancel: false
  }, props);

  return confirm(config);
}

Modal.info = function infoFn(props) {
  var config = _extends({
    type: 'info',
    icon: React.createElement(Icon, {
      type: "info-circle"
    }),
    okCancel: false
  }, props);

  return confirm(config);
};

Modal.success = function successFn(props) {
  var config = _extends({
    type: 'success',
    icon: React.createElement(Icon, {
      type: "check-circle"
    }),
    okCancel: false
  }, props);

  return confirm(config);
};

Modal.error = function errorFn(props) {
  var config = _extends({
    type: 'error',
    icon: React.createElement(Icon, {
      type: "close-circle"
    }),
    okCancel: false
  }, props);

  return confirm(config);
};

Modal.warning = modalWarn;
Modal.warn = modalWarn;

Modal.confirm = function confirmFn(props) {
  var config = _extends({
    type: 'confirm',
    okCancel: true
  }, props);

  return confirm(config);
};

Modal.destroyAll = function destroyAllFn() {
  while (destroyFns.length) {
    var close = destroyFns.pop();

    if (close) {
      close();
    }
  }
};

export default Modal;
//# sourceMappingURL=index.js.map
